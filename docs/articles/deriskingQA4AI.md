## De-risking QA for LLM-powered applications

The integration of large language models (LLMs) and generative AI into products is ushering in a new era of possibilities. These powerful tools can generate text, translate languages, write different kinds of creative content, and answer your questions in an informative way, even if they are open ended, challenging, or strange. However, this innovation comes with a caveat: the inherent non-determinism of LLMs poses significant challenges for quality assurance (QA). As a product manager (PM) navigating this frontier, how can you ensure the delivery of high-quality user experiences when the AI's output is inherently unpredictable?

Traditional testing methodologies, designed for deterministic software, often fall short when applied to the dynamic nature of LLMs.  This is where a tailored approach becomes essential. Let's explore four key methods that can empower you to establish robust QA processes for your LLM-powered applications:

### 1. Human raters: The gold standard, but at a cost

Human evaluation remains the gold standard for assessing the quality of LLM outputs. Trained raters, equipped with predefined criteria, can provide subjective feedback on various dimensions of quality, such as accuracy, relevance, coherence, and overall user satisfaction. This nuanced evaluation is crucial for understanding the subtleties of user experience and identifying areas where the LLM might falter.

However, relying solely on human raters comes with its drawbacks. It can be a costly and time-consuming process, especially when dealing with large volumes of LLM-generated content. Additionally, the subjective nature of human evaluation can introduce variability, making it challenging to achieve consistency across different raters. 

### 2. Autoraters: Scaling Quality Assessment with AI

To address the scalability limitations of human evaluation, autoraters—AI models trained to mimic human judgment—have emerged as a valuable tool. These models are trained on datasets of human-rated LLM outputs, learning to identify patterns and correlations that indicate quality. Once trained, autoraters can rapidly evaluate vast amounts of LLM-generated content, providing valuable insights at scale.

Platforms like [Google Cloud's Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/models/evaluation-overview) offer tools and frameworks to streamline the development and deployment of autoraters. There of course are other vendors or for this too.

While autoraters offer a cost-effective and efficient solution, they are not without their limitations. The complexity of human judgment can be difficult to fully capture in an AI model, and there's always the risk of biases being inadvertently introduced during training. Therefore, careful monitoring and ongoing refinement are essential to ensure the reliability of autoraters. Likely you would want to compare the results of the autoraters against the results of human raters to identify areas for improvement continously.

### 3. Benchmarks: A check before you switch

Benchmarks provide a standardized way to measure the performance of LLMs against specific tasks e.g. [SWE Bench](https://www.swebench.com/). These benchmarks consist of curated datasets and evaluation metrics that allow you to compare your under-pinning LLM's performance with that of other models or industry standards. By regularly evaluating your chosen LLM against benchmarks, you can track progress, identify areas for improvement, and gain valuable insights into the strengths and weaknesses of your model. If a new version of your used LLM is released, its straight-forward to compare its performance against its predecessor.

However, relying solely on benchmarks can be shortsighted. Benchmarks are often designed for general tasks and may not perfectly align with the specific use case of your application. There are testing the underlying LLM afterall, not your application. Moreover, achieving high scores on benchmarks doesn't necessarily guarantee a seamless user experience. Therefore, benchmarks should be used as a complementary tool rather than a sole indicator of quality. They are useful as a first impression to understand the impact of a model change.

### 4. A/B testing and real-world feedback: Validating in the wild

The true test of an LLM-powered application lies in its real-world performance. A/B testing allows you to compare different versions of your application with real users, gathering valuable feedback on user experience, engagement, and satisfaction. This data-driven approach provides the most accurate assessment of how your LLM-powered application performs in practical scenarios.

However, A/B testing can be a slow process, and it requires careful experimental design to isolate the impact of the LLM from other variables. Furthermore, ensuring the ethical collection and use of user data is paramount.

### Choosing the right strategy: It's a mix, there is no silver bullet

In the ever-evolving landscape of LLMs, a one-size-fits-all approach to quality assurance simply doesn't exist. The most effective strategy often involves a combination of these methods, each playing a specific role in ensuring a comprehensive assessment of quality.

*   Start with human raters to establish a baseline for quality and generate the training data needed for autoraters. Then ramp up your usage of autoraters.
*   Leverage benchmarks to get an initial understanding and assessement of different LLM models and version, which particularly is relevant when you are changing your models. It's just a first look though.
*   Implement A/B testing to validate your findings in real-world scenarios and gain insights into the nuances of user experience. Depending on your application, you might run most of your evaluation on this layer.

By weaving together these diverse methods, you can create a robust QA framework that enables you to do model and prompt changes with meangingful confidence.
