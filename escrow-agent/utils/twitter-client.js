export async function getConversationId(client, tweetId) {
    try {
        const tweet = await client.v2.singleTweet(tweetId, {
            'tweet.fields': 'conversation_id',
        });
        return tweet.data.conversation_id;
    } catch (e) {
        console.log('ERROR getConversationId', e);
    }
    return null;
}

export async function getLatestConversationTweet(client, conversationId) {
    try {
        const searchResult = await client.v2.search(
            `conversation_id:${conversationId}`,
            {
                'tweet.fields': 'created_at',
                max_results: 100, // Adjust based on needs
            },
        );
        if (searchResult?.data?.meta?.result_count === 0) {
            return null;
        }

        return searchResult.data.data[0]; // Most recent tweet is first
    } catch (e) {
        console.log('ERROR getLatestConversationTweet', e);
    }
    return null;
}
