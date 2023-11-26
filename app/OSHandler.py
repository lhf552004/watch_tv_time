from abc import abstractmethod


class OSHandler:
    @abstractmethod
    def allowOnlyApp(self, proc:[]):
        pass

    @abstractmethod
    def allowAllApp(self):
        pass