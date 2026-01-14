const express = require('express');
const session = require('express-session');
const crypto = require('crypto');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'tajny-klucz-blue-team',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,
    }
}));

let userDB = { email: "student@uczelnia.pl" };

app.get('/', (req, res) => {
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(16).toString('hex');
    }
    req.session.userIsLoggedIn = true;

    res.send(`
        <h1>Panel Bezpieczeństwa</h1>
        <input type="email" id="newEmailInput" placeholder="Wpisz nowy e-mail" required>
        <hr>
        <button onclick="updateEmail()">Zmień e-mail</button>
        <script>
            function updateEmail() {
                fetch('/update-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'test@json.pl', csrfToken: 'fake' })
                }).then(() => location.reload());
            }
        </script>
    `);
});

app.post('/update-email', (req, res) => {

    const origin = req.get('Origin');
    const isCrossOrigin = origin !== 'http://localhost:3000';
    let failures = [];


    if (isCrossOrigin && req.session.userIsLoggedIn) {
        console.log("Zadanie 1 zostało wykonane błędnie");
        failures.push(1);
    } else if (isCrossOrigin && !req.session.userIsLoggedIn) {
        console.log("Zadanie 1 zostało wykonane poprawnie");
    }

    if (!req.body.csrfToken || req.body.csrfToken !== req.session.csrfToken) {
        console.log("Zadanie 2 zostało wykonane błędnie");
        failures.push(2);
    } else {
        console.log("Zadanie 2 zostało wykonane poprawnie");
    }

    if (isCrossOrigin) {
        console.log("Zadanie 3 zostało wykonane błędnie");
        failures.push(3);
    } else {
        console.log("Zadanie 3 zostało wykonane poprawnie");
    }

    if (req.get('Content-Type') !== 'application/json') {
        console.log("Zadanie 4 zostało wykonane błędnie");
        failures.push(4);
    } else {
        console.log("Zadanie 4 zostało wykonane poprawnie");
    }

    userDB.email = req.body.email;

    if (failures.length > 0) {
        console.log("Strona nie jest jeszcze w pełni zabezpieczona");
    } else {
        console.log("Udało się zabezpieczyć stronę");
    }
});

app.listen(3000, () => console.log('Serwer diagnostyczny na http://localhost:3000'));