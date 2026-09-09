import os
from mistralai.client import Mistral

client = Mistral(
    api_key=os.environ["MISTRAL_API_KEY"]
)

MODEL = "codestral-2508"

messages = [
    {
        "role": "system",
        "content": "You are a helpful coding assistant."
    }
]

print("Mistral Chatbot")
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

        response = client.chat.complete(
            model=MODEL,
            messages=messages
        )

        assistant_message = response.choices[0].message.content

        print(f"\nMistral: {assistant_message}\n")

        messages.append({
            "role": "assistant",
            "content": assistant_message
        })

    except KeyboardInterrupt:
        print("\nGoodbye!")
        break

    except Exception as e:
        print(f"\nError: {e}\n")

'''
codestral-2508
codestral-latest
mistral-code-latest
mistral-code-fim-latest
mistral-small-2603
mistral-small-latest
mistral-vibe-cli-fast
magistral-small-latest
voxtral-small-2507
voxtral-small-latest
labs-leanstral-1-5-1
labs-leanstral-1-5
ministral-3b-2512
ministral-3b-latest
ministral-8b-2512
ministral-8b-latest
ministral-14b-2512
ministral-14b-latest
mistral-medium-latest
mistral-medium
mistral-medium-3-5
mistral-medium-3.5
mistral-medium-3
mistral-medium-2604
mistral-vibe-cli-latest
mistral-vibe-cli-with-tools
magistral-medium-latest
mistral-embed-2312
mistral-embed
codestral-embed
codestral-embed-2505
mistral-moderation-2603
mistral-ocr-2512
mistral-ocr-3-0
mistral-ocr-3
mistral-ocr-4-0
mistral-ocr-latest
mistral-ocr-4
mistral-ocr-4-1
voxtral-mini-2602
voxtral-mini-latest
voxtral-mini-transcribe-realtime-2602
voxtral-mini-realtime-2602
voxtral-mini-realtime-latest
voxtral-mini-tts-2603
voxtral-mini-tts-latest
'''