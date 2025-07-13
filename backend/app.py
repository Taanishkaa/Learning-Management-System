from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
import bcrypt
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MySQL configurations
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '123'  # Add your MySQL password here
app.config['MYSQL_DB'] = 'lms_db'

mysql = MySQL(app)

# Helper function to hash passwords
def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt)

# Helper function to verify passwords
def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        email = data['email']
        password = data['password']
        first_name = data['firstName']
        last_name = data['lastName']
        college_name = data['collegeName']
        access_type = data['accessType']
        
        # Hash the password
        hashed_password = hash_password(password)
        
        cur = mysql.connection.cursor()
        
        # Check if email already exists
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cur.fetchone() is not None:
            return jsonify({'error': 'Email already registered'}), 400
        
        # Insert new user
        cur.execute("""
            INSERT INTO users (email, password, first_name, last_name, college_name, access_type, status)
            VALUES (%s, %s, %s, %s, %s, %s, 1)
        """, (email, hashed_password, first_name, last_name, college_name, access_type))
        
        mysql.connection.commit()
        cur.close()
        
        return jsonify({'message': 'Registration successful'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data['email']
        password = data['password']
        user_type = data['userType']
        
        cur = mysql.connection.cursor()
        
        # Get user from database
        cur.execute("""
            SELECT id, email, password, first_name, last_name, access_type, status 
            FROM users 
            WHERE email = %s AND access_type = %s
        """, (email, user_type))
        
        user = cur.fetchone()
        cur.close()
        
        if user and verify_password(password, user[2]) and user[6] == 1:
            return jsonify({
                'id': user[0],
                'email': user[1],
                'firstName': user[3],
                'lastName': user[4],
                'accessType': user[5]
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/courses', methods=['GET'])
def get_courses():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, title, description, color FROM courses WHERE status = 1")
        courses = cur.fetchall()
        cur.close()
        
        courses_list = []
        for course in courses:
            courses_list.append({
                'id': course[0],
                'title': course[1],
                'description': course[2],
                'color': course[3]
            })
        
        return jsonify(courses_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/courses', methods=['POST'])
def add_course():
    try:
        if request.json.get('accessType') != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
            
        data = request.json
        title = data['title']
        description = data['description']
        color = data.get('color', '#2980b9')
        created_by = data.get('userId')
        
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO courses (title, description, color, created_by, status)
            VALUES (%s, %s, %s, %s, 1)
        """, (title, description, color, created_by))
        
        mysql.connection.commit()
        cur.close()
        
        return jsonify({'message': 'Course added successfully'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/courses/<int:course_id>', methods=['PUT'])
def update_course(course_id):
    try:
        if request.json.get('accessType') != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
            
        data = request.json
        title = data['title']
        description = data['description']
        
        cur = mysql.connection.cursor()
        cur.execute("""
            UPDATE courses 
            SET title = %s, description = %s
            WHERE id = %s
        """, (title, description, course_id))
        
        mysql.connection.commit()
        cur.close()
        
        return jsonify({'message': 'Course updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/courses/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    try:
        if request.json.get('accessType') != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
            
        cur = mysql.connection.cursor()
        cur.execute("UPDATE courses SET status = 0 WHERE id = %s", (course_id,))
        mysql.connection.commit()
        cur.close()
        
        return jsonify({'message': 'Course deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)