if (localStorage.getItem('userType') !== 'admin') {
    window.location.href = 'index.html';
}

async function loadCourses() {
    try {
        const response = await fetch('http://localhost:5000/api/courses');
        const courses = await response.json();
        
        const tableBody = document.getElementById('coursesTable').querySelector('tbody');
        tableBody.innerHTML = '';
        
        courses.forEach(course => {
            const row = `
                <tr>
                    <td>${course.title}</td>
                    <td>${course.description}</td>
                    <td>
                        <button onclick="editCourse(${course.id})">Edit</button>
                        <button onclick="deleteCourse(${course.id})">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

async function saveCourse(e) {
    e.preventDefault();
    
    const courseId = document.getElementById('courseId').value;
    const title = document.getElementById('courseTitle').value;
    const description = document.getElementById('courseDescription').value;
    
    try {
        const url = courseId ? 
            `http://localhost:5000/api/courses/${courseId}` :
            'http://localhost:5000/api/courses';
            
        const method = courseId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                accessType: localStorage.getItem('userType'),
                userId: localStorage.getItem('userId')
            })
        });
        
        if (response.ok) {
            loadCourses();
            closeModal();
        } else {
            const data = await response.json();
            alert(data.error || 'An error occurred');
        }
    } catch (error) {
        console.error('Error saving course:', error);
        alert('An error occurred while saving the course');
    }
}

async function deleteCourse(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        try {
            const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accessType: localStorage.getItem('userType')
                })
            });
            
            if (response.ok) {
                loadCourses();
            } else {
                const data = await response.json();
                alert(data.error || 'An error occurred');
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            alert('An error occurred while deleting the course');
        }
    }
}

document.getElementById('courseForm').addEventListener('submit', saveCourse);
document.addEventListener('DOMContentLoaded', loadCourses);

function logout() {
    localStorage.clear(); // Clears all stored user data
    window.location.href = 'index.html'; // Redirect to the login page
}