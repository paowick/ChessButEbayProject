async function login() {
    const loginInput = document.getElementById('email').value
    const passInput = document.getElementById('password').value
    ValidateEmail(loginInput) ? userCheck(loginInput, passInput) : errEmailInvalid();

}

async function userCheck(loginInput, passInput) {
    const data = {
        email: loginInput,
        password: passInput
    }
    const resLogin = await fetch(`/login/logInVerify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    const resdata = await resLogin.json()
    !resdata.Response ? errEmailPassword() : loginPass(resdata.body)

}

function signUp() {
    console.log("signUp");
}

function errEmailInvalid() {
    const form = document.getElementById('err')
    form.innerHTML = ''
    form.innerHTML += '<h7 style="color: red;">Email invalid<h7>'

}

function errEmailPassword() {
    const form = document.getElementById('err')
    form.innerHTML = ''
    form.innerHTML += '<h7 style="color: red;">Please check your email or password<h7>'
}

function loginPass(newCookie) {
    cookieSet(newCookie)
    location.href = '/'
}

function cookieSet(newCookie) {
    document.cookie = `email=${newCookie.Email};`
    document.cookie = `id=${newCookie.Id}`
}

function ValidateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (input.match(validRegex)) {
        return true;
    } else {
        return false;
    }

}