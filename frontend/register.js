document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const collegeName = document.getElementById('collegeName').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const accessType = document.querySelector('input[name="userType"]:checked').value;
    
    // Basic validation
    if (password !== confirmPassword) {
        showError("Passwords don't match!");
        return;
    }
    
    try {
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                collegeName,
                password,
                accessType
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Registration successful
            alert('Registration successful! Please login.');
            window.location.href = 'index.html';
        } else {
            // Show error message
            showError(data.error || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('An error occurred. Please try again later.');
    }
});

function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
}