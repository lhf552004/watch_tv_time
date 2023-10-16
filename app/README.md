## Watch TV Time Admin

## Install

### Create virtual environment

`python3 -m venv wtenv`

### Activate virtual env

In Windows

`. .\wtenv\Scripts\Activate`

In Linux

`source wtenv/bin/activate`

### Install packages

`pip install -r requirements.txt`

### Package it into exe

`pyinstaller --onefile --noconsole main.py`

## Use

Copy dist/main.py and the .env to the folder

1. Press Win + R to open the Run dialog.
2. Type shell:startup and press Enter. This will open the Startup folder for the current user.
3. Drag your .exe file (or a shortcut to your .exe file) into this folder.
4. Create ".env" file along with the exe file, and enter your user uid like

   `ownerId='Your user uid'`
