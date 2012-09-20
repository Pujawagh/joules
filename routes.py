import bottle
from bottle import route, run, template, static_file, get, post, request, redirect
from bottle import Bottle
from queries import *
from beaker.middleware import SessionMiddleware
from queries import *
import datetime
import json 
import datetime


class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        elif isinstance(obj, datetime.date):
            return obj.isoformat()
        elif isinstance(obj, datetime.timedelta):
            return (datetime.datetime.min + obj).time().isoformat()
        else:
            return super(DateTimeEncoder, self).default(obj)


session_opts = {
    'session.type': 'file',
    'session.cookie_expires': 3000,
    'session.data_dir': './data',
    'session.auto': True
}
applet = Bottle()

app = SessionMiddleware(applet, session_opts)
get_url = applet.get_url
app.route = applet.route



@app.route('/save')
def index():
  programs = saveQuery(request.params)
  programs = DateTimeEncoder().encode(programs)
  return programs