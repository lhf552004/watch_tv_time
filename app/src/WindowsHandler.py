import subprocess

from src.OSHandler import OSHandler


class WindowsHandler(OSHandler):

    def allowOnlyApp(self, process):
        # Block all outbound traffic
        subprocess.run(
            "netsh advfirewall set allprofiles firewallpolicy blockinbound,blockoutbound", shell=True)
        for name in process:
            # Allow specific process
            subprocess.run(
                f'netsh advfirewall firewall add rule name="Allow {name}" dir=out action=allow program="{process[name]}" enable=yes', shell=True)
        self.setBlocked(True)

    def allowAllApp(self):
        try:
            # Change the firewall policy: Block inbound, Allow outbound
            subprocess.run(
                "netsh advfirewall set allprofiles firewallpolicy blockinbound,allowoutbound", shell=True)
            print("Changed firewall policy: Inbound connections are blocked unless they match a rule; Outbound connections are allowed.")
            self.setBlocked(False)
        except subprocess.CalledProcessError as e:
            print(f"An error occurred: {e}")
