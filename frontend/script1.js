// Check if user is logged in
if (!localStorage.getItem('userEmail')) {
    window.location.href = 'index.html';
}

// Load courses from API
async function loadCourses() {
    try {
        const response = await fetch('http://localhost:5000/api/courses');
        const courses = await response.json();
        
        const coursesGrid = document.getElementById('coursesGrid');
        coursesGrid.innerHTML = ''; // Clear existing courses
        
        courses.forEach(course => {
            const courseElement = `
                <div class="course-card">
                    <div class="course-image" style="background-color: ${course.color}"></div>
                    <div class="course-content">
                        <h2 class="course-title">${course.title}</h2>
                        <p class="course-description">${course.description}</p>
                        <a href="course-content.html?id=${course.id}" class="start-btn">Start Learning</a>
                    </div>
                </div>
            `;
            coursesGrid.innerHTML += courseElement;
        });
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// Initialize page
document.getElementById('userName').textContent = `Welcome, ${localStorage.getItem('userEmail')}`;
loadCourses();

function logout() {
    localStorage.clear(); // Clears all stored user data
    window.location.href = 'index.html'; // Redirect to the login page
}