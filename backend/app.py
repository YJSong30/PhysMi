# app.py's job:
# - handle HTTP requests/responses
# - parse incoming data
# - validate inputs (at HTTP level)
# - call appropriate business logic/data access functions

from flask import Flask, request, jsonify
from database import close_db, init_db_command, get_db, add_user_to_db
from dotenv import load_dotenv
import os
import bcrypt # Import the standard bcrypt library

load_dotenv()

app = Flask(__name__)

# No need to initialize bcrypt with the app anymore
# bcrypt = Bcrypt(app) # <- Remove this line

app.config['DATABASE_NAME'] = os.environ.get('DATABASE_NAME')
app.config['DATABASE_USER'] = os.environ.get('DATABASE_USER')
app.config['DATABASE_PASSWORD'] = os.environ.get('DATABASE_PASSWORD') # No default for password!
app.config['DATABASE_HOST'] = os.environ.get('DATABASE_HOST')
app.config['DATABASE_PORT'] = os.environ.get('DATABASE_PORT')

if not app.config['DATABASE_PASSWORD']:
  print("ERROR: DATABASE_PASSWORD environment variable not set.")

app.teardown_appcontext(close_db)

app.cli.add_command(init_db_command)

@app.route('/', methods=['GET'])
def home():
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

@app.route('/api/users/register', methods=['POST'])
def user_registration():
  if not request.is_json:
    return jsonify({"error": "request must be JSON"}), 400

  data = request.get_json()

  # {
  #   "username": "some_desired_username",
  #   "email": "user@example.com",
  #   "password": "their_chosen_password"
  # }

  if 'username' not in data or 'email' not in data or 'password' not in data:
    return jsonify({"error": "missing key in request"}), 400

  username = data["username"]
  email = data["email"]
  password = data["password"]

  if not username or not email or not password:
    return jsonify({"error": "username, email, or password cannot be empty"}), 400

  # --- Use standard bcrypt ---
  # 1. Encode the password string to bytes
  password_bytes = password.encode('utf-8')
  # 2. Generate a salt
  salt = bcrypt.gensalt()
  # 3. Hash the password bytes using the salt
  hashed_password_bytes = bcrypt.hashpw(password_bytes, salt)
  # 4. Decode the resulting hash bytes back to a string for storage
  pw_hash_str = hashed_password_bytes.decode('utf-8')
  # --- End standard bcrypt usage ---

  result = add_user_to_db(username, email, pw_hash_str)

  if isinstance(result, int):
    new_user_id = result
    return jsonify({
    "message": "User registered successfully",
    "user": {"id": new_user_id, "username": username, "email": email}
    }), 201
  elif result[0] is False and result[1].startswith("Integrity error:"):
    return jsonify({"error": "username already exists"}), 409
  else: # connection failed or other DB error
    return jsonify({"error": "registration failed due to server error"}), 500 # 500 Internal Server Error
  
if __name__ == '__main__':
  app.run(host=os.environ.get('FLASK_RUN_HOST', '0.0.0.0'),
  port=int(os.environ.get('FLASK_RUN_PORT', 5000)))