from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import json
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# MySQL Database Configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'smart_campus'
}

def get_db_connection():
    """Create a database connection"""
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def init_database():
    """Initialize database tables"""
    conn = get_db_connection()
    if not conn:
        print("Failed to connect to database")
        return
    
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firstName VARCHAR(50),
            lastName VARCHAR(50),
            email VARCHAR(100) UNIQUE,
            studentId VARCHAR(20),
            password VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create events table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(200),
            date DATE,
            time TIME,
            location VARCHAR(200),
            category ENUM('academic','sports','cultural','social'),
            description TEXT,
            capacity INT DEFAULT 100,
            organizer VARCHAR(100),
            registrations INT DEFAULT 0,
            createdBy INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (createdBy) REFERENCES users(id)
        )
    ''')
    
    conn.commit()
    cursor.close()
    conn.close()
    print("Database tables initialized successfully")

# Registration endpoint
@app.route('/api/register.php', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        required_fields = ['firstName', 'lastName', 'email', 'studentId', 'password']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = conn.cursor()
        
        # Check if email already exists
        cursor.execute('SELECT id FROM users WHERE email = %s', (data['email'],))
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Email already exists'}), 400
        
        # Hash password
        hashed_password = generate_password_hash(data['password'])
        
        # Insert new user
        cursor.execute(
            'INSERT INTO users (firstName, lastName, email, studentId, password) VALUES (%s, %s, %s, %s, %s)',
            (data['firstName'], data['lastName'], data['email'], data['studentId'], hashed_password)
        )
        
        conn.commit()
        user_id = cursor.lastrowid
        cursor.close()
        conn.close()
        
        return jsonify({'success': True, 'userId': user_id}), 200
    
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'error': 'Registration failed'}), 500

# Login endpoint
@app.route('/api/login.php', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password required'}), 400
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = conn.cursor(dictionary=True)
        
        # Find user by email
        cursor.execute('SELECT id, firstName, lastName, email, studentId, password FROM users WHERE email = %s', 
                      (data['email'],))
        user = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if user and check_password_hash(user['password'], data['password']):
            # Remove password from response
            user.pop('password')
            return jsonify({'success': True, 'user': user}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': 'Login failed'}), 500

# Get all events
@app.route('/api/events.php', methods=['GET'])
def get_events():
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM events ORDER BY date, time ASC')
        events = cursor.fetchall()
        
        # Convert TIME objects to strings
        for event in events:
            if event['time']:
                event['time'] = str(event['time'])
        
        cursor.close()
        conn.close()
        
        return jsonify(events), 200
    
    except Exception as e:
        print(f"Get events error: {e}")
        return jsonify({'error': 'Failed to load events'}), 500

# Create event
@app.route('/api/events.php', methods=['POST'])
def create_event():
    try:
        data = request.get_json()
        
        required_fields = ['title', 'date', 'time', 'location', 'category', 'description', 'capacity', 'organizer', 'createdBy']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = conn.cursor()
        
        cursor.execute(
            'INSERT INTO events (title, date, time, location, category, description, capacity, organizer, createdBy) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)',
            (data['title'], data['date'], data['time'], data['location'], data['category'], 
             data['description'], data['capacity'], data['organizer'], data['createdBy'])
        )
        
        conn.commit()
        event_id = cursor.lastrowid
        cursor.close()
        conn.close()
        
        return jsonify({'success': True, 'id': event_id}), 200
    
    except Exception as e:
        print(f"Create event error: {e}")
        return jsonify({'error': 'Failed to create event'}), 500

# Update event
@app.route('/api/events.php', methods=['PUT'])
def update_event():
    try:
        data = request.get_json()
        
        if 'id' not in data:
            return jsonify({'error': 'Event ID required'}), 400
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = conn.cursor()
        
        cursor.execute(
            'UPDATE events SET title=%s, date=%s, time=%s, location=%s, category=%s, description=%s, capacity=%s, organizer=%s WHERE id=%s AND createdBy=%s',
            (data['title'], data['date'], data['time'], data['location'], data['category'],
             data['description'], data['capacity'], data['organizer'], data['id'], data['createdBy'])
        )
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'success': True}), 200
    
    except Exception as e:
        print(f"Update event error: {e}")
        return jsonify({'error': 'Failed to update event'}), 500

# Delete event
@app.route('/api/events.php', methods=['DELETE'])
def delete_event():
    try:
        data = request.get_json()
        
        if 'id' not in data or 'createdBy' not in data:
            return jsonify({'error': 'ID and createdBy required'}), 400
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM events WHERE id=%s AND createdBy=%s', (data['id'], data['createdBy']))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'success': True}), 200
    
    except Exception as e:
        print(f"Delete event error: {e}")
        return jsonify({'error': 'Failed to delete event'}), 500

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'Backend is running!'}), 200

if __name__ == '__main__':
    print("Initializing database...")
    init_database()
    print("Starting Flask backend server on http://localhost:5000")
    app.run(debug=False, host='localhost', port=5000)
