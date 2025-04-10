# database.py's job: 
# - encapsulate all direct database interactions
# - provide functions like add_user_to_db, get_user_by_username, create_recipe_in_db, etc using psycopg2

import psycopg2
import psycopg2.extras # To get results as dictionaries
from flask import current_app, g # To access app config and request context
import click # flask's cli helper
from flask.cli import with_appcontext


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

def init_db():
    db = get_db()
    if not db:
        print("database connection failed, cannot initialize")
        return
    
    try:
        cursor = db.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY, 
                username VARCHAR(80) UNIQUE NOT NULL, 
                email VARCHAR(120) UNIQUE NOT NULL, 
                password_hash VARCHAR(128) NOT NULL, 
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)
        print("Created users table.")

        # add creation for other tables here: surveys, chats

        db.commit()
        cursor.close()
    except psycopg2.Error as e:
        print(f"Error initializing database: {e}")
        db.rollback()

    finally:
        pass

# add user to database 
# def add_user_to_db(username, email, password_hash):
#     db_conn = get_db()

#     if not db_conn:
#         return None

#     cursor = db_conn.cursor()
#     new_user_id = None

#     try:
#         cursor.execute("INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id", (username, email, password_hash))
#         result_row = cursor.fetchone()

#         if result_row:
#             new_user_id = result_row[0]
#             db_conn.commit()
#             print(f"User '{username}' added with ID: {new_user_id}")
#             return new_user_id
    
#     except psycopg2.IntegrityError as e:
#         db_conn.rollback()
#         return (False, f"Integrity error: {e}")
    
#     except psycopg2.Error as e:
#         db_conn.rollback()
#         print(f"Error adding a user: {e}")
#         return (False, f"Database error occured: {e}")


#     finally:
#         cursor.close()

# --- Function to create a Flask CLI command ---
@click.command('init-db') # Defines the command name 'flask init-db'
@with_appcontext # Ensures Flask app context is available (for config access in get_db)
def init_db_command():
    """CLI command to clear existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.') # Prints confirmation to terminal