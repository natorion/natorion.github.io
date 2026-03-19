# When your user is an AI agent: trust boundaries for browser access

"You're literally one prompt injection away from someone having unlimited access to all of your everything."

That was [one of the comments](https://news.ycombinator.com/item?id=47390817) when Chrome DevTools (MCP) for Agents hit the front page of Hacker News. 598 points, 234 comments. Security dominated the discussion.

They're raising the right question. When you give an AI agent access to your browser, it can see what you see: auth cookies, open tabs, payment forms, localStorage tokens. That's not a theoretical risk. That's the architecture.

*Disclaimer: the views in this post are my own and do not represent an official position of Google or the Chrome team.*

But "this is unsafe" collapses three different risk profiles into one. The more useful question: where does the risk actually live, and what are we doing about it?

In [part 1 of this series](/articles/TPSO), I argued that token efficiency is a product design problem. Security is too. When your user is an AI agent, the trust model shapes what you build. You can't bolt it on after shipping.

## What CDP actually exposes

Every browser-agent tool you've heard of, whether it's [Puppeteer](https://pptr.dev/), [Playwright](https://playwright.dev/), or MCP servers like [Chrome DevTools (MCP) for Agents](https://github.com/ChromeDevTools/chrome-devtools-mcp), connects to Chrome through the same interface: the [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) (CDP). CDP was designed for developer tooling. It assumes the client is trusted.

That assumption shows up in the protocol design: CDP has [zero authentication](https://embracethered.com/blog/posts/2020/chrome-spy-remote-control/). No API keys, no tokens, no passwords. When Chrome is launched with a remote debugging port, any process on your machine can query `localhost:9222/json/version`, get the WebSocket URL, and connect. The random UUID in the WebSocket URL isn't a secret; it's freely queryable via `GET http://localhost:9222/json/version` from the [same HTTP endpoint](https://chromedevtools.github.io/devtools-protocol/).

Once connected, a CDP client has full access to [everything in the browser](https://blog.shellntel.com/p/into-the-belly-of-the-beast):

- All cookies, including HttpOnly and session cookies, via `Network.getAllCookies()`
- All open tabs, with the ability to attach to any of them
- Local storage and session storage via `Runtime.evaluate`
- Arbitrary JavaScript execution in any tab context
- Full DOM of every page, including authenticated sessions
- Network interception, navigation, form filling

This isn't a bug. CDP was built for a world where the developer tools in your browser need full access to debug your application. The protocol does exactly what it was designed to do. What changed is the client: AI agents operate with different trust properties than a human developer clicking around in DevTools.

Every browser-agent tool inherits this surface area. [Puppeteer](https://pptr.dev/api/puppeteer.puppeteer.connect), [Playwright](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp), and every MCP server for browser automation all use the same unauthenticated WebSocket connection. There is no privilege separation between Puppeteer automating a test and an MCP server giving an AI agent full browser control.

## Three trust boundaries, three different products

The HN thread treated "AI agent with browser access" as one thing. It's at least three. Getting them confused is how you end up either too scared to ship ("this is all unsafe") or too confident in a single mitigation ("we added a dialog").

### Local development: your machine, your session

This is where most developers interact with browser-agent tools today. You're running Claude Code or Cursor, it connects to your browser, and the agent helps you debug your application. The trust boundary is your machine. The agent has the same access as any other local process you run.

The risk profile here is comparable to giving a tool terminal access. If you trust `npm install` to run arbitrary post-install scripts on your machine, you're already accepting a similar level of trust when you let a coding agent connect to your local browser. The agent can see your cookies the same way it could `cat ~/.config/google-chrome/Default/Cookies` from the terminal.

That said, "comparable to terminal access" doesn't mean "no risk." It means the mitigations should be proportional.

Chrome's [autoConnect feature](https://developer.chrome.com/blog/chrome-devtools-mcp-debug-your-browser-session) (Chrome 144+) is designed specifically for this scenario. It lets the MCP server connect to your already-running browser, including your default profile, but with a human in the loop at every step:

1. **Opt-in required.** You navigate to `chrome://inspect/#remote-debugging` and explicitly enable remote debugging. This is a developer-facing page, not something an agent or script can trigger.
2. **Per-connection approval.** Every time an MCP server requests a debugging session, Chrome shows a permission dialog. You click Allow or Deny. There is no "allow all" option.
3. **No persistent approvals.** When a tool disconnects or the browser restarts, the approval is gone. The tool has to request access again, and you have to approve again.
4. **Visual indicator.** While connected, Chrome displays a banner: "Chrome is being controlled by automated test software." You always know when something has access.

This is a deliberate product design choice: make the default profile accessible to agents, but require continuous human consent. A useful mental model: treat it like screen sharing. You wouldn't screen-share with someone you don't trust, but you also wouldn't refuse to screen-share with a colleague helping you debug.

There's an open tension here. [GitHub issue #825](https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/825) on the Chrome DevTools (MCP) for Agents repo is a feature request to persist approval across restarts. The community wants convenience. The Chrome team's response reflects the security constraint: "There is no simple solution that also would not allow any program on the machine to easily access your data in Chrome." Three approaches are under discussion (remember-my-choice checkbox, pre-authorization flags, token-based persistence), but none have shipped. The friction is intentional.

### Shared environments: CI, cloud browsers, team setups

When the browser isn't on your local machine, the trust boundary expands. A CI pipeline, a cloud-hosted browser instance, or a shared staging environment means multiple processes or users might interact with the same browser.

This is where Chrome 136 made a significant architectural decision. Starting with Chrome 136, the `--remote-debugging-port` flag [no longer works with Chrome's default profile](https://developer.chrome.com/blog/remote-debugging-port). You must specify a separate `--user-data-dir` pointing to a non-default directory. The Chrome team's rationale: "A non-standard data directory uses a different encryption key meaning Chrome's data is now protected from attackers."

`--user-data-dir` provides OS-level isolation: a separate Chrome instance with its own cookies, storage, credentials, history, and encryption keys. A different process, different data on disk, different encryption. Nothing about the debugging session can leak into or read from the user's real profile.

Browser contexts (incognito-style contexts created via CDP) look like they provide isolation, but they're logical partitions within a single process. We [shipped storage-isolated browser contexts](https://github.com/ChromeDevTools/chrome-devtools-mcp/pull/991) in Chrome DevTools (MCP) for Agents, and they do provide separate cookies and localStorage per context. But we built them for a functional reason: enabling multi-user testing scenarios like debugging chat applications where you need two simultaneous user sessions. They weren't designed as a security boundary, and they don't act as one. Any CDP client connected to the browser can enumerate and attach to targets across all contexts. [Puppeteer's documentation](https://pptr.dev/api/puppeteer.browsercontext) confirms this: contexts share the same process and the same CDP connection.

For shared environments, the recommendation is clear: separate `--user-data-dir` with separate Chrome processes. [Chrome for Testing](https://developer.chrome.com/blog/chrome-for-testing/) maintains the old remote debugging behavior without restrictions, precisely because it's designed for automation scenarios where profile isolation is the expected setup.

### Production agent fleets: autonomous agents at scale

This is the least-solved scenario and the one that justifies the strongest HN reactions.

Production agent fleets operate autonomously: navigating the web, extracting data, comparing prices across sites, all without a human watching each session.

Here, prompt injection stops being a local inconvenience and becomes a systemic risk. A malicious page can embed instructions in hidden HTML elements, [zero-width Unicode characters](https://embracethered.com/blog/posts/2024/claude-hidden-prompt-injection-ascii-smuggling/), or even [plain text that the agent interprets as commands](https://embracethered.com/blog/posts/2024/claude-computer-use-c2-the-zombais-are-coming/). The agent reads these as part of the page content and may follow them because it cannot reliably distinguish data from commands.

Traditional web security mechanisms like CSP and CORS still have value (CSP limits what scripts run on a page, CORS restricts cross-origin data access), but they weren't designed for this threat model. They protect web pages from each other. They don't protect an AI agent from reading malicious content on a page the agent has legitimately navigated to. And CDP can bypass many of these protections entirely: `Network.getAllCookies()` doesn't care about CORS, and `Runtime.evaluate` executes in the page context regardless of CSP.

The mitigations for this scenario are different in kind:

- **Sandboxed browser profiles** with no access to personal sessions or payment methods. The agent gets a clean, disposable environment. (Worth noting: even in the non-sandboxed agentic Chrome flow, the model [doesn't have direct access to stored passwords](https://security.googleblog.com/2025/12/architecting-security-for-agentic.html); sign-ins go through Password Manager with user confirmation.)
- **Restricted navigation policies.** Domain allowlists and URL pattern filtering ([a confirmed feature](https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/239) for Chrome DevTools (MCP) for Agents, driven by corporate adoption requirements) reduce the surface area. But they don't prevent prompt injection on an allowed domain: compromised pages, user-generated content, or injected ads can carry payloads on sites you trust.
- **Session monitoring and anomaly detection.** Log what the agent does, flag unexpected navigation or data exfiltration patterns.
- **Defense in the agent itself.** The model needs to be trained or prompted to recognize and ignore injected instructions. This is an active research area, not a solved problem.

None of these are complete. The distance between "agent can access a browser" and "agent can safely access the web autonomously" is where most of the security work still lives.

## Where the defenses actually live

The security was never in CDP, and it was never going to be. CDP is a full-access admin API for the browser, designed for trusted developer tooling. The defenses have to live around it.

**Profile isolation** separates what data the browser instance can access. Chrome 136's `--user-data-dir` enforcement and Chrome for Testing's automation-first design are architectural choices that limit the blast radius before a single CDP message is sent.

**Human consent gates** control when agents can connect. autoConnect's flow (opt-in, per-connection approval, no persistence) keeps a human in the loop when agents touch the real profile. It's friction by design.

**Prompt injection defenses** are the newest layer, and they're developing on both sides. On the browser side, Google's [agentic security architecture](https://security.googleblog.com/2025/12/architecting-security-for-agentic.html) includes a User Alignment Critic (a separate model that checks proposed actions against user intent, isolated from page content), a real-time prompt injection classifier in Chrome, and Agent Origin Sets that restrict which origins the agent can interact with. On the model side, agents are getting better at recognizing and ignoring injected instructions. Neither side has a complete answer yet, and this matters most for production agent fleets where there's no human to catch a hijacked action.

CDP was never scoped to handle access control. That's not unusual: plenty of powerful internal APIs assume a trusted caller and leave authentication to the layers around them. The question is whether those surrounding layers are thick enough for a world where the caller is a semi-autonomous agent.

## What's unsolved

I want to be direct about what remains open.

**Prompt injection defenses are progressing but incomplete.** Chrome's prompt injection classifier and User Alignment Critic are real mitigations, not theater. But the fundamental tension remains: the agent needs to process page content to be useful, and that same content can contain attacks. Defenses are getting layered (browser-side classifiers, model-side robustness, origin restrictions), but no one is claiming a complete solution yet.

**Persistence vs. security is unresolved.** The autoConnect consent flow resets on every browser restart. Annoying and necessary. The community wants persistence ([issue #825](https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/825)), but every proposed solution (remember-my-choice checkbox, pre-authorization flags, token-based systems) creates a path for non-interactive access to the browser. The Chrome security team is right to move carefully.

**Agent browser sessions are mostly unobservable.** What pages did the agent visit? What data did it extract? Did it navigate somewhere unexpected? Most teams building browser agents are focused on making them work. Auditability comes later, if it comes at all.

**The "screen sharing" mental model has limits.** It works for local development: one human, one agent, active supervision. It stops working for CI pipelines processing hundreds of agent sessions overnight. We don't yet have a good mental model for the shared and production trust boundaries. That's a gap worth naming.

## Designing for trust boundaries

If you're building a product that gives AI agents browser access, start with one question: which trust boundary are you designing for?

The answer changes your browser launch configuration, your profile isolation strategy, your consent model, and your monitoring requirements. A local development tool and a production agent fleet share a protocol but almost nothing else about their security posture.

In [part 1](/articles/TPSO), I argued that token burn rate belongs in your product metrics. Trust boundaries do too. They determine what you build, what you expose, and what you ask your users to accept.

The security story for browser-agent tools is being written in layers. Some of those layers were built for other reasons (multi-user testing) and happen to provide isolation as a side effect. Others were designed specifically as security boundaries (Chrome 136's `--user-data-dir` enforcement, autoConnect's consent flow, the agentic security architecture with its prompt injection classifier and User Alignment Critic). The full picture is still forming. I think that's true for every team shipping browser-agent tools right now.

The HN commenter was right to worry. What I hope this post shows is where the boundaries actually are, what's defended, and what's still open. If you're building in this space, your users deserve that same clarity.

