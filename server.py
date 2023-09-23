from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv('API_KEY')

with open('content.js', 'r') as file:
    content_js = file.read()

content_js = content_js.replace('YOUR_API_KEY_PLACEHOLDER', api_key)

with open('content.js', 'w') as file:
    file.write(content_js)

print("API key successfully embedded in content.js")
