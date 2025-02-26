import time
import statistics
from data_transfer import get_system_metrics, send_alert, get_ps

cpu_usage_history = []
ram_usage_history = []
bandwidth_usage_history = []
last_cpu_alert_time = 0
last_ram_alert_time = 0
last_bandwidth_alert_time = 0

def get_severity_level(usage):
    if 90 <= usage <= 100:
        return 1
    elif 80 <= usage < 90:
        return 2
    elif 70 <= usage < 80:
        return 3
    elif 60 <= usage < 70:
        return 4
    elif 50 <= usage < 60:
        return 5
    return None

def get_top_processes(sort_by='cpu'):
    processes = get_ps()
    sorted_processes = sorted(processes, key=lambda p: p[sort_by], reverse=True)
    top_processes = [p['pid'] for p in sorted_processes[:3]]
    return top_processes

def monitor_network_usage():
    global last_bandwidth_alert_time
    while True:
        metrics = get_system_metrics()
        if not metrics:
            print("Failed to fetch system metrics. Retrying...")
            time.sleep(2)
            continue

        bandwidth_down = float(metrics.get("bandwidthDownKb", 0)) / 1024  
        bandwidth_up = float(metrics.get("bandwidthUpKb", 0)) / 1024  

        if len(bandwidth_usage_history) >= 10:
            bandwidth_usage_history.pop(0)

        bandwidth_usage_history.append((bandwidth_down, bandwidth_up))

        if len(bandwidth_usage_history) == 10:
            if all(down >= 10 for down, up in bandwidth_usage_history):
                current_time = time.time()
                if current_time - last_bandwidth_alert_time >= 60:
                    severity = 3
                    alert_msg = f"High Network Usage Alert (Down: {bandwidth_down} Mbps, Up: {bandwidth_up} Mbps)"
                    send_alert(severity, alert_msg, [])
                    last_bandwidth_alert_time = current_time

        time.sleep(2)

def monitor_system():
    global last_cpu_alert_time, last_ram_alert_time
    while True:
        metrics = get_system_metrics()
        if not metrics:
            print("Failed to fetch system metrics. Retrying...")
            time.sleep(2)
            continue
        
        cpu_usage = float(metrics.get("cpuUsage", 0))
        ram_usage = float(metrics.get("ramUsed", 0)) / float(metrics.get("ramTotal", 1)) * 100        
        if len(cpu_usage_history) >= 10:
            cpu_usage_history.pop(0)
        if len(ram_usage_history) >= 5:            
            ram_usage_history.pop(0)

        cpu_usage_history.append(cpu_usage)
        ram_usage_history.append(ram_usage)

        current_time = time.time()
        if len(cpu_usage_history) == 10:
            cpu_avg = statistics.mean(cpu_usage_history[:-1])
            if cpu_usage > (cpu_avg * 1.5) and cpu_usage > 50:
                if current_time - last_cpu_alert_time >= 60:
                    severity = get_severity_level(cpu_usage)
                    if severity:
                        alert_msg = f"High CPU Usage Alert ({cpu_usage}%)"
                        top_processes = get_top_processes(sort_by='cpu')
                        send_alert(severity, alert_msg, top_processes)
                        last_cpu_alert_time = current_time

        if len(ram_usage_history) == 5:
            ram_avg = statistics.mean(ram_usage_history[:-1])
            if ram_usage > (ram_avg * 1.2):
                if current_time - last_ram_alert_time >= 60:
                    severity = get_severity_level(ram_usage)
                    if severity:
                        alert_msg = f"High RAM Usage Alert ({ram_usage}%)"
                        top_processes = get_top_processes(sort_by='memory')
                        send_alert(severity, alert_msg, top_processes)
                        last_ram_alert_time = current_time

        time.sleep(2)

if __name__ == "__main__":
    from threading import Thread
    Thread(target=monitor_system).start()
    Thread(target=monitor_network_usage).start()    