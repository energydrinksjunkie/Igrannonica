
from flask import Flask
import pandas as pd

app = Flask(__name__)

hostName = "localhost"
serverPort = 8080


class Controller():
    @app.route('/image')
    def do_GET(self):
        if 'filename' in request.args:
            myfilename = request.args.get('filename')
            return render_template(myfilename)
        else:
            return "No input file specified"

if __name__ == "__main__":        
    app.run(host=hostName, port=serverPort, debug=True)
    print("Server started http://%s:%s" % (hostName, serverPort))


# flask run -h localhost -p 3000