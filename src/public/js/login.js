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
        localStorage.setItem('token', json.accessToken);
        alert('Login Success');
    })
    .catch(err => {
        console.error(err);
    });
});

auth.addEventListener('click', (event) => {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('로그인이 필요합니다');
        return;
    }

    fetch(`/api/member/token`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
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