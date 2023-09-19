from cryptography.fernet import Fernet

# Generate a key and instantiate the Fernet class
key = Fernet.generate_key()
cipher_suite = Fernet(key)

# Get the API key from the user
api_key = input("Please enter your API key: ")

# Encrypt the API key
encrypted_api_key = cipher_suite.encrypt(api_key.encode())

# Save the encrypted API key to a file
with open("encrypted_api_key.txt", "wb") as file:
    file.write(encrypted_api_key)

# Print the key (you will need this key to decrypt the file later)
print(f"Your encryption key is: {key.decode()}")

