import requests
import json
import sys
import urllib3

# Disable SSL warnings for self-signed certificates
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# --- CONFIGURATION ---
BASE_URL = "https://central.local"
EMAIL = "newuser2"
PASSWORD = "Poppy-Perp-339-Stall"
PROJECT_ID = "1"
# ---------------------

def get_token():
    print(f"1. Logging in to {BASE_URL}/v1/projects/{PROJECT_ID}/app-users/login ...")
    payload = {
        "username": EMAIL,
        "password": PASSWORD,
        "deviceId": "python-debug-client"
    }
    try:
        r = requests.post(f"{BASE_URL}/v1/projects/{PROJECT_ID}/app-users/login", json=payload, verify=False)
        print(f"Status Code: {r.status_code}")
        if r.status_code == 200:
            token = r.json().get('token')
            print(f"Login Successful! Token: {token[:10]}...")
            return token
        else:
            print(f"Login Failed: {r.text}")
            return None
    except Exception as e:
        print(f"Login Error: {e}")
        return None

def check_api(token):
    headers = {
        "Authorization": f"Bearer {token}",
        "X-OpenRosa-Version": "1.0"
    }

    print(f"\n--- Debugging ODK Central API ---")
    print(f"Project ID: {PROJECT_ID}")
    print("-" * 30)

    # 1. Try Getting forms 
    print(f"\n2. Testing GET /v1/projects/{PROJECT_ID}/formList ...")
    try:
        r = requests.get(f"{BASE_URL}/v1/projects/{PROJECT_ID}/formList", headers=headers, verify=False)
        print(f"Status Code: {r.status_code}")
        print(f"Response Body: {r.text}")
        
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    token = get_token()
    if token:
        check_api(token)
    else:
        print("Could not proceed without token.")
