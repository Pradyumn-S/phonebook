const $registrationForm = document.querySelector('#registration-form');

$registrationForm.addEventListener('submit', (event) => {
    // preventing page redirect
    event.preventDefault();
    const password = event.target.password.value;
    const passwordCnf = event.target.password_confirm.value;
    const body = {
        username: event.target.username.value,
        email: event.target.email.value,
        password: event.target.password.value
    }

    console.log(body);
    
    if(password === passwordCnf) {
        return addUser(body);
    } else {
        return alert('Passwords should match');
    }
});

const addUser = (body) => {
    fetch('/users', { 
        method: 'POST',
        body
    }).then((response) => {
        response.json().then((data) => { 
            console.log(data)
        });
    });
}