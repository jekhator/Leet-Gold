from cryptography.fernet import Fernet

# Get the encryption key from the user
key = input("Please enter your encryption key: ")

# Instantiate the Fernet class
cipher_suite = Fernet(key.encode())

# Read the encrypted API key from the file
with open("encrypted_api_key.txt", "rb") as file:
    encrypted_api_key = file.read()

# Decrypt the API key
api_key = cipher_suite.decrypt(encrypted_api_key).decode()

# Print the decrypted API key
print(f"Your API key is: {api_key}")

