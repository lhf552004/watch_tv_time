import requests
import json
import datetime
import os
import socket
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

GITHUB_RAW_URL = os.getenv('JSON_URL')

def fetch_json_from_github(url):
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def is_time_within_period(start, end, check_time):
    start_time = datetime.datetime.strptime(start, "%H:%M").time()
    end_time = datetime.datetime.strptime(end, "%H:%M").time()
    print(f"start: {start_time} end: {end_time} check_time: {check_time}")
    return start_time <= check_time <= end_time

def should_shutdown(computers_data, computer_name):
    current_time = datetime.datetime.now().time()
    current_day = datetime.datetime.now().strftime('%A')
    print(f"Current_day: {current_day}")
    for computer in computers_data:
        if computer['name'] == computer_name:
            print(f"PC is found by name {computer_name}")
            for period in computer['schedule'][current_day]:
                if is_time_within_period(period['startTime'], period['endTime'], current_time):
                    return True
    return False

def main():
    computers_data = fetch_json_from_github(GITHUB_RAW_URL)

    print(computers_data)

    computer_name = socket.gethostname()
    print(computer_name)

    if should_shutdown(computers_data, computer_name):
        print("Shutting down...")
        # os.system('shutdown now -h')
        os.system('shutdown /s /t 1')

if __name__ == "__main__":
    main()
