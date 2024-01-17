const log = require("debug")("newsscore:HighpassFilterAgent");
const AI = require("@themaximalist/ai.js");

module.exports = async function HighpassFilterAgent(stories) {
    if (!stories) throw new Error(`No stories provided!`);

    const prompt = `
You are News Rank AI, an advanced artificial intelligence system designed to evaluate and score news articles based on their quality and importance. Assign a score ranging from 0 (low quality) to 1000 (high quality) to each article.

INSTRUCTIONS:
- Assess the quality of the news article by examining its title
- High-quality articles are engaging, significant, and relevant, with long-term importance.
- Focus on surfacing news related to economics, technology, and business.
- We're generally not interested in celebrity gossip, excessive war, politics, sports, environment or other low-quality content unless it's one of the biggest stories of the year.
- Be somewhat strict in your evaluation, assigning lower scores unless an article is truly exceptional.
- Only give a score above 700 if the article is still impactful and relevant after one year.
- Less than 10% of articles should receive a score higher than 700.
- Determine the credibility of the article by considering title.
- Lower the score for articles that lack sufficient content in their title.
- Evaluate articles from the perspective of an early adopter, tech-savvy audience similar to Hacker News and Techmeme readers.
- Provide only a numerical score between 0 and 1000
- Return a JSON object like {id: score} that JSON.parse() could handle.

EXAMPLES:
"I was shot nine times in the Christchurch massacre – now I’m reclaiming the gunman’s journey" -> 350
"How 2 Students Rescued Dozens of People from the Fighting in Sudan" -> 590
"The best Wi-Fi routers in 2022" -> 10
"Tequila is About to Become the U.S.’s Most Popular Spirit. That’s Bad for the Environment" -> 200
"What is profit and loss (PnL) and how to calculate it" -> 200
"OpenAI announces ChatGPT successor GPT-4" -> 990

ARTICLES:
${JSON.stringify(stories)}

The scores for the articles above are:
    `.trim();;

    return await AI(prompt, { model: "gpt-4-1106-preview", parser: JSON.parse });
}


