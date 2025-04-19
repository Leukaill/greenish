document.getElementById('login-form').addEventListener('submit', function (e) {
    const username = document.querySelector('input[name="username"]').value.trim();
    const password = document.querySelector('input[name="password"]').value.trim();

    if (!username || !password) {
        e.preventDefault(); // Prevent form submission
        alert('Please fill in all fields.');
    }
});

document.getElementById('close-login-btn').addEventListener('click', function () {
    document.querySelector('.login-form-container').classList.remove('active');
});