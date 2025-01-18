import requests
import json

def send_alert(severity_level, message, effected_pids):
    url = "http://localhost:6969/alerts" 
    headers = {
        "Content-Type": "application/json"
    } 
    payload = {
        "severity_level": severity_level,
        "message": message,
        "effected_pids": effected_pids
    }
    response = requests.post(url, headers=headers, data=json.dumps(payload))
    if response.status_code == 201:
        return "Alert sent successfully"
    else:
        return f"Failed to send alert: {response.status_code}, {response.text}"

def get_ps():
    url = "http://localhost:6969/ps"
    try:
        response = requests.get(url)
        response.raise_for_status() 
        return response.json()  
    except requests.exceptions.RequestException as e:
        print(f"Error fetching process data: {e}")
        return []  

def get_system_metrics():
    url = "http://localhost:6969/metrics/system"
    try:
        response = requests.get(url)
        response.raise_for_status() 
        return response.json()  
    except requests.exceptions.RequestException as e:
        print(f"Error fetching process data: {e}")
        return []  

def get_process_metrics(pid):
    url = f"http://localhost:6969/metrics/{pid}"
    try:
        response = requests.get(url)
        response.raise_for_status() 
        return response.json()  
    except requests.exceptions.RequestException as e:
        print(f"Error fetching process data: {e}")
        return []  

# if __name__ == "__main__":

    # ps_data = get_ps()
    # print(ps_data)
    # print(ps_data[0])

    # system_metrics_data = get_system_metrics()
    # print(system_metrics_data)

    # process_metrics_data = get_process_metrics(1)
    # print(process_metrics_data)

    # alert_status = send_alert(3, "High memory usage detected", [1234, 5678])
    # print(alert_status)
