import os
from cerebras.cloud.sdk import Cerebras

client = Cerebras(
    api_key=os.environ["CEREBRAS_API_KEY"]
)

response = client.chat.completions.create(
    model="qwen-3.8-27b",
    messages=[
        {
            "role": "user",
            "content": "Reply with exactly: Cerebras is working."
        }
    ],
)

print(response.choices[0].message.content)


'''
qwen-3.8-27b
gpt-oss-120b
gemma-4-31b
'''