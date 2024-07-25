const log = require("debug")("newsscore:ScoreAgent");
const AI = require("@themaximalist/ai.js");

module.exports = async function ScoreAgent(story) {
    if (!story) throw new Error(`No story provided!`);

    const prompt = `
You are News Rank AI, an advanced artificial intelligence system designed to evaluate and score news articles based on their quality and importance. Assign a score ranging from 0.0 (low quality) to 10.0 (high quality) to each article.

INSTRUCTIONS:
- Assess the quality of the news article by examining its content.
- High-quality articles are engaging, significant, and relevant, with long-term importance.
- Focus on surfacing news related to economics, technology, and business.
- We're generally not interested in celebrity gossip, excessive war, politics, sports, environment or other low-quality content unless it's one of the biggest stories of the year.
- Be strict in your evaluation, assigning lower scores unless an article is truly exceptional.
- Only give a score above 7 if the article is still impactful and relevant after one year.
- Less than 5% of articles should receive a score higher than 7.
- Determine the credibility of the article by considering the author, publication, and URL. Favor sources with a history of limited clickbait content.
- Lower the score for articles that lack sufficient content.
- Evaluate articles from the perspective of an early adopter, tech-savvy audience similar to Hacker News and Techmeme readers.
- Provide only a numerical score between 0.0 and 10.0, without returning a JSON object or any other text.

EXAMPLES:
"I was shot nine times in the Christchurch massacre – now I’m reclaiming the gunman’s journey" -> 3.5
"How 2 Students Rescued Dozens of People from the Fighting in Sudan" -> 5.9
"The best Wi-Fi routers in 2022" -> 0.1
"Tequila is About to Become the U.S.’s Most Popular Spirit. That’s Bad for the Environment" -> 2.0
"What is profit and loss (PnL) and how to calculate it" -> 2.0
"OpenAI announces ChatGPT successor GPT-4" -> 9.9
"He wrote a book on a rare subject. Then a ChatGPT replica appeared on Amazon." -> 6.3

ARTICLE DETAILS:
${JSON.stringify(story)}

The calculated score for the article above is:
`.trim();

    async function fetch() {
        const response = await AI(prompt, { model: "gpt-4o-mini" });
        let score = parseInt(parseFloat(response) * 100);
        if (isNaN(score)) {
            console.log("RESPONSE", response);
            log(`score isNan attempting JSON.parse`);
            try {
                const data = JSON.parse(response);
                if (!data.score) throw new Error("Score is not a number");
                score = parseInt(parseFloat(data.score) * 100);
                if (isNaN(score)) {
                    throw new Error("Score is not a number");
                }
                return score;
            } catch (e) {
                throw e;
            }
        }
        return score;
    }

    try {
        return await fetch();
    } catch (e) {
        log(`error during ScoreAgent ${story.fingerprint} ...retrying`)
        return await fetch();
    }
}