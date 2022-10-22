# Ovaj fajl se koristi samo za development
# Za produkciju koristiti config_prod.py (potrebno je preimenovati ga i obrisati ovaj fajl)

HOST_NAME = 'localhost'
SERVER_PORT = 8081

TEST_SOCKET_SRV_ADDR = 'localhost'
TEST_SOCKET_SRV_PORT = 8000

TEST_HTTP_SRV_ADDR = TEST_SOCKET_SRV_ADDR
TEST_HTTP_SRV_PORT = TEST_SOCKET_SRV_PORT+ 1

# Zakomentarisane linije koristiti samo za testing i nakon sto se 
# testiranje obavi ponovo ih staviti pod komentar. Ukoliko se one
# otkomentarisu potrebno je staviti pod komentar druge 2 linije ispod njih

#BACKEND_BASE_ADDRESS = TEST_SOCKET_SRV_ADDR  # Just for testing
#BACKEND_WEB_SOCKET_URI = f'ws://{TEST_SOCKET_SRV_ADDR}:{TEST_SOCKET_SRV_PORT}'  # Just for testing

BACKEND_BASE_ADDRESS = 'localhost:7220' # For development
BACKEND_WEB_SOCKET_URI = f'ws://{BACKEND_BASE_ADDRESS}/ws' # For development

PRINT_PREFIX = "(script)     "

ENVIRONMENT = 'development'