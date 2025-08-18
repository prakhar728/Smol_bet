from nearai.agents.environment import Environment
import requests

BET_TO_QUERY_PROMPT = """
You are an assistant that converts a bet condition into a search query.
You will receive a condition.
Convert it into a search-friendly question that someone could type into Google to find the relevant research.

Some examples of this is:
1. 
Bet terms: "Near is at 2$ at the end of April"
Translated query: Price of Near at the end of April.

2. 
Bet terms: "Kolkata Night Riders beats Rajasthan Royals on 4th May"
Translated Query: "Kolkata Night Riders vs Rajasthan Royals results 4th May"

Make sure the query is **very optimized for searching**. If you leave it a little ambigous, the search results will be very bad. 
You need to return just the "SEARCH QUERY" and itself. NO FILLER WORDS, NO HERE IT IS OR SOMETHING. A PLAIN SENTENCE THAT CAN DIRECTLY BE GOOGLED.
"""

QUERY_TO_BET_RESOLUTION = """
You are a very smart agent that will act as the resolver for bets. 
I will feed you the google search results for a query and terms of the bet.

You need to thoroughly understand the terms of the bet. Then look at the search results and evaluate weather the bet turns to TRUE or FALSE.
It is important that you **ONLY** reply in **TRUE** or **FALSE**. No other FILLER WORDS. THIS BET INVOLVES MONEY AND YOU WILL BE RESPONSIBLE.
This is terms of the bet {} and this are the  search results {}.

Go through the results very thoroughly, and understand them. Then match the search results with the terms of the bet and come to a conclusive answer. Don't be vague, don't be ambigous.
ONLY REPLY WITH "TRUE" or "FALSE". NOTHING ELSE. Make sure you do this.
"""

def serpapi_search(query, api_key, **kwargs):
    # Base URL for SerpAPI
    base_url = "https://serpapi.com/search"
    
    # Set up the default parameters
    params = {
        "engine": "google",
        "q": query,
        "api_key": api_key
    }
    
    # Update with any additional parameters
    params.update(kwargs)
    
    # Make the request
    response = requests.get(base_url, params=params)
    
    # Check if the request was successful
    if response.status_code == 200:
        return response.json()
    else:
        print(f"SerpAPI request failed with status code {response.status_code}: {response.text}")


def run(env: Environment):
    api_key = env.env_vars.get('SERPAPI_KEY', '')

    if not api_key:
        print("Api key missing")
        return
    
    if env.signer_account_id != "ai-creator.near":
        env.add_reply("Sorry. Cannot give you access :)")
        return

    # System prompt
    BET_TO_QUERY = {"role": "system", "content": BET_TO_QUERY_PROMPT}

    # Get the last user message
    terms_message = env.list_messages()[-1]

    query = env.completion([BET_TO_QUERY] + [terms_message])

    results = serpapi_search(query, api_key, hl="en", gl="us", num=10)

    RESULT_TO_RESOLVE = {"role": "system", "content": QUERY_TO_BET_RESOLUTION.format(terms_message["content"], results)}

    RESULT_TO_RESOLUTION = env.completion([RESULT_TO_RESOLVE])

    env.add_reply(RESULT_TO_RESOLUTION)
    env.request_user_input()

run(env)