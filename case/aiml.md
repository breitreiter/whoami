---
id: aiml
title: AI/ML Visiontype
subtitle: Imaginging Our Product in 5 Years
layout: default
---
**My role:** Concept, designer  
**Lifecycle:** Speculative vision  
**Team size:** 1  
**Industry:** Data science, machine learning  
**Task:** Imagine what our product could become as an AI platform  
**Outcome:** Delivered and inspiring conversations

Just before the holiday break in December 2022, the executive team at FeatureBase asked me 
to help illustrate how our product could grow into a full-featured machine-learning platform. 
I offered to put together a visiontype; a speculative prototype intended to spark conversation 
and help stakeholders visualize the outcome of our strategic commitment to ML.

<a href="../images/aiml_visiontype.png">![Code assistant](../images/aiml_visiontype.png)</a>

## My Process

**AI/ML Education Speedrun** - When I approach a new project, my first step is always research. 
Usually this means diving into technical documentation and looking for related projects on github. 
It quickly became clear that this approach would not work for ML; the field was complex, rapidly 
changing, and built on deep mathematical fundamentals. After a few false starts, I discovered 
[Jeremy Howard’s course](https://course.fast.ai/) and spent two straight weeks watching videos, 
spinning up colab notebooks, and back-filling my shaky linear algebra knowledge with 
[Josh Starmer](https://www.youtube.com/c/joshstarmer) and [Grant Sanderson’s](https://www.youtube.com/@3blue1brown)
excellent videos.

**Market Research** - Once I had a handle on the core concepts, user tasks, and terminology, I 
could start making sense of the market landscape. Not surprisingly, my first stop was Gartner; 
while their taxonomies and analysis are often idiosyncratic, I find it helpful to have some 
starting framework. I zeroed in on their [“DSML engineering platforms”](https://www.gartner.com/reviews/market/dsml-engineering-platforms)
category, as it was closest to where our product was currently enjoying success. If we were to 
bootstrap this new vision, it would probably start by partnering with our current customers.

**Expert Interviews and Ethnographic Research** - I started this final step with a sort of 
internet ethnographic survey. I found the subreddits and stackoverflow topics most frequented 
by data scientists and ML engineers and started taking notes. I’ve found that users tend to 
be most transparent in these unguarded, semi-anonymous conversations, especially when those 
conversations stem from a moment of earnest frustration or confusion.

Finally, I was ready to start talking to some real humans. My first stop was our internal data 
scientist, who helped me sharpen up my questions and ground a lot of the theory in the daily 
experience of working with data. Next I set aside some time with a senior data scientist who 
helped me get a broader understanding of how ML tools were adopted and evaluated by businesses. 
Finally, I spoke with a developer friend who did not work on ML directly but integrated with 
his company’s ML systems. I wanted to understand the perspective of people who were working 
with these systems without formal ML training.

## My Findings

**The Market is Fragmented and Complex** - You only need to scan the [MAD landscape](https://mad.firstmark.com/) to 
understand the bewildering array of options available to teams who are building a machine 
learning stack for production. This is made more complex by competing preferences among data 
scientists; [a common reason cited for switching jobs](https://towardsdatascience.com/why-data-scientists-and-engineers-quit-their-jobs-afc2350eef9a)
was the desire to work with a better software stack. This leaves data engineers struggling
to connect legacy data systems, production software systems, and data science tools.

**Talent is Difficult to Source** - While my two-week crash course in ML equipped me to speak 
intelligibly about the work done by ML professionals, actually doing the work requires a deep 
technical skillset. The current structure of ML work requires specialists who can create highly
customized solutions, informed by a field which is changing constantly.
Between the high demand for AI projects in digital transformation and the relative novelty of
the field [data scientists are difficult to source](https://www.forbes.com/sites/forbestechcouncil/2022/10/11/the-data-science-talent-gap-why-it-exists-and-what-businesses-can-do-about-it/)

**Software Engineers are Underserved** - AI/ML systems are increasingly becoming a key part of 
business-critical software systems, and these new capabilities come with new risks. Teams which 
have traditionally built and operated software systems struggle to manage ML systems in 
production. Data scientists are not accustomed to the rigor of software engineering and 
reliability practices. [Software engineers struggle to master ML](https://pg.ucsd.edu/publications/software-developers-learning-machine-learning_VLHCC-2019.pdf)
and must rely on the data team to understand and mitigate operational risks. 

## Building the Visiontype

I walked through a short [lean canvas](https://leanstack.com/lean-canvas/) exercise to identify
where we might compete in a crowded marketplace. I believed an integrative, collaboration-centered
ML development hub could align AI/ML work with existing processes (agile, devops, observability)
which have made software teams so successful.

**Bringing in Everyone** - Not surprisingly, I was not the only person at the company with an
eye on AI/ML. I set up a series of meetings with key stakeholders in the organization to understand
how they were thinking about our future. I learned that our developer relations manager was
working with LLMs to automate support, our VP of engineering  was investigating training and
deploying models in SQL and UDFs, and that one of our SEs had been researching data catalogs
for storing model training data. It was important to me that we could ground the visiontype in
actual work that was happening now.

**Identifying Key Features** - I wanted to help bring software engineers into the process and
integrate model training and inference into their normal software development practices. To this
end, I identified three key features:
- A consolidated data catalog. This would allow data engineers, analysts, and data scientists
to normalize datasets across projects. For my core audience (engineers) this means they could 
trace the lineage of data to learn how it's being cleaned, transformed, and enriched.
- Github-backed data projects. Software engineers are accustomed to working in projects 
(named collections of code and configuration artifacts that collectively solve a problem).
They have processes and tools (including [CI/CD automation](https://about.gitlab.com/topics/ci-cd/)) 
which leverage the functional isolation provided by projects to manage change risks. I wanted
to bring this practice into the product, but without requiring data folks to set up complex
development environments. I believed an integrated, multi-user IDE 
([Monaco](https://github.com/microsoft/monaco-editor) with 
[monaco-collab](https://github.com/convergencelabs/monaco-collab-ext) for instance) would
streamline adoption and simplify evaluation.
- Coding assistance for unfamiliar frameworks. A common hurdle to adopting good ops practice
is the difficulty of learning a new framework or tool. This is especially true for code frameworks,
where an engineer must often spend considerable time cross-checking API documentation. I believed
we could use a [fine-tuned language model](https://the-decoder.com/fine-tuning-with-instructions-google-brain-improves-large-language-models/)
to generate framework-appropriate code snippets for user-supplied tasks. Language models have also
proven adept at summarizing and explaining code, which would be useful to engineers and data 
scientists who are hunting down data quality or preparation logic errors.

**Creating a Story** - I anticipated I would be called on to present the visiontypes in front
of audiences will different degrees of ML expertise. I decided to tell the story of a data engineer
wiring up the classic [Titanic survivor dataset](https://github.com/datasciencedojo/datasets/blob/master/titanic.csv),
performing some clean-up (the Titanic set has several well-known quality issues) and publishing a
project to clean and enrich the data. Our data scientist creates a new project (which references the
engineer's project) to train a simple decision tree model. Finally, our software engineer integrates
the data scientist's project into a versioned API. Our engineer wants to go back and improve test
quality, and the UI helps them author some robust tests using an unfamiliar data framework ([dbt](https://www.getdbt.com/)).

The story demonstrates a consistent way of organizing work from the initial data load to the final
integration with production systems. Critically, it does so at a process and workflow level, which
means:
- Minimal impact to existing vendor relationships
- Broad compatibility with existing data and dev architecture
- Ability to adopt/trial new frameworks and algorithms. 

The swift proliferation of new ML technologies, products, and vendors can be overwhelming. Many
organizations will choose a single, comprehensive platform like Sagemaker or Vertex. However,
for those organizations pursuing a best-of-breed approach, a smart, unifying development platform
can bridge some of the gaps between disparate technologies.
