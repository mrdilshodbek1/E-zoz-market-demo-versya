#!/bin/sh
cd "$(dirname "$0")"
[ -f .env ] || cp .env.example .env
pip install -r requirements.txt
python3 server.py
