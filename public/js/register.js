const $registrationForm = document.querySelector('#registration-form');

$registrationForm.addEventListener('submit', (e) => {
    // preventing page reload
    e.preventDefault();
    const password = e.target.password.value;
    const passwordCnf = e.target.password_confirm.value;

    if(password === passwordCnf) {
        $registrationForm.submit();
    } else {
        alert('Passwords should match');
    }
});