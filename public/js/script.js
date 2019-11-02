const $noticeSection = document.querySelector('#notice-section');
const $searchSection = document.querySelector('#search-section');
const $searchForm = document.querySelector('form');
const $searchText = document.querySelector('.search-txt');

// Templates
const noticeTemplate = document.getElementById('notice-template').innerHTML;

const noticeURL = '/notice?limit=5&skip=0';
fetch(noticeURL).then((response) => {
    response.json().then((data) => {
        for(let i = 0; i < data.length; i++) {
            const html = Mustache.render(noticeTemplate, {
                id: data[i]._id,
                title: data[i].title,
                body: (data[i].body.length > 200) ? data[i].body.substring(0, 200) + '...': data[i].body,
                date: moment(data[i].createdAt).format("Do MMM YY")
            });

            $noticeSection.insertAdjacentHTML('beforeend', html);
        }
    });
});

$searchForm.addEventListener('submit', (e) => {
    // preventing page reload
    e.preventDefault();
    console.log('working')
    const q = $searchText.value.trim();
    const url = `/notice?search=${encodeURIComponent(q)}`;

    if(q == '') {
        return;
    }

    $searchSection.innerHTML = '';

    document.getElementById('notice-block').classList.add('hide');
    document.getElementById('search-result').classList.remove('hide');
    fetch(url).then((response) => {
        response.json().then((data) => { 
            for(let i = 0; i < data.length; i++) {
                const html = Mustache.render(noticeTemplate, {
                    id: data[i]._id,
                    title: data[i].title,
                    body: (data[i].body.length > 200) ? data[i].body.substring(0, 200) + '...': data[i].body,
                    date: moment(data[i].createdAt).format("Do MMM YY")
                });
    
                $searchSection.insertAdjacentHTML('beforeend', html);
            }
        });
    });
});