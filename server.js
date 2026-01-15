const express = require('express');
const session = require('express-session');
const crypto = require('crypto');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session(sessionConfig = {
    secret: 'very-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,
        // sameSite: 'Lax',  <-- brak SameSite oznacza, że zadanie 1 nie jest wykonane
    }
}
));

let userDB = { email: "student@uczelnia.pl" };

app.get('/', (req, res) => {

    req.session.userIsLoggedIn = true;

    res.send(`
        <h1>Panel Bezpieczeństwa</h1>
        <p>E-mail w bazie: <b style="color: blue;">${userDB.email}</b></p>
        <hr>
        <input type="email" id="newEmailInput" placeholder="Wpisz nowy e-mail">
        <button onclick="sendUpdate()">Zaktualizuj e-mail</button>

        <script>
            async function sendUpdate() {
                const emailValue = document.getElementById('newEmailInput').value;
                
                const response = await fetch('/update-email', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        email: emailValue
                    })
                });

                const msg = await response.text();
                alert("Serwer odpowiedział: " + msg);
                location.reload();
            }
        </script>
    `);
});

app.post('/update-email', (req, res) => {
    const failures = [];


    const origin = req.get('Origin');
    const validOrigin = 'http://localhost:3000';
    const originOK = origin === validOrigin;
    if (!originOK) failures.push(3);

    const contentType = req.get('Content-Type') || '';
    const ctOK = contentType.startsWith('application/json');
    if (!ctOK) failures.push(4);


    const serverToken = req.session?.csrfToken;
    const clientToken = req.body?.csrfToken;
    const csrfOK = serverToken && clientToken && serverToken === clientToken;
    if (!csrfOK) failures.push(2);


    if (!sessionConfig.cookie.sameSite) failures.push(1);

    if (failures.length > 0) {
        console.log("Niepoprawnie wykonane zadania:", failures);
    } else {
        console.log("Wszystkie zabezpieczenia działają poprawnie!");
    }


    if (origin && failures.length === 0) {
        userDB.email = req.body.email;
        return res.send("Zmiana zatwierdzona");
    }

    userDB.email = req.body.email;
    res.send("Zmiana zatwierdzona");
});

app.listen(3000, () => console.log('Serwer działa na http://localhost:3000'));
