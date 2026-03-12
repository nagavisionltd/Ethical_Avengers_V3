#!/bin/bash
# Simple Python HTTP Server to bypass CORS issues with local assets
# Run this script, then go to http://localhost:8000/warped_city.html

cd "$(dirname "$0")"
echo "Starting local game server at http://localhost:8001/warped_city.html"
echo "Press CTRL+C to stop."
python3 -m http.server 8001
