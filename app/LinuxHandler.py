import subprocess
import os
from app.OSHandler import OSHandler


class LinuxHandler(OSHandler):

    def allowOnlyApp(self, process):
        # Block all outgoing traffic
        self.execute_iptables_command("iptables -P OUTPUT DROP")
        for name in process:
            self.execute_iptables_command(f"iptables -A OUTPUT -m owner --cmd-owner {process[name]} -j ACCEPT")
        # username = os.getlogin()
        # self.execute_iptables_command(f"iptables -A OUTPUT -m owner --uid-owner {username} -j ACCEPT")

    def allowAllApp(self):
        # Set default policy of INPUT and OUTPUT chains to ACCEPT
        self.execute_iptables_command("iptables -P INPUT ACCEPT")
        self.execute_iptables_command("iptables -P OUTPUT ACCEPT")

        print("Default policies set to ACCEPT for INPUT and OUTPUT chains.")

    def execute_iptables_command(self, command):
        try:
            subprocess.run(command, shell=True, check=True)
            print(f"Executed: {command}")
        except subprocess.CalledProcessError as e:
            print(f"Error executing {command}: {e}")