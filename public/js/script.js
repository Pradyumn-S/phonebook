const $contactForm = document.querySelector('#contact-form');
const $searchForm = document.querySelector('#search-form');
const $searchText = document.querySelector('.search-txt')

$contactForm.addEventListener('submit', (event) => {
    // preventing page redirect
    event.preventDefault();
    const body = new FormData($contactForm);
    return addContact(body);
});

const addContact = (body) => {
    fetch('/contacts', { 
        method: 'POST',
        body
    }).then((response) => {
        response.json().then((data) => { 
            alert('contact added');
            $contactForm.reset();
            refreshList();
        })
    });
}

const $collection = document.querySelector('.collection');

// Templates
const contactTemplate = document.getElementById('contact-template').innerHTML;

function deleteContact(id) {
    console.log('hello');
    const url = `/contacts/${id}`
    fetch(url, { 
        method: 'DELETE',
    }).then((response) => {
        alert('contact deleted')
        refreshList();
    });
}

function refreshList(url = '/contacts?sortBy=name&order=asc') {
    $collection.innerHTML = "";
    fetch(url).then((response) => {
        response.json().then((data) => {
            for(let i = 0; i < data.length; i++) {
                const html = Mustache.render(contactTemplate, {
                    id: data[i]._id,
                    name: data[i].name,
                    phone: data[i].phone,
                    email: data[i].email,        
                });
    
                $collection.insertAdjacentHTML('beforeend', html);
            }
        });
    });
};

refreshList();

$searchForm.addEventListener('submit', (e) => {
    // preventing page reload
    e.preventDefault();
    const q = $searchText.value.trim();
    const url = `/contacts?search=${encodeURIComponent(q)}`;

    if(q == '') {
        return refreshList();
    }

    refreshList(url);
});

function s() {
    if(document.querySelector('#hidden-block').classList.contains('hide')) {
        document.querySelector('#hidden-block').classList.remove('hide');
    } else {
        document.querySelector('#hidden-block').classList.add('hide');
    }
};