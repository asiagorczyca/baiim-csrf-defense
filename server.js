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
        <p>E-mail: <b>${userDB.email}</b></p>
        <hr>
        <h3>Zmień E-mail</h3>
        <form id="updateForm">
            <input type="hidden" id="token" value="${req.session.csrfToken}">
            <input type="email" id="newEmail" placeholder="Nowy e-mail" required>
            <button type="button" onclick="sendUpdate()">Zaktualizuj</button>
        </form>

        <script>
            async function sendUpdate() {
                const email = document.getElementById('newEmail').value;
                const token = document.getElementById('token').value;
                
                // Zadanie 4: Frontend wysyła JSON
                const response = await fetch('/update-email', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({ email: email, csrfToken: token })
                });
                const result = await response.text();
                alert(result);
                location.reload();
            }
        </script>
    `);
});

app.post('/update-email', (req, res) => {
    console.log("\n--- [RAPORT BLUE TEAM] Analiza żądania POST ---");

    let isAttackBlocked = false;

    if (!req.session.userIsLoggedIn) {
        console.log("Wykonano zadanie 1");
        isAttackBlocked = true;
    } else {
        console.log("Zadanie 1 zostało wykonane błędnie");
    }

    const origin = req.get('Origin');
    if (origin !== 'http://localhost:3000') {
        console.log("Wykonano zadanie 3");
        isAttackBlocked = true;
    } else {
        console.log("Zadanie 3 zostało wykonane błędnie");
    }

    const contentType = req.get('Content-Type');
    if (contentType !== 'application/json') {
        console.log("Wykonano zadanie 4");
        isAttackBlocked = true;
    } else {
        console.log("Zadanie 4 zostało wykonane błędnie");
    }

    const clientToken = req.body.csrfToken;
    const serverToken = req.session.csrfToken;
    if (!clientToken || clientToken !== serverToken) {
        console.log("Wykonano zadanie 2");
        isAttackBlocked = true;
    } else {
        console.log("Zadanie 2 zostało wykonane błędnie");
    }

    if (isAttackBlocked) {
        console.log("Udało się zablokować atak");
        return res.status(403).send("Odmowa dostępu");
    } else {
        console.log("System jest podatny!!!");
        userDB.email = req.body.email;
        res.send("Dane zaktualizowane!");
    }
});

app.listen(3000, () => console.log('Serwer działa na http://localhost:3000'));