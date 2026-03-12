import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = "/Users/nagavision/Ethical_Avengers_V3"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()
except Exception as e:
    with open("error.log", "w") as f:
        f.write(str(e))
