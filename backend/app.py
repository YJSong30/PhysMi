from flask import Flask
from database import close_db
import os

app = Flask(__name__)


app.config['DATABASE_NAME'] = os.environ.get('DATABASE_NAME')
app.config['DATABASE_USER'] = os.environ.get('DATABASE_USER')
app.config['DATABASE_PASSWORD'] = os.environ.get('DATABASE_PASSWORD') # No default for password!
app.config['DATABASE_HOST'] = os.environ.get('DATABASE_HOST')
app.config['DATABASE_PORT'] = os.environ.get('DATABASE_PORT')

if not app.config['DATABASE_PASSWORD']:
  print("ERROR: DATABASE_PASSWORD environment variable not set.")

app.teardown_appcontext(close_db)

@app.route('/')
def home():
  from database import get_db
  db_conn = get_db()
  if db_conn:
    try:
      cursor = db_conn.cursor()
      cursor.execute("SELECT 1;")
      cursor.close()
      status_message = "DB Connected Successfully!"

    except Exception as e:
      status_message = f"DB Connection OK, but Query Failed: {e}"

  else:
    return "DB Connection FAILED", 500

  return f"{status_message} Hello World - PhysMi backend is running!"

if __name__ == '__main__':
  app.run(host=os.environ.get('FLASK_RUN_HOST', '0.0.0.0'),
            port=int(os.environ.get('FLASK_RUN_PORT', 5000)))