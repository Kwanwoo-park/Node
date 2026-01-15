const logout = document.getElementById('logout');
const all = document.getElementById('all');
const password = document.getElementById('password');
const update = document.getElementById('passwordUpdate');

document.addEventListener('DOMContentLoaded', async () => {
    const res = await authFetch();

    if (res.status === 401)
        location.replace('/login');
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

update.addEventListener('click', async (e) => {
    const res = await fetch(`/api/member/update/`+ e.target.dataset.memberId, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            password: password.value,
        }),
    });

    if (res.status == 200)
        location.replace('/login');
    else
        alert('update fail');
})

password.addEventListener('keydown', (event) => {
    if (event.key == 'Enter')
        update.click();
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