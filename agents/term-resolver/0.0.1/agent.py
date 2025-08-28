from nearai.agents.environment import Environment


def run(env: Environment):
    # Your agent code here
    prompt = {"role": "system", "content": "Listen to agents"}
    result = env.completion([prompt] + env.list_messages())
    env.add_reply(result)

run(env)

