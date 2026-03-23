# Your agent doesn't know what you can do

[Chrome DevTools (MCP) for Agents](https://github.com/ChromeDevTools/chrome-devtools-mcp) had a performance trace tool. Its description said: "Starts a performance trace recording." Technically accurate. But when developers asked their coding agent to "check why my page is slow" or "fix my LCP," the agent didn't call it. The description didn't mention LCP, Core Web Vitals, or page load speed. The agent had no way to connect the user's intent to the tool's capability.

We rewrote the description: "Start a performance trace on the selected webpage. Use to find frontend performance issues, Core Web Vitals (LCP, INP, CLS), and improve page load speed." Same tool. Same functionality. The agent started finding it. [Issue #940](https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/940) on the repo captures the problem precisely: "AI agent does not automatically invoke MCP / performance tools without explicit instruction." The fix wasn't a new feature. It was better words.

This isn't a Chrome DevTools problem. A study of 856 MCP tools across 103 servers ([arxiv 2602.14878](https://arxiv.org/abs/2602.14878)) found that 97.1% have at least one description quality issue: vague parameter names, missing context, ambiguous purpose. Arcade.dev documents the same pattern across [8,000+ production tools](https://www.arcade.dev/blog/mcp-tool-patterns), identifying "Agent Experience" as a cross-cutting design concern. When the vast majority of tool interfaces have discoverability problems, the issue is systemic. And it has a direct cost: every wrong tool call burns tokens. In [part 1 of this series](/articles/TPSO), I introduced TPSO (Tokens per Successful Outcome) as the efficiency metric. Poor discoverability is one of its biggest inflators.

*Disclaimer: the views in this post are my own and do not represent an official position of Google or the Chrome team.*

## Why discoverability is different for agents

Humans discover product capabilities through visual affordances. Menus, icons, tooltips, progressive disclosure: the interface reveals itself as you explore. You hover over a button to see what it does. You browse a sidebar and find features you didn't know existed.

Agents can't do any of that. In the simplest case, they see a tool manifest: a list of names, descriptions, and parameter schemas. That list IS the product. Agent harnesses are starting to add dynamic tool search and on-demand discovery (and skills push in the same direction), but even dynamic discovery depends on the same foundation: descriptions good enough for the agent to match intent to capability.

If a capability isn't declared in the schema with enough context for the model to match it to a user's intent, that capability doesn't exist.

The consequences compound. A human who picks the wrong menu item clicks Back and tries again. An agent that picks the wrong tool burns tokens on the call, on processing the irrelevant response, and on deciding what went wrong. Wrong tool selection multiplies through every step of the agentic loop.

The server exposes 29 tools. When an agent receives "check why my page is slow," it scans 29 descriptions and picks a starting point. If your descriptions read like internal function names instead of intent-matching phrases, the agent is guessing. And guessing at scale is expensive.

## Declared surface area

**Declared surface area** is the set of capabilities an agent can discover and correctly invoke from your schema alone, without external documentation, prior training data, or trial and error.

Your actual surface area is everything your product can do. The gap between actual and declared surface area is **discoverability debt**: capabilities that exist but that agents can't reliably access.

Discoverability debt comes in three forms:

**Undeclared capabilities.** Features exist but aren't in the schema. A common version of this: your API can filter results by date, but the parameter isn't in the tool definition. The capability is real. The agent will never use it.

**Ambiguous declarations.** The tool exists, but the description doesn't disambiguate it from other tools. We hit this with performance tools versus Lighthouse audits. Both relate to "page performance," but they do fundamentally different things. Without explicit disambiguation ("This excludes performance. For performance audits, run startTrace"), agents guess wrong. [PR #965](https://github.com/ChromeDevTools/chrome-devtools-mcp/pull/965) added use-case context, specific metric names, and routing guidance to fix this.

**Over-declared surfaces.** Too many tools with overlapping descriptions. More tools means more chances for confusion and more tokens spent on the manifest itself. This is why we built [slim mode](https://github.com/ChromeDevTools/chrome-devtools-mcp/pull/958): three tools instead of 29, dropping from roughly 6,940 tokens to 359. Less declared surface area, better discoverability for the tools that remain.

The metric that connects discoverability to cost: **discovery rate**, the percentage of agent tool calls that select the correct tool on first attempt. Every wrong selection adds a retry loop that inflates TPSO from Part 1. If your TPSO is higher than expected, check your discovery rate before assuming the problem is response size. (More on how to measure this below.)

### Happy paths that always should work

Frameworks are useful. But the practical, shippable version of measuring discoverability is simpler: define the obvious use cases and test whether the agent finds the right tool.

We maintain [18 eval scenarios](https://github.com/ChromeDevTools/chrome-devtools-mcp/tree/main/scripts/eval_scenarios) that do exactly this. Each scenario pairs a natural language prompt with expected tool calls:

- "Check the performance of https://developers.chrome.com" should call `navigate_page` then `performance_start_trace`
- "Check a11y issues on the current page" should call `lighthouse_audit`
- "Can you fix issues with my webpage?" should call a navigation tool, then at least one of `take_snapshot`, `list_console_messages`, or `list_network_requests`

These are smoke tests for discoverability. If the agent can't find the right tool for the obvious use case, the schema is broken. You don't need a formal benchmark to start. You need five prompts that represent your product's happy paths, and a check for whether the agent selects the correct tool on the first try. Run them against a real model, repeat for consistency, and you'll catch discoverability regressions before users do.

## What we changed and why

### From minimal to context-rich descriptions

The initial tool descriptions were functional but bare. "Navigates the currently selected page to a URL." "Creates a new page." "Starts a performance trace recording." Each one accurately described the tool's behavior. None of them helped an agent match user intent to tool capability.

The rewritten descriptions added three things: **action context** ("Go to a URL, or back, forward, or reload"), **use-case enumeration** ("Use to find frontend performance issues, Core Web Vitals (LCP, INP, CLS), and improve page load speed"), and **routing guidance** ("This excludes performance. For performance audits, run startTrace").

The pattern that emerged: descriptions need to answer "when should an agent call this?" not just "what does this tool do?" The `press_key` tool makes this explicit: "Press a key or key combination. Use this when other input methods like fill() cannot be used (e.g., keyboard shortcuts, navigation keys, or special key combinations)." It defines its own scope by pointing to the preferred alternative. The agent doesn't have to guess which input method to try first.

This isn't an MCP-specific problem. The same pattern shows up in REST APIs. The Smelly Tool Descriptions paper highlights a stock price API with a `period` parameter whose description mentions "use period parameter or use start and end" without naming `start` and `end` as explicit parameters or specifying a date format. The agent can't construct a bounded date range, so it defaults to broad queries that return far more data than needed. Renaming to explicit `start_date` and `end_date` parameters with `yyyy-mm-dd` format fixes the problem at the schema level. The capability was always there; the declaration was broken.

### Skills as a discoverability solution

Individual tools are primitives. Debugging a slow page load isn't a single tool call; it's a five-step sequence: navigate, start a performance trace, analyze specific insights (LCP breakdown, render-blocking resources, document latency), identify the LCP element via JavaScript, then audit network requests for resource timing data.

Expecting an agent to discover this sequence from 29 tool descriptions is unrealistic. Skills solve this by packaging the workflow into a single high-level capability. Our `debug-optimize-lcp` skill encodes the entire diagnostic sequence: which `performance_analyze_insight` names to request, which JavaScript snippets to run, and how to interpret results across four LCP subparts (TTFB, Resource Load Delay, Resource Load Duration, Element Render Delay).

This is fundamentally a discoverability pattern. Instead of the agent needing to discover the right 5-tool sequence from 29 options, it needs to match "fix my LCP" to one skill. The discovery problem drops from combinatorial to linear.

The MCP ecosystem is working on this. The [experimental-ext-skills](https://github.com/modelcontextprotocol/experimental-ext-skills) interest group documents the gaps: no mechanism for discovering what skills a server offers, no coordination model for multi-server workflows. A formal proposal ([SEP-2076](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/2076)) to make skills a protocol primitive didn't advance; the community is converging on skills as conventions using existing primitives instead. The problem is acknowledged. The solution is still forming.

### The discoverability-efficiency tradeoff

**Discoverability and efficiency pull in opposite directions.** A rich tool manifest with detailed descriptions is highly discoverable but costs thousands of tokens just to load. A minimal interface is efficient but requires the agent to already know what's available.

The right choice depends on whether the agent is exploring or executing. First encounter? Discoverability: detailed descriptions, routing guidance, explicit scope boundaries. Known workflow, hundredth run? Efficiency: minimal overhead, direct invocation.

We see this tradeoff play out in two ways. Slim mode reduces the manifest from 29 tools at 6,940 tokens to 3 tools at 359. An agent using slim mode can't discover the performance tracing workflow, but it can do anything through JavaScript evaluation and screenshots. You trade discoverability for efficiency, and for agents that know what they're doing, that's the right trade. The server's CLI interface pushes this further: agents run commands directly (`chrome-devtools navigate_page --url https://example.com`) with no manifest overhead at all, but they need to already know the exact syntax.

### Proactive rerouting as second-chance discovery

Not every discoverability problem can be solved in the schema. Our `lighthouse_audit` tool proactively communicates scope boundaries in its response: "This excludes performance. For performance audits, run startTrace." That's not an error message. The tool worked correctly. But it anticipates the common misroute and redirects before the agent goes further down the wrong path.

You can't guarantee that every agent will pick the right tool on the first attempt. But you can design responses that steer agents toward the right tool before they waste tokens on a dead end.

## What the ecosystem is learning

The "Smelly Tool Descriptions" paper ([arxiv 2602.14878](https://arxiv.org/abs/2602.14878)) provides the most systematic analysis to date. Researchers at Queen's University analyzed 856 tools across 103 MCP servers and identified six types of description "smells":

- Unclear Purpose (56% of tools)
- Missing Usage Guidelines (89.3%)
- Unstated Limitations (89.8%)
- Opaque Parameters (84.3%)
- Underspecified or Incomplete descriptions (79.1%)
- Missing Examples (77.9%)

97.1% of tools had at least one smell. Official MCP servers (maintained by GitHub, PayPal, Anthropic, Microsoft) showed no statistically significant quality difference from community servers. Poor discoverability is systemic.

When the researchers augmented descriptions with the missing components, task success rates improved by a median of 5.85 percentage points, but agents took 67% more execution steps with richer descriptions. More information helps agents find the right tool, but it also gives them more to process. This is the discoverability-efficiency tension from a different angle.

The problem extends beyond MCP. [Jentic's analysis](https://jentic.com/blog/press-AI-readiness-scorecard) of over 1,500 APIs found authentication details buried in prose instead of specs, invalid OpenAPI documents, and missing required parameters. This is discoverability debt at the specification layer.

The OpenAPI Initiative's [Moonwalk SIG](https://github.com/OAI/sig-moonwalk) has made agent consumption its [2026 focus](https://github.com/OAI/sig-moonwalk/discussions/219): capability discovery beyond endpoint-level descriptions, and whether API specs can be simplified specifically for LLM-based journeys. On the web surface, [WebMCP](https://developer.chrome.com/blog/webmcp-epp) (early preview, Chrome 146) proposes structured APIs for websites to declare how agents should interact with them, instead of parsing raw DOM. The same discoverability principle, applied at every layer of the stack.

## Measuring your own discoverability debt

Start with your five most common user intents. Not your five most-called tools; the five things users actually ask agents to do with your product. "Check why my page is slow." "Find accessibility issues." "Debug this API error." Write them down as natural language prompts.

Then run each prompt against your tool manifest and see which tool the agent selects. You can do this manually (paste the manifest and prompt into any LLM and ask which tool it would call) or build lightweight evals like our scenario tests. If the agent picks the wrong tool, you've found discoverability debt. The description didn't bridge the gap between what the user said and what your tool does.

Three things to check for each tool description:

1. **Does it answer "when should I call this?"** not just "what does this do?" A description that says "Starts a performance trace recording" answers the second question. One that says "Use to find frontend performance issues, Core Web Vitals (LCP, INP, CLS), and improve page load speed" answers the first.
2. **Does it disambiguate from similar tools?** If two tools could plausibly match the same prompt, add explicit routing: "This excludes X. For X, use Y."
3. **Does it use the user's vocabulary?** Agents match user intent to tool descriptions. If your users say "LCP" but your description says "performance trace," the match fails.

Fix the worst offender first. Rerun your five prompts. Measure whether the agent finds the right tool more often. This is your discovery rate, and improving it is the fastest way to reduce TPSO without touching your response payloads. In [part 2](/articles/trust-boundaries-browser-agents), I argued that security decisions shape what agents can access. Discoverability determines whether they find it. An agent that passes every trust boundary but can't locate the right tool still fails the task.

## What's unsolved

**Cross-server discovery.** MCP defines how an agent discovers tools within a connected server, not how it discovers which server to connect to. With 2,000+ servers in the registry, matching user intent to the right server is unsolved.

**Schema drift.** Tool descriptions are written once and maintained rarely. The code evolves; the descriptions don't. Six months after launch, your descriptions document the product you shipped, not the product you have. Our eval scenarios catch some of this (if the agent stops finding the right tool, the test fails), but most teams don't have eval infrastructure.

**Composition discovery.** An agent connected to three MCP servers has three independent tool manifests. Nothing tells it that Server A's output is Server B's expected input. Multi-server workflows are invisible at the schema level. The experimental-ext-skills work acknowledges this gap, but it's early.

**No standard benchmark for schema quality.** The Smelly Tool Descriptions paper provides a taxonomy, but there's no widely-adopted score or lint tool that rates a tool manifest for discoverability. Teams know they should write better descriptions. They don't have a way to measure whether they did.
