import os
from groq import Groq

client = Groq(
    api_key=os.environ["GROQ_API_KEY"]
)

MODEL = "openai/gpt-oss-120b"

messages = [
    {
        "role": "system",
        "content": "You are a helpful coding assistant."
    }
]

print("Groq Chatbot")
print(f"Model: {MODEL}")
print("Type 'exit' or 'quit' to stop.\n")

while True:
    try:
        user_input = input("You: ").strip()

        if not user_input:
            continue

        if user_input.lower() in ("exit", "quit"):
            print("Goodbye!")
            break

        messages.append({
            "role": "user",
            "content": user_input
        })

        response = client.chat.completions.create(
            model=MODEL,
            messages=messages
        )

        answer = response.choices[0].message.content

        print(f"\nGroq: {answer}\n")

        messages.append({
            "role": "assistant",
            "content": answer
        })

    except KeyboardInterrupt:
        print("\nGoodbye!")
        break

    except Exception as e:
        print(f"\nError: {e}\n")


'''
allam-2-7b
openai/gpt-oss-safeguard-20b
canopylabs/orpheus-arabic-saudi
openai/gpt-oss-20b
canopylabs/orpheus-v1-english
whisper-large-v3-turbo
qwen/qwen3.6-27b
qwen/qwen3.8-27b
meta-llama/llama-prompt-guard-2-22m
openai/gpt-oss-120b
meta-llama/llama-prompt-guard-2-86m
whisper-large-v3
groq/compound-mini
groq/compound
'''