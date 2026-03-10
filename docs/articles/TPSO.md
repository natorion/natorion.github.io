# Your API is costing agents money - what makes Tokens per Successful Outcome relevant

The Chrome DevTools MCP server shipped a performance trace endpoint that returned 50,000 lines of JSON. Technically correct. An agent calling it got the full trace, parsed it, and produced a performance diagnosis. It also burned through most of its context window in a single call.

We designed it the way we'd design any API: return the complete data, let the consumer decide what's relevant. That assumption works when the consumer is a human developer who glances at a waterfall chart and immediately knows where to look. It does not work when the consumer is an LLM that has to ingest every single line before it can reason about any of them.

Here's the math on responses like that. A system called a million times a day, with each response averaging 300 tokens, generates 300 million output tokens daily. At current API pricing, that's roughly €4,100 a day. €1.5 million a year. From one endpoint. And that's a conservative example. Some of our early responses were orders of magnitude larger than 300 tokens. But the cost wasn't just financial. Agents were failing 40% of the time because they got lost in the noise: the response contained the answer, but the signal was buried in so much context that the model couldn't reliably extract it. You can tolerate an expensive API. You can't tolerate one that burns your budget and still doesn't deliver the outcome.

Tokens are cognitive load for agents, the way clicks are cognitive load for humans. And right now, most APIs are the equivalent of a checkout flow with 14 screens. The API teams building them don't know that, because they've never had to care about the size of their responses from the consumer's perspective. The response worked. The data was complete. What else mattered? Now something else matters.

## What tokens actually cost

If you're a PM or engineering leader who hasn't had to think about tokens yet: a token is roughly three-quarters of a word. Every word your API sends back is metered. Input tokens cost money when the agent reads your response. Output tokens cost money when the agent reasons about what it read. Both meters are running every time your endpoint gets called.

Context windows are the hard ceiling. They're the agent's working memory. Everything the agent needs to reason about has to fit inside that window: every API response, every tool description, every prior conversation turn. When it fills up, the agent either drops earlier context (forgetting things it already learned) or stops functioning entirely. There's no "scroll down" for an agent. There's no "let me open another tab." The window is all there is.

Even if tokens were free tomorrow, latency would still kill agentic workflows. Reading 50,000 lines takes time. Reasoning over 50,000 lines takes more time. In an agentic loop where the model calls your API, processes the response, decides the next step, and calls another API, a 30-second delay on one call is a bounce. The agent stalls, the user gives up, the task fails. "Just wait for cheaper tokens and bigger context windows" is a losing strategy because it only addresses one of the two costs. You can't engineer your way out of physics: more data always means more latency, and agents operate on tighter time budgets than humans do.

For humans, the bottleneck is attention. For agents, it's context space and cost per token. Both are finite. Both are consumed by your design choices. The difference is that nobody sends your human users a bill for each click.

## From cognitive load to token burn rate

UX as a discipline exists because someone realized that reducing cognitive load for humans was a design problem, not a user problem. You don't blame users for struggling with a bad interface. You fix the interface. The same logic applies to agents. The instrument changes: instead of measuring clicks and time-on-task, you measure tokens consumed and tasks completed.

This is where I think the concept of token burn rate earns its name. Your API determines the token burn rate for every agent that calls it. Not the agent developer. Not the model provider. You, the team that designed the response shape.

"Burn rate" is already PM vocabulary. Cash burn rate is the amount of money a startup spends per month before reaching profitability. Token burn rate is the amount of context an agent spends per task before reaching a useful outcome. Both are finite resources you should measure and manage. Both tell you something about efficiency that a binary success/failure metric misses. And just like cash burn rate, the number itself isn't good or bad. What matters is whether you know it and whether it's proportional to the value delivered.

Back to that 50,000-line performance trace. We replaced it with a semantic summary: "LCP was 3.2 seconds due to render-blocking CSS in main.css." Same diagnostic value. The agent got the insight it needed without ingesting the raw trace. The token cost dropped by orders of magnitude, and task completion actually improved because the agent wasn't drowning in data it couldn't prioritize.

We hit the same problem with network requests. Real web pages make hundreds of network connections. Returning all of them in a single response blew through the model's context window entirely, producing an error instead of a diagnosis. We added pagination. Not because agents asked for it; because we watched them fail and traced the failure to response size. The fix wasn't smarter agents. It was a less wasteful API.

## The patterns that actually work

When we rewrote error messages in [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp), the token savings were a side effect. The real gain was recoverability.

Our navigation tool used to return: "Unable to navigate back in currently selected page." An agent reading that has no idea what went wrong. It doesn't know if the page crashed, if the tool is broken, or if there's a prerequisite it missed. So it retries. And retries. Each retry burns more tokens and gets the same useless error. We changed the message to: "Cannot navigate back: no previous page in history." Now the agent understands the failure mode, stops retrying, and adjusts its strategy. The [cost-effective LLM applications research](https://www.glukhov.org/post/2025/11/cost-effective-llm-applications/) puts the reduction from clearer error messages at 30-40%. That includes both the shorter message itself and the retries you eliminate.

Structured JSON versus prose is the blunter instrument, but it scales. Returning a JSON object instead of a natural language description of the same data cuts token usage by roughly 70%. If your API currently returns "The server responded with a 200 OK status and the user's profile was successfully retrieved, containing their name, email, and account creation date," you can return `{"name": "...", "email": "...", "created": "..."}` instead. The agent parses both. One costs a fraction of the other.

This doesn't mean building two separate API layers. Content negotiation handles it: a header like `Accept: application/vnd.agent+json` triggers the optimized response shape. Same endpoint, different representation. This is how HTTP has always worked. Your human-facing documentation gets the verbose response; agents get the structured one. No new infrastructure, no parallel maintenance burden.

Run the numbers on the €1.5 million baseline: a 30% overall reduction through structured outputs, semantic chunking, and concise errors brings it to just over €1 million. That's roughly €450,000 saved annually. But the bigger win is reliability. Those same changes cut task failure rates because agents stopped drowning in irrelevant context. The money matters; the fact that agents actually complete the task matters more. A PM can explain a cost overrun. A PM can't explain why the product doesn't work. These are product design decisions, not infrastructure changes.

Semantic chunking versus character-based splitting is the one most teams haven't tried yet. When you split content for retrieval or paginate long responses, breaking at meaning boundaries instead of arbitrary character counts reduces token waste by 70-90%. The reason: agents stop receiving half-sentences and context-free fragments they have to reassemble before they can reason about them. A 500-token chunk that contains one complete concept is worth more than a 500-token chunk that contains the tail of one concept and the beginning of another. The agent processes fewer chunks total because each one is self-contained.

## Why this isn't just an engineering problem

If this were purely a backend optimization, you'd hand it to an infrastructure team and move on. It's not. Token burn rate is a product decision because it determines whether agents choose your API or a competitor's.

Think about what's happening in the MCP ecosystem right now. The [MCP Registry](https://blog.modelcontextprotocol.io/posts/2025-11-25-first-mcp-anniversary/) has close to 2,000 servers, up 407% since launch. For many capabilities, there are multiple competing servers. The selection pressure on token efficiency is real, and it operates at multiple layers:

**Developer choice (happening now).** Agent developers swap expensive MCP servers for cheaper ones when they see cost and failure data. This is already happening. When we built [slim mode for Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp/pull/958), initial token costs dropped from roughly 7,000 to 370: a 95% reduction. Developers don't need automated selection to vote with their feet; they just pick the server that doesn't blow their context budget.

**Description quality (happening now).** Research on MCP tool descriptions ([Smelly Tool Descriptions, arxiv 2602.14878](https://arxiv.org/abs/2602.14878)) found that 97.1% of MCP tool descriptions have quality issues: vague parameter names, missing context, ambiguous purpose. Poor descriptions are a form of token tax themselves. The LLM spends extra tokens reasoning about what a tool does, picks the wrong tool, retries, and burns context on error recovery. Better descriptions get selected more accurately, which means fewer wasted calls.

**Orchestrator controls (emerging).** The LangChain community is building budget routers and capped tool invocations. CrewAI and AutoGen don't have built-in efficiency selection yet, but the patterns are forming. The trajectory is clear: orchestration layers will route tool calls based on cost and reliability, just like load balancers route traffic based on latency and availability.

**Model routers as the proof pattern.** OpenRouter already routes model selection by cost (`:floor` suffix), latency (`:nitro` suffix), and throughput. [Martian](https://withmartian.com/) predicts the optimal model per prompt, [reducing expensive model calls by up to 40%](https://proceedings.iclr.cc/paper_files/paper/2025/file/5503a7c69d48a2f86fc00b3dc09de686-Paper-Conference.pdf). These systems solved model selection; tool selection will follow the same trajectory because the economic incentive is identical. When calling Tool A costs 10x more context than Tool B for the same result, the router that picks Tool B wins.

The empirical evidence is starting to accumulate. Martin Alderson's [web framework token efficiency benchmark](https://martinalderson.com/posts/which-web-frameworks-are-most-token-efficient-for-ai-agents/) measured real differences across frameworks: ASP.NET Minimal API responses averaged 26,000 tokens while Phoenix averaged 74,000 tokens for equivalent functionality. Nearly 3x. That's not a rounding error; that's the difference between an agent that completes a task in one call and one that runs out of context trying. Meanwhile, the OpenAPI Initiative's Moonwalk SIG is investigating what it means to treat LLMs as a distinct class of API client, with implications for how specs describe response shapes and token budgets.

The "design for agents" mindset is also spreading beyond APIs to the web surface itself. [WebMCP](https://developer.chrome.com/blog/webmcp-epp), currently in early preview, proposes a standard for websites to expose structured tools for AI agents. Instead of agents manipulating raw DOM (slow, unreliable, token-heavy), sites declare how agents should interact with them using declarative HTML forms and imperative JavaScript APIs. This is the same pattern as optimizing API responses: give agents structured access instead of making them parse everything. When Chrome is building agent-ready infrastructure into the browser platform, the writing is on the wall.

Your API isn't competing on features alone anymore. It's competing on how much context it consumes relative to the value it provides. Token burn rate is a product metric whether you track it or not.

## Measuring your own token burn rate

Start with your most-called endpoint. Count the tokens in a typical response. You can paste the response into any tokenizer (OpenAI and Anthropic both provide them) and get an exact number. Multiply by daily call volume. That's your baseline token burn rate. For most teams, this number is larger than they expect, because nobody was counting before.

Then ask: how much of this response does the agent actually use? If an agent needs 3 fields out of 30, the other 27 are pure waste. They occupy context window space without moving the task forward. This is the agent equivalent of making a user scroll past 27 irrelevant form fields to fill in 3. Except the user just scrolls. The agent pays for every field.

The fix doesn't have to be complicated. Sparse field selection (letting the caller specify which fields to return) is a solved problem in API design. GraphQL does it natively. REST APIs do it with field masks. The pattern exists. It just hasn't been applied with token cost as the motivation.

Pick one endpoint. Instrument it. Measure tokens per successful task completion, not just tokens per response, because a cheap response that requires three follow-up calls isn't actually cheap. Set a baseline. Optimize. Then do it again for the next most-called endpoint.

If you want a formal KPI for this, use **Tokens per Successful Outcome (TPSO)**. Token burn rate is the concept. If it takes 10,000 tokens to book a flight on API A and 2,000 tokens on API B, API B wins the agent experience war. TPSO captures both the efficiency dimension (how many tokens per call) and the reliability dimension (only successful outcomes count, so a cheap response that fails doesn't game the metric). Track it per endpoint, per agent workflow, and over time. It's the agent equivalent of conversion rate: the single number that tells you whether your design is working.

If you want to formalize this into a repeatable practice, the [Anthropic guide to agent evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) covers how to build evaluation frameworks that measure exactly this kind of efficiency. Their pass@k metric is particularly useful: it measures the likelihood that an agent gets at least one correct solution in k attempts, which captures both the cost dimension (how many attempts) and the reliability dimension (how often it works at all).

## What's next

Token cost is one dimension of agent experience. It's the most visible one because it has a price tag attached, but it's not the only one that determines whether agents succeed or fail with your API. The next post in this series covers what happens when your API fails and the agent can't figure out why: error design as an agent experience problem.

---

*Michael Hablich is a Product Manager at Google, leading Chrome DevTools and Puppeteer. He builds tools used by millions of developers and AI agents. Connect on [LinkedIn](https://linkedin.com/in/michael-hablich) or [X](https://x.com/mhablich).*
