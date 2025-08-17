from nearai.agents.environment import Environment


def run(env: Environment):
    # Your agent code here
    prompt = {"role": "system", "content": "Take the Bet and terms and search the internet to find the resolution and correct result for it. Respond with the name of the person who one."}
    result = env.completion([prompt] + env.list_messages())
    env.add_reply(result)

run(env)

