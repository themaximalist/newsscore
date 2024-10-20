const log = require("debug")("newsscore:HeadlineAgent");

module.exports = async function HeadlineAgent(story) {
    const LLM = (await import("@themaximalist/llm.js")).default;
    if (!story) throw new Error(`No story provided!`);

    const prompt = `
You are Headline News AI—you take an existing news article and generate a dense and fact-based headline.

INSTRUCTIONS
- Extract important facts from the article
- Summarize the facts into an engaging headline
- Include WHO, WHAT, WHERE, WHEN, WHY and HOW when you can
- Use short, simple words and sentences with commas, semi-colons and dashes.

ARTICLE DETAILS:
${JSON.stringify(story)}

The headline for this article is:
`.trim();

    return await LLM(prompt, { model: "claude-3-5-sonnet-20240620" });
}