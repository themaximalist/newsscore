const log = require("debug")("newsscore:TweetStory");
const { TwitterApi } = require("twitter-api-v2");

const twitter = new TwitterApi({
    appKey: process.env.CONSUMER_KEY,
    appSecret: process.env.CONSUMER_SECRET,
    accessToken: process.env.ACCESS_TOKEN_KEY,
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
});

async function tweetStory(story) {
    if (!story) throw new Error(`Invalid story`);
    if (!story.url) throw new Error(`Invalid story url`);
    if (!story.headline) throw new Error(`Invalid story headline`);
    if (!story.score) throw new Error(`Invalid story score`);
    if (story.score < process.env.NEWS_SCORE_CUTOFF) throw new Error(`Story score ${story.score} is less than cutoff ${process.env.NEWS_SCORE_CUTOFF}`);
    if (story.tweet_id) throw new Error(`Story already tweeted`);

    const status = `(${(story.score / 100).toFixed(1)}) ${story.headline} ${story.url}`;
    log(`tweeting: ${status}`);

    const response = await twitter.v2.tweet(status);
    if (!response) throw new Error(`Error tweeting story: ${story.url}`);
    if (!response.data) throw new Error(`Invalid tweet response for ${story.url}`);

    const tweet_id = response.data.id;
    if (!tweet_id) throw new Error(`Invalid tweet id for ${story.url}`);

    log(`tweeted successfully: ${tweet_id}`);
    return tweet_id;
}

module.exports = tweetStory;