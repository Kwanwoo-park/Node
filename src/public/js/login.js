const btn = document.getElementById('btn');
const email = document.getElementById('email');
const password = document.getElementById('password')

btn.addEventListener('click', (event) => {
    event.preventDefault();

    fetch(`/api/member/login`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        }),
    })
    .then(res => {
        if (!res.ok) throw new Error('Login failed');
        return res.json();
    })
    .then(data => {
        console.log(data)
        alert('Login Success');
    })
    .catch(err => {
        console.error(err);
    });
});

password.addEventListener('keydown', (event) => {
    if (event.key == 'Enter')
        btn.click();
});