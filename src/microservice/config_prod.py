# Produkciona konfiguracija
# U produkciji je potrebno da se preimenuje u config.py

HOST_NAME = 'softeng.pmf.kg.ac.rs'
SERVER_PORT = 10082
BACKEND_BASE_ADDRESS = 'softeng.pmf.kg.ac.rs:10079'
BACKEND_WEB_SOCKET_URI = f'ws://{BACKEND_BASE_ADDRESS}/ws'

PRINT_PREFIX = "(script)     "

ENVIRONMENT = 'production'