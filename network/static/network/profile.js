document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#f-btn')) {
        document.querySelector('#f-btn').addEventListener('click', function () {
            // alert(document.querySelector('#profile-user').value);
            let data = JSON.stringify({
                user: `${document.querySelector('#profile-user').value}`
            });

            fetch(`http://127.0.0.1:8000/api/follow/${document.querySelector('#profile-user').value}`, {
                method: 'POST',
                body: data
            })
                .then(response => response.json())
                .then(data => { console.log(data); });
            window.location.href = window.location.href;

        });
    }
    if (document.querySelector('#uf-btn')) {
        document.querySelector('#uf-btn').addEventListener('click', function () {
            let data = JSON.stringify({
                user: `${document.querySelector('#profile-user').value}`
            });

            fetch(`http://127.0.0.1:8000/api/unfollow/${document.querySelector('#profile-user').value}`, {
                method: 'POST',
                body: data
            })
                .then(response => response.json())
                .then(data => { console.log(data); });
            window.location.href = window.location.href;
        });
    }
});