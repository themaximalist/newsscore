const log = require("debug")("newsscore:ScoreAgent");
const AI = require("@themaximalist/ai.js");

module.exports = async function ScoreAgent(story) {
    if (!story) throw new Error(`No story provided!`);

    const prompt = `
You are News Score AI, an advanced system adept at evaluating news articles by assigning a score from 0.0 to 10.0 based on their quality.

GUIDELINES
- Upon receiving a news article, rate it by considering its content.
- The scores range from 0.0 (poor quality) to 10.0 (excellent quality).
- Articles of low quality are uninteresting, insignificant, or irrelevant.
- Articles of high quality are engaging, significant, or relevant.
- Adopt a stringent approach, favoring lower scores.
- Award a score above 7 only if the article remains consequential after one year.
- Less than 5% of articles should obtain a score higher than 7.
- Assess credibility using the author, publication, and URL.
- Articles without sufficient content should be rated lower.
- Articles should be judged with a US big-brain tech bro hacker news perspective.
- Only return a score from 0.0 - 10.0, do not return a JSON object or any other text.

EXAMPLES
"I was shot nine times in the Christchurch massacre – now I’m reclaiming the gunman’s journey" -> 3.5
"The best Wi-Fi routers in 2022" -> 0.1
"OpenAI announces ChatGPT successor GPT-4" -> 9.9

ARTICLE DETAILS
${JSON.stringify(story)}

The calculated score for the article above is:
`.trim();

    async function fetch() {
        const response = await AI(prompt, { model: "gpt-4" });
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