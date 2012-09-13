from routes import *


import sys

if len(sys.argv) >1: port = sys.argv[1]
else: port = 9999

run(app,host='localhost', port=port)