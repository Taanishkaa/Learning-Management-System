document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;
    
    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, userType })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('userType', data.accessType);
            localStorage.setItem('userEmail', data.email);
            window.location.href = data.accessType === 'admin' ? 'admin-dashboard.html' : 'courses.html';
        } else {
            document.getElementById('errorMsg').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('errorMsg').style.display = 'block';
    }
});