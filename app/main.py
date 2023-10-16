import requests
import json
import datetime
import os
import socket
from dotenv import load_dotenv
import time

# Load the .env file
load_dotenv()

BASE_URL = "https://us-central1-aurorasoft.cloudfunctions.net/getComputerByName"
HEADERS = {
    "Content-Type": "application/json;charset=UTF-8",
    # Include any other headers like Authorization if needed
}

def fetch_json_from_firebase(computerName):
    data_payload = {
        "computerName": computerName,
        "ownerId": os.getenv('ownerId')
    }
    
    response = requests.post(BASE_URL, json=data_payload, headers=HEADERS)

    if response.status_code == 200:
        result = response.json()
        # print(result)
        return result
    else:
        print(f"Error: {response.status_code}")
        print(response.text)


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
    print(f"Current_time: {current_time}")
    todays_schedule = computers_data['schedule'].get(current_day, [])
    for period in todays_schedule:
         if is_time_within_period(period['startTime'], period['endTime'], current_time):
            return True
    print("The time is not in schedule.")
    return False

def main():
    while True:
        try:
            computer_name = socket.gethostname()
            print(computer_name)

            computers_data = fetch_json_from_firebase(computer_name)
            print(computers_data)
            if computers_data != None:
                if should_shutdown(computers_data, computer_name):
                    print("Shutting down...")
                    # os.system('shutdown now -h')
                    os.system('shutdown /s /t 1')
                print("PC is not shutdown, end.")
            
            time.sleep(60)  # wait for 60 seconds (1 minute) before checking again
        except Exception as e:
            print(f"Caught an exception: {e}")    

if __name__ == "__main__":
    main()
