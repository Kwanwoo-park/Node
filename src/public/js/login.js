const btn = document.getElementById('btn');
const auth = document.getElementById('auth');
const logout = document.getElementById('logout');
const email = document.getElementById('email');
const password = document.getElementById('password')

document.addEventListener('DOMContentLoaded', async () => {
    const res = await authFetch();
    const data = await res.json();

    console.log(data);
    
    if (data.userId)
        location.replace('/home');
})

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
        if (json.statusCode == 401)
            alert('Login Fail')
        else {
            alert('Login Success');
            location.replace('/home');
        }
    })
    .catch(err => {
        console.error(err);
    });
});

password.addEventListener('keydown', (event) => {
    if (event.key == 'Enter')
        btn.click();
});

async function authFetch() {
    let res = await fetch(`/api/member/token`, {
        method: 'GET',
        credentials: 'include',
    });

    if (res.status === 401) {
        const refresh = await fetch(`/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });

        if (refresh.ok) {
            res = await fetch(`/api/member/token`, {
                method: 'GET',
                credentials: 'include',
            });
        }
    }

    return res;
}