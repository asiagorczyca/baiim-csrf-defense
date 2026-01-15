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
 

    userDB.email = req.body.email;
    res.send("Zmiana zatwierdzona");
});

app.listen(3000, () => console.log('Serwer działa na http://localhost:3000'));
