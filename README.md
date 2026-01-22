# baiim-csrf-defense
Repozytorium do projektu z przedmiotu Bezpieczeństwo aplikacji internetowych i mobilnych

## Instalacja 
1. Pobierz Node.js https://nodejs.org/en/download
2. Uruchom server `node server.js`

## Instrukcja do laboratorium 
To laboratorium polega na zabezpieczeniu pliku server.js zgodnie z wymienionymi metodami podczas prezentacji, składa się z 4 zadań. W razie problemów pod zadaniami ukryte są dokładne kroki jakie trzeba podjąć w celu rozwiązania zadania. 

## Zadania

Sprawdź poprawność każdego wykonanego ćwiczenia przez uruchomienie ataku i obserwowanie wpisów w konsoli serwera. Uruchomienia ataku polega na przejściu do folderu attack i uruchomieniu strony html na innym porcie `npx serve . -l 4000` oraz wejściu w przeglądarce na stronę `http://localhost:4000/attack`. Jeśli wyświetli się komunikat `"zmiana została zatwierdzona"`, to po odświeżeniu strony z formularzem e-mail zmieni się na `hacker@evil.com`. 

### Zadanie 1

**Same Site Cookie Hardening**
Zabroń przeglądarce wysyłania ciasteczka sesji kiedy żądanie pochodzi ze strony zewnętrznej (attack.html)


<details>
<summary>Rozwiązanie</summary>

  1. Znajdź, gdzie konfigurowana jest sesja w `server.js`
  
2. Dodaj `SameSite: 'Lax'` do cookie
       
</details>

###  Po czym rozpoznać prawidłowe rozwiązanie?
Poprawne rozwiązanie rozpoznasz po tym, że podczas ataku (na porcie 4000) przeglądarka w ogóle nie dołącza nagłówka `Cookie` do wysyłanego żądania, przez co serwer nie rozpoznaje sesji użytkownika.

### Zadanie 2

**Synchronizer Token Pattern**
Upewnienie się, że każde żądanie zmieniające stan aplikacji wymaga unikalnego, tajnego tokena, którego atakujący nie jest w stanie odgadnąć ani odczytać.
<details>
<summary>Rozwiązanie</summary>

1. W metodzie `app.get('/')` wygeneruj losowy ciąg znaków i zapisz go w sesji użytkownika jako `req.session.csrfToken` (`req.session.csrfToken = crypto.randomBytes(16).toString('hex');`)

2. W tej samej metodzie w ciele odpowiedzi dodaj `X-CSRF-Token: csrfToken` (przed funkcją dodaj `const csrfToken = "${token}";`) 

3. W metodzie `app.post('/update-email')` dodaj logikę porównującą token przesłany w formularzu z tokenem zapisanym w sesji.

4. Jeśli tokeny nie są identyczne lub tokenu brakuje, przerwij operację i zwróć błąd `res.status(403)`.

   Podpowiedź: trzeba porównać `req.headers['x-csrf-token'];` z `req.session.csrfToken`

</details>

### Po czym rozpoznać prawidłowe rozwiązanie?
Poprawne rozwiązanie rozpoznasz po tym, że legalne żądanie (na porcie 3000) zawiera w nagłówkach `X-CSRF-Token`, natomiast atak zostaje zablokowany (błąd 403) z powodu braku tego tokena w żądaniu hakera.

### Zadanie 3

**Verifying Origin & Referer**

Wykorzystaj nagłówki HTTP przesyłane przez przeglądarkę do sprawdzenia, czy żądanie faktycznie zostało zainicjowane z naszej domeny. W `app.post('/update-email', (req, res)` dodaj sprawdzanie Originu.
<details>
<summary>Rozwiązanie</summary>
  
Dodaj do `app.post('/update-email', (req, res)` porównanie originu 
Podpowiedź: `req.get('Origin')` porównaj ze swoim adresem serwera np. `http://localhost:3000`

</details> 





### Zadanie 4

**Content-Type Enforcement**
Sprawdź, czy w nagłówkach żądania pojawiło się `application/json` 
<details>
<summary>Rozwiązanie</summary>

Zmodyfikuj `app.post('/update-email', (req, res)`, aby serwer zwracał błąd HTTP 400 w przypadku `req.get('Content-Type')` innego niż `'application/json'`.


</details>

### Po czym rozpoznać prawidłowe rozwiązanie?
Poprawne rozwiązanie rozpoznasz po tym, że serwer zwraca błąd 400 dla ataku wysyłanego przez zwykły formularz HTML (typ `application/x-www-form-urlencoded`), wymagając nagłówka `Content-Type: application/json`.

