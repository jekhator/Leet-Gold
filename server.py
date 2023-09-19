from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv('API_KEY')
print(f"The API key is: {api_key}")
