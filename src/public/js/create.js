const create = document.getElementById('create');
const email = document.getElementById('email');
const name = document.getElementById('name');
const password = document.getElementById('password');

create.addEventListener('click', async () => {
    if (!email.value) {
        alert('이메일를 입력하세요');
        return;
    }

    if (!password.value) {
        alert('비밀번호를 입력하세요');
        return
    }

    if (!name.value) {
        alert('이름을 입력하세요');
        return
    }

    const res = await fetch(`/api/member/create`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
            name: name.value,
        }),
    });

    if (!res.ok) {
        const err = await res.json();
        alert(err.message);
    } else
        location.replace('/login');
});

name.addEventListener('keydown', (event) => {
    if (event.key == 'Enter')
        create.click();
});