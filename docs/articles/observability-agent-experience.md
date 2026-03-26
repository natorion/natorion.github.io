# Your agent experience has no dashboard

[Chrome DevTools (MCP) for Agents](https://github.com/ChromeDevTools/chrome-devtools-mcp) has 18 eval scenarios that test whether agents find the right tool. In [part 3 of this series](/articles/discoverability-agent-experience), I described them as "smoke tests for discoverability." They are. But they run when we remember to run them. Between runs, we're blind.

When a tool description regressed after a refactor, we found out because a user filed [issue #940](https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/940). The eval scenarios would have caught it. They just hadn't been run. We had tests. We didn't have observability.

This series has introduced three metrics across three posts. TPSO (Tokens per Successful Outcome) for efficiency in [part 1](/articles/TPSO). Trust boundary compliance for security in [part 2](/articles/trust-boundaries-browser-agents). Discovery rate for discoverability in part 3. Each one measures something real. None of them are tracked continuously by most teams building agent-facing products. Including ours.

Agent experience observability is where web performance monitoring was before Core Web Vitals. Everyone agrees it matters. Nobody agrees on what to measure or what "good" looks like.

*Disclaimer: the views in this post are my own and do not represent an official position of Google or the Chrome team.*

## What you'd want to measure, and can't

Each metric from this series sounds straightforward in isolation. Measuring any of them in production turns out to be harder than defining them.

**TPSO** requires two things: the total tokens consumed across an interaction, and whether the outcome was successful. The MCP server has one half of this picture. We know the token cost of our responses. We control their size; that's the optimization story from part 1. But we don't know whether the agent succeeded at the user's task. Did the performance diagnosis actually help the developer fix their LCP? Did the agent communicate the right finding? That information lives in the agent host: Claude Code, Cursor, Gemini CLI. The server never sees it.

**Trust boundary compliance** is more observable because it operates at the transport layer. Did the agent connect through autoConnect's consent flow? Did it stay within domain allowlists? Did it use an isolated browser profile? These events generate logs. But they're scattered: Chrome's internal logging captures some, the MCP server's stdout captures others, the agent host's conversation log captures the rest. Aggregating them into a single compliance view is architecturally possible through OpenTelemetry pipelines or MCP gateways, but no current tool handles it automatically. Even the leading enterprise observability vendors haven't solved this yet, which tells you how early we are.

**Discovery rate** requires correlating tool selection with user intent. In our eval scenarios, we define the intent ("check why my page is slow") and the expected tool calls (`navigate_page` then `performance_start_trace`). That works for 18 predefined prompts. In production, users ask things we haven't anticipated. Determining whether the agent picked the "right" tool for an open-ended request requires understanding the intent, which is exactly the kind of judgment that's hard to automate. What helps most is dogfooding: be your own customer zero. Use your tool through agents the way your users do. You'll catch the most glaring failures before anyone files an issue, because you know what "working" looks like.

Each metric is measurable in a lab. None are continuously observable in production. The gap isn't conceptual. It's structural.

## The visibility gap between server and host

Here's the core problem. The MCP server knows its own internals: which systems it connects to, what policies govern them, how responses are constructed. The agent sees the server's responses but not the architecture behind them. When an agent calls Chrome DevTools MCP, it doesn't understand the browser policies, the connection model, or the constraints that shaped the response it received.

Our server logs which tool is called, by which client, within a session. We track daily active usage. This telemetry exists and ships to production.

What we don't see: what the agent considered calling but didn't, how many tokens the agent spent reasoning about which tool to pick, or whether the user's task was completed. When an agent calls `performance_start_trace` and then `performance_analyze_insight`, we see both calls independently. We don't see that the agent tried two other insight names first and burned tokens on those failed attempts.

The agent host already has most of the picture. Claude Code or Cursor sees the full conversation, the token consumption, response sizes, response latency, the tool selection reasoning, and whether the user expressed satisfaction or frustration. The host knows things the server never will. But the host doesn't know the internal quality metrics of each server's responses. It doesn't know that our performance trace response was optimized to 400 tokens from an original 50,000, or that the Lighthouse audit response proactively included routing guidance to prevent a common misroute.

This maps to a familiar observability problem. Web performance monitoring went through the same split. Server-side metrics (response time, error rates, throughput) existed for years before Real User Monitoring (RUM) gave teams the client-side picture. Server metrics told you how fast you served the page. RUM told you how fast the user experienced it. Those turned out to be different numbers. The parallel for agent experience: the server needs signals from the host to understand whether its design choices are working. The host has the data. The server has to earn access to it through better instrumentation and emerging standards.

## Where the instrumentation stands today

If you're building an MCP server or CLI tool used by agents, the first job is understanding how your agent users actually use it. That means tracking a concept of a session, the actions taken within it, and which type of client (Claude Code, Gemini CLI, Cursor) is calling. Combine that with internal operational metrics: response speed, success or failure of each action. This is the foundation.

We added telemetry to Chrome DevTools MCP for exactly this reason. We had anecdotal evidence that setting up the server was difficult. The telemetry showed that sessions with only one tool call to `list_pages` failed at a high rate. That pattern told a clear story: users were trying to connect, failing, and giving up. Based on this, we added a troubleshooting skill that helps get the server up and running correctly. Without session-level telemetry, that insight would have stayed anecdotal.

**Standardization is emerging but early.** OpenTelemetry's GenAI SIG has published [semantic conventions for MCP](https://opentelemetry.io/docs/specs/semconv/gen-ai/mcp/) that define how to represent tool calls as spans, with attributes for method names, session IDs, and error types. Trace context propagation between MCP clients and servers landed in the MCP specification in February 2026 ([PR #414](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/414)), using W3C `traceparent` in the request's `_meta` field. The mechanism exists, but it's designated "Development" status and the format ["is likely to change."](https://opentelemetry.io/docs/specs/semconv/gen-ai/mcp/) More importantly, no major MCP client (Claude Code, Cursor, Gemini CLI) implements these conventions yet. Your server can emit its own telemetry independently, which is valuable on its own. But the correlated end-to-end trace across client and server only works when both sides implement the standard, and that's not happening in practice today.

**APM vendors** are building adjacent capabilities. Datadog's [integration with Google's Agent Development Kit](https://www.infoq.com/news/2026/02/datadog-google-llm-observability/) and Splunk's [AI Agent Monitoring](https://www.splunk.com/en_us/blog/observability/monitor-llm-and-agent-performance-with-ai-agent-monitoring-in-splunk-observability-cloud.html) trace token usage, latency, and cost per agent workflow. These tools monitor the agent. That's valuable, but it's a different problem than measuring agent experience with your product. Monitoring the agent is the host's job. Measuring how agents experience your server is yours.

## Toward an agent experience scorecard

This series defined three metrics for agent experience. Each measures something real. Each has a measurement challenge.

| Metric | What it tells you | Who can measure it |
|--------|-------------------|--------------------|
| TPSO | Is the interaction cheap enough and successful? | Requires server + host data |
| Trust boundary compliance | Is the interaction within bounds? | Transport/infrastructure layer |
| Discovery rate | Does the agent find the right capability? | Requires eval infrastructure |

A fourth metric belongs on this list: **outcome success rate**. Did the agent accomplish the user's task using your tools? This is the hardest to capture because it requires knowing the user's intent and evaluating the result. It's also the only one that ultimately matters. The first three metrics are means. Outcome success is the end.

You can't measure outcome success from the server side alone, but you can observe behavioral proxies. If the agent calls `performance_start_trace` and then immediately follows with `performance_analyze_insight`, the sequence suggests the first result was useful enough to continue the workflow. If the agent doesn't retry the same tool, that's a weak signal of success. If the agent abandons your server entirely and calls a different tool provider, that's a stronger signal of failure. These aren't ground truth. They're testable hypotheses: patterns you can log, correlate over time, and validate against the eval scenarios where you do know the right answer.

Cross-team benchmarks don't exist for any of these. We can benchmark our own configurations against each other: an internal harness compares slim mode versus full mode, different response shapes, different tool descriptions. Slim mode improved TPSO for a certain class of usage but regressed it for others. We can measure those tradeoffs. But this is lab data, not field data. We can't compare to other browser automation servers, database tools, or code analysis servers, because nobody publishes their numbers.

This is where the Core Web Vitals parallel is sharpest. Before Google introduced CWV in [May 2020](https://blog.chromium.org/2020/05/introducing-web-vitals-essential-metrics.html), web performance measurement was fragmented. Teams tracked different metrics (Time to Interactive, First Meaningful Paint, Speed Index), used different tools, and had no shared thresholds for "good." Individual metrics existed. Lab tests existed. What didn't exist was a field-measurable, universally adopted standard with defined thresholds that created shared expectations across the industry. CWV solved that for web performance. Agent experience has no equivalent yet.

The OpenTelemetry GenAI SIG is doing the groundwork: defining how to emit telemetry, not what "good" looks like. That's the right sequencing. You need consistent measurement before you can set thresholds. But as discussed above, no major MCP client implements these conventions yet, and the spec is still in flux. The gap between "we can emit spans" and "we know what to optimize for" is where most teams are stuck today.

**What you can do now:** Instrument for future connectivity, even if nobody is listening yet. Add trace IDs to your tool invocation logs. Log tool call sequences in dev and staging environments where privacy constraints are looser. Record the behavioral proxies: did the agent follow up with a dependent tool, or did it abandon and retry? You can't measure outcome success without the host's cooperation, but you can build the plumbing so your server is ready to correlate when hosts start sharing signals.

For validation, build lightweight evals like our [18 scenario tests](https://github.com/ChromeDevTools/chrome-devtools-mcp/tree/main/scripts/eval_scenarios). Define your five most common agent use cases (the same ones from the discoverability audit in part 3), run them regularly, and track whether the right tools get selected. These are workarounds, not solutions. They don't close the structural visibility gap. But they give you a baseline to measure against when the infrastructure catches up.

## What's unsolved

**Cross-server correlation is nascent.** The trace context mechanism exists (W3C `traceparent` in MCP's `_meta` field), but it's provisional and not widely adopted. An agent connected to three MCP servers could theoretically generate correlated traces across all three. In practice, most servers don't implement it yet, and the format may change.

**No standard for "good."** What's an acceptable TPSO? What discovery rate should you target? Without cross-team benchmarks, every team optimizes in isolation. The Chrome DevTools MCP team can measure that slim mode improved TPSO for some usage patterns and regressed it for others. They can't compare those numbers to other browser automation servers, database tools, or code analysis servers.

**Outcome measurement requires host cooperation.** The most important metric (did the agent succeed?) is only visible to the agent host. Server builders either need the host to share success signals, or they need to infer success from behavioral patterns: the agent didn't retry, which might mean it succeeded, or might mean it gave up. Both look the same from the server's side.

**Eval drift.** Eval scenarios are written at one point in time. As the product evolves, scenarios may not cover new capabilities. As models improve, scenarios that were difficult become trivially easy and stop being useful signals. The practice that works: treat evals like tests in your CI harness. Run them on every change. When they fail, either fix the code or update the eval. Our evals are added reactively ([issue #921](https://github.com/ChromeDevTools/chrome-devtools-mcp/issues/921) added a scenario after observing an LLM misusing the `select_page` tool), but they run with the same discipline as any other test suite.

**Privacy.** Richer observability means logging more about agent interactions, which may include user data. If you add logging, respect the same privacy guidelines you would for any other system in your infrastructure. This isn't a new problem; it's the same discipline applied to a new surface.

## Closing the loop

This series started with a number. Tokens per Successful Outcome. A metric for how expensive it is when an agent uses your product. Four posts later, the picture is broader: efficiency, security, discoverability, and now measurement.

What I've been calling "agent experience" across these posts is forming into something recognizable as a discipline. The metrics are defined, if imperfect. The tooling is emerging. Benchmarks don't exist yet. But the arc is familiar. Web performance went from ad-hoc server timing to Real User Monitoring to Core Web Vitals over roughly a decade. Agent experience is somewhere in the early chapters of that story.

The uncomfortable version of this: we are shipping agent-facing products without knowing if they work. Not whether they return correct responses; we can test that. Whether agents actually succeed at the tasks users bring to them. That's not a metrics gap. It's a product risk. And it's one that every team building for agents shares right now, whether they've named it or not.

The teams that start instrumenting now will have the data to shape the standards when they arrive. Everyone else will be benchmarked by numbers they didn't help define.
