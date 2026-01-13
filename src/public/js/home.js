const logout = document.getElementById('logout');
const all = document.getElementById('all');

document.addEventListener('DOMContentLoaded', async () => {
    const res = await authFetch();

    if (res.status === 401)
        location.replace('/login');

    const data = await res.json();
    console.log(data)
})

logout.addEventListener('click', (event) => {
    event.preventDefault();

    fetch(`/api/auth/logout`, {
        method: 'DELETE',
        credentials: 'include',
    })
    .then(res => {
        if (res.status === 200)
            location.replace('/login');
    })
    .catch(err => {
        console.error(err);
    });
})

all.addEventListener('click', (event) => {
    event.preventDefault();

    fetch(`/api/auth/all/logout`, {
        method: 'DELETE',
        credentials: 'include',
    })
    .then(res => {
        if (res.status === 200)
            location.replace('/login');
    })
    .catch(err => {
        console.error(err);
    })
})

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