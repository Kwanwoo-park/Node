const btn = document.getElementById('btn');
const auth = document.getElementById('auth');
const email = document.getElementById('email');
const password = document.getElementById('password')

btn.addEventListener('click', (event) => {
    event.preventDefault();

    fetch(`/api/auth/login`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        }),
    })
    .then(res => res.json())
    .then(json => {
        console.log(json);
        alert('Login Success');
    })
    .catch(err => {
        console.error(err);
    });
});

auth.addEventListener('click', (event) => {
    event.preventDefault();

    fetch(`/api/member/token`, {
        method: 'GET',
        credentials: 'include',
    })
    .then(res => res.json())
    .then(json => {
        console.log(json);
    })
    .catch(err => {
        console.error(err);
    });
})

password.addEventListener('keydown', (event) => {
    if (event.key == 'Enter')
        btn.click();
});