import subprocess
import os
from src.OSHandler import OSHandler
import sys


class LinuxHandler(OSHandler):
    def _add_self_to_allow_dict(self, processes_to_allow):
        # Get the full path of the currently running Python interpreter (executable)
        python_executable = sys.executable

        # Get the absolute path of the script being run
        # __file__ is the path to the current file
        script_path = os.path.abspath(__file__)

        # Assuming the name you want to use for your script in the dictionary is 'MyApp'
        processes_to_allow['MyApp'] = python_executable + ' ' + script_path
        print(processes_to_allow)

    def allowOnlyApp(self, process):
        self._add_self_to_allow_dict(process)
        # Block all outgoing traffic
        self.execute_iptables_command("sudo iptables -P OUTPUT DROP")
        self.execute_iptables_command(
            "sudo iptables -A OUTPUT -p tcp -d us-central1-aurorasoft.cloudfunctions.net --dport 443 -j ACCEPT")
        for name in process:
            self.execute_iptables_command(
                f"sudo iptables -A OUTPUT -m owner --cmd-owner {process[name]} -j ACCEPT")
        # username = os.getlogin()
        # self.execute_iptables_command(f"iptables -A OUTPUT -m owner --uid-owner {username} -j ACCEPT")
        self.setBlocked(True)

    def allowAllApp(self):
        # Set default policy of INPUT and OUTPUT chains to ACCEPT
        self.execute_iptables_command("sudo iptables -P INPUT ACCEPT")
        self.execute_iptables_command("sudo iptables -P OUTPUT ACCEPT")
        self.setBlocked(False)

        print("Default policies set to ACCEPT for INPUT and OUTPUT chains.")

    def execute_iptables_command(self, command):
        subprocess.run(command, shell=True, check=True)
        print(f"Executed: {command}")
