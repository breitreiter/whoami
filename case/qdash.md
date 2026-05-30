---
id: qdash
title: qDash
subtitle: An agent-native dashboard and reporting system
layout: default
---
**My role:** Concept, design, prototype engineering
**Lifecycle:** New system, early alpha
**Team size:** 1
**Industry:** Software testing / quality engineering
**Task:** Build a dashboarding system that both developers and non-technical users can author, and that embeds cleanly into our existing products
**Outcome:** Repo with internal traction; entering a 5-customer alpha

There's a familiar split in dashboarding. Some people want to experience a dashboard as an interactive GUI. They author iteratively, slowly watching the dashboard take shape as they tweak and tune, add and subtract. Others want to treat dashboards as a software artifact, a file in a repo, reviewed and versioned like anything else. When I was at Grafana I started out on the dashboards-as-code team, and I heard this dichotomy constantly. Plenty of users wanted one mode or the other. Plenty more admitted their own org was split down the middle. qDash starts from the premise that you shouldn't have to choose.

## The Problems

**Serving both modes usually means picking a side.** You either build a GUI builder and tell the as-code people to live with exports, or you ship a file format and a UI that mimics the format schema. Neither are a great experience for everyone.

**Change hesitancy in legacy products.** Tricentis products have accumulated over years and acquisitions. Some are modern; some are old enough that adding a feature to the UI is genuinely risky. Whatever we built had to drop into those codebases without destabilizing them.

**Subtle agentic bugs.** Obviously the ideal is a dashboard system that can show any possible query against your data. But in testing, Sonnet would occasionally make subtle SQL authoring errors, caught only on careful examination of panels. Letting a model write arbitrary queries against customer data was not a risk I was willing to ship.

## Our Responses

### A flat file format as the shared substrate

Each dashboard is a directory. A top-level `dashboard.yaml` holds identity and global filters; each panel is its own loose YAML file alongside it. I owe a conceptual debt here to Lightdash, which was thoughtfully designed but a bit too stapled to dbt to use as-is.

The format is deliberately thin, and that thinness is a reaction to what I watched users struggle with at Grafana. Their resting format encoded:

- a ton of incidental panel settings, essentially the saved state of the panel editor, persisted as config
- every panel in one file, so a simple rearrange read as a wall of diff
- powerful data transformations that only a few very smart engineers could sit down, stare at, and reason their way through

qDash sidesteps each of these. One file per panel means a rearrange is a set of property changes, not an opaque diff. There's no editor state to encode. And the gnarly transformation logic lives server-side, out of the file entirely. The result is an artifact a human can actually read in a pull request.
A handful of panel types cover the surface: KPI, line chart, bar chart, proportional bar, donut, table, kv-list, heat-map, and sankey.

### The developer path

A developer works the way they already work. Pull the dashboard from GitHub, edit the YAML, run `validate` to confirm everything is legal, test it against live data, publish. They do all of this with the coding agent of their choice. qDash is a CLI, and the CLI is built to be driven by an agent. It scaffolds starter content, lists the available data views, executes a view so the model can look at real output, and generates a starter `claude.md` that explains how the whole system fits together.

The CLI tool also hosts the dashboard on a local HTTP server, running against live server data, so users can see exactly how the dashboard will behave once they publish it.

### The non-technical path

A non-technical user does something that looks completely different but is, underneath, identical. They create a blank dashboard from inside a Tricentis application, then start chatting with an agent, asking questions about the data, nudging the layout, describing what they want to see. No terminal, no YAML, no Git.

The reason both paths work is that they are the *same operation*. The non-technical user's chat agent is editing the same files and running the same scaffolding and validation moves as the developer's CLI agent. It's just doing it out of sight, with a different harness. Chat agents are already tuned to perform coding tasks on a filesystem. By mimicking this shape, qDash gets this intelligence for free.

### Delivery into legacy hosts

The server side renders dashboards for consumption by other applications, and it's designed to run in an iframe, because integrating new UI into our creakier codebases is scary, and an iframe is a contract we can trust. The server is steered primarily over MCP. We're committed to a side-panel AI chat in these legacy apps. That chat can call HTTP/SSE MCP servers, so qDash server can present itself as an MCP server.

## One Detail

One key decision is that the agent never writes SQL, and never calls an arbitrary API. Instead, the server defines a set of data views. Each view advertises what input parameters it requires, what parameters it can optionally accept, and which panel shapes its output is compatible with. The CLI can fetch and publish dashboards and execute views against live data, but it cannot author a new view or reach past the server to a data source directly.

This buys two things at once. First, backend flexibility: if the data lives behind an API, the view is an API wrapper; if it lives in a Lucene-indexed document store, the view is a Lucene planner. The agent sees one consistent surface regardless. Second, and more importantly, it turns authoring into a lego problem. The agent is handed a box of typed blocks. If it tries to click two together that don't fit, say a view feeding a panel shape it can't satisfy, or a required parameter left unfilled, `validate` fails and tells it so. This edit-validate-fix loop mimics the edit-build-fix loop models are already tuned for.

By limiting the implementation complexity for the agent, we free its attention for the thing that actually matters: figuring out what the user is trying to accomplish. A non-technical user rarely arrives with a spec. They arrive with a vague dissatisfaction and a sense that the answer is in the data somewhere. An agent that isn't burning cycles on SQL has room to draw that out.

There's an honest cost here, and it's the mirror image of a tradeoff I made on a previous dashboard system, where I traded UX consistency for authoring flexibility. This time the trade runs the other way. Capping the agent to server-defined views means a dashboard can only ever express what some engineer already built a view for. If the data you want isn't covered, no amount of chatting will conjure it; someone has to go add a view first. There's a plan in place to allow user-authored views in C#, but that's a far cry from the dream of "anything I can say, the system can visualize." I think that's an acceptable compromise for now, but with the current pace of AI intelligence, who can say in a year?
