from dotenv import load_dotenv
import os

# Load the environment variables from .env file
load_dotenv()

# Get the API key
api_key = os.getenv('API_KEY')

# Read the content.js file
with open('content.js', 'r') as file:
    content_js = file.read()

# Replace a placeholder in content.js with the API key
content_js = content_js.replace('YOUR_API_KEY_PLACEHOLDER', api_key)

# Write the modified content back to content.js
with open('content.js', 'w') as file:
    file.write(content_js)

print("API key successfully embedded in content.js")
