@echo off
cd /d "%~dp0"
if not exist .env copy .env.example .env
pip install -r requirements.txt
python server.py
pause
