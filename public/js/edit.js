const $updateForm = document.querySelector('#update-form');

$updateForm.addEventListener('submit', (event) => {
    // preventing page redirect
    event.preventDefault();
    const body = new FormData($updateForm);
    return updateContact(body);
});

const updateContact = (body) => {
    const url = '/contacts/' + location.pathname.split('/')[2];
    fetch(url, { 
        method: 'PATCH',
        body
    }).then((response) => {
        alert('contact updated');
        window.location = '/';
    });
}