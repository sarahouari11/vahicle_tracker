function login(event) {
    event.preventDefault(); // Prevent form submission

    // Get input values
    var email = document.getElementById('loginUsername').value.trim();
    var password = document.getElementById('loginPassword').value.trim();

    // Validate input
    if (email === "" || password === "") {
        alert("Please enter email and password");
        return;
    }

    // Send login request to backend
    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        // Handle login response
        console.log(data); // You can handle the response data here
        // Redirect to main page or display success message
    })
    .catch(error => {
        console.error('Login error:', error);
        alert("Login failed. Please try again.");
    });
}
function ShowRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function ShowLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('forgotPassword').style.display = 'none';
}
// Function to show the Forgot Password section
function showForgotPassword() {
    document.getElementById('forgotPassword').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
}

// Function to send reset password link
function sendResetLink(event) {
    event.preventDefault(); // Prevent form submission

    // Get the email address entered by the user
    var email = document.getElementById('forgotEmail').value.trim();

    // Check if the email is valid
    if (!validateEmail(email)) {
        alert("Please enter a valid email address");
        return;
    }

    // Display the reset message
    document.getElementById('resetEmail').textContent = email;
    document.getElementById('resetEmail').style.textAlign="center";
    document.getElementById('resetEmail').style.color="green";
    document.getElementById('resetMessage').style.display = 'block';

    // You can optionally redirect the user to a different page or perform other actions after sending the reset link
}

// Function to validate email address
function validateEmail(email) {
    // Regular expression for validating email
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function register() {
    if (password !== confirmPassword) {
        document.getElementById("confirm").display="block";
     }
    // Show loader
    document.getElementById("registerForm").display="none";
    document.getElementById("loader").style.display = "block";
    document.getElementById("loader").style.fontSize = "30px";

    // Get form input values
    var fullName = document.getElementById("fullname").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("registerPassword").value;
    var confirmPassword = document.getElementById("confirmpassword").value;
    var carId = document.getElementById("carid").value;
    var rememberMe = document.getElementById("remember").checked;

    // Validate form data (e.g., check if passwords match)
    if (password !== confirmPassword) {
       document.getElementById("confirm").display="block";
    }

    // Construct registration object
    var registrationData = {
        fullName: fullName,
        email: email,
        password: password,
        carId: carId,
        rememberMe: rememberMe
    };

    // Send registration data to backend
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "your-backend-url", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Hide loader
                document.getElementById("loader").style.display = "none";
                // Show success message
                document.getElementById("successMessage").style.display = "block";
                // Redirect to main.html after 2 seconds
                setTimeout(function() {
                    window.location.href = "main.html";
                }, 2000);
            } else {
                // Hide loader if there's an error
                document.getElementById("loader").style.display = "none";
                // Handle errors from the backend
                // For example, show an error message to the user
                alert("Error: " + xhr.responseText);
            }
        }
    };
    xhr.send(JSON.stringify(registrationData));
}
function check(){
    var password = document.getElementById("registerPassword").value;
    var confirmPassword = document.getElementById("confirmpassword").value;
    if(password !== confirmPassword){
        document.getElementById("confirm").display="block";
    }
}

