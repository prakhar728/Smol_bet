from nearai.agents.environment import Environment


def run(env: Environment):
    # Your agent code here
    prompt = {"role": "system", "content": "Take a bet and parse it into legible terms"}
    result = env.completion([prompt] + env.list_messages())
    env.add_reply(result)

run(env)

