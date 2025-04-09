# backend/database.py
import psycopg2
import psycopg2.extras # To get results as dictionaries
from flask import current_app, g # To access app config and request context

def get_db():
    """
    Opens a new database connection if there is none yet for the
    current application context.
    'g' is a special object unique for each request. It's used to store
    data that might be accessed multiple times during a request.
    The connection is stored on 'g' so we reuse it instead of creating
    a new one if get_db() is called again during the same request.
    """
    if 'db' not in g:
        try:
            conn_string = "dbname='{dbname}' user='{user}' password='{password}' host='{host}' port='{port}'".format(
                dbname=current_app.config['DATABASE_NAME'],
                user=current_app.config['DATABASE_USER'],
                password=current_app.config['DATABASE_PASSWORD'],
                host=current_app.config['DATABASE_HOST'],
                port=current_app.config['DATABASE_PORT']
            )
            g.db = psycopg2.connect(conn_string)
            # Optional: Set autocommit to True for simpler transaction handling in basic cases,
            # but be aware this commits after *every* execute. Manual commit gives more control.
            # g.db.autocommit = True
            print("Database connection opened.") # For debugging
        except psycopg2.Error as e:
            # Handle connection errors gracefully (log them, maybe raise an exception)
            print(f"Error connecting to PostgreSQL database: {e}")
            # Depending on your error strategy, you might want to return None or raise
            g.db = None # Indicate connection failure

    return g.db

def close_db(e=None):
    """
    Closes the database connection if it exists in the current context 'g'.
    This function is typically registered to run automatically after each request.
    """
    db = g.pop('db', None) # Get the connection from g, removing it

    if db is not None:
        db.close()
        print("Database connection closed.") # For debugging