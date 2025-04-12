from firebase_admin import auth
from functools import wraps
from flask import Flask, request, jsonify, g

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs): # wrapper function
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization'] # Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6I....
            if auth_header.startswith('Bearer '):
                token = auth_header.split('Bearer ')[1]

        if not token:
            return jsonify({"error": "Authorization token is missing or invalid"}), 401

        try:
            decoded_token = auth.verify_id_token(token) # Firebase Admin SDK call
            # returns {'uid': 'firebase_user_id_123', 'email': 'user@example.com', ...}
            
            g.current_user_uid = decoded_token['uid']
            print(f"Token verified for UID: {g.current_user_uid}") 

        except auth.InvalidIdTokenError as e:
            print(f"Token verification failed: InvalidIdTokenError - {e}")
            return jsonify({"error": "Invalid authorization token"}), 401
        except Exception as e:
            print(f"Token verification failed: General Exception - {e}")
            return jsonify({"error": "Token verification failed"}), 401

        return f(*args, **kwargs)
    return decorated_function