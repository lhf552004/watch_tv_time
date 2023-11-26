from abc import abstractmethod


class OSHandler:

    def __init__(self) -> None:
        self._isBlocked = False

    def isBlocked(self):
        return self._isBlocked

    def setBlocked(self, blocked):
        self._isBlocked = blocked

    @abstractmethod
    def allowOnlyApp(self, proc):
        pass

    @abstractmethod
    def allowAllApp(self):
        pass
