const btn = document.getElementById('btn');
const auth = document.getElementById('auth');
const logout = document.getElementById('logout');
const email = document.getElementById('email');
const password = document.getElementById('password')

document.addEventListener('DOMContentLoaded', async () => {
    const res = await authFetch();
    const data = await res.json();
    console.log(data);
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
        console.log(json);
        alert('Login Success');
    })
    .catch(err => {
        console.error(err);
    });
});

auth.addEventListener('click', async (event) => {
    event.preventDefault();

    let res = await fetch(`/api/member/token`, {
        method: 'GET',
        credentials: 'include',
    });

    let json = await res.json();
    console.log(json);

    if (res.status === 401) {
        const refreshRes = await fetch(`/api/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });

        if (refreshRes.ok) {
            res = await fetch(`/api/member/token`, {
                method: 'GET',
                credentials: 'include',
            });
        }

        console.log(json);
    }
})

logout.addEventListener('click', (event) => {
    event.preventDefault();

    fetch(`/api/auth/logout`, {
        method: 'DELETE',
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