# baiim-csrf-defense
Repozytorium do projektu z przedmiotu

## Instalacja 
1. Pobierz Node.js https://nodejs.org/en/download
2. Uruchom server `node server.js`

## Instrukcja do laboratorium 
To laboratorium polega na zabezpieczeniu pliku server.js zgodnie z wymienionymi metodami podczas prezentacji, składa się z 4 zadań. W razie problemów pod zadaniami ukryte są dokładne kroki jakie trzeba podjąć w celu rozwiązania zadania. 

## Zadania

Sprawdź poprawność każdego wykonanego ćwiczenia przez uruchomienie pliku `attack.html` i jeśli server zwróci błąd Forbidden i w konsoli pojawi się informacja o wykonaniu zadania, to zostało ono wykonane poprawnie.

### Zadanie 1

**Same Site Cookie Hardening**
Zabroń przeglądarce wysyłania ciasteczka sesji kiedy żądanie pochodzi ze strony zewnętrznej (attack.html)


<details>
<summary>Rozwiązanie</summary>
1. Znajdź, gdzie konfigurowana jest sesja w server.js
  
2. Dodaj `sameSite: 'Lax'` do cookie
    
4. Spróbuj ponownie otworzyć plik `attack.html`. Adres e-mail nie powinien się już zmienić
     
</details>

### Zadanie 2

**Synchronizer Token Pattern**
Upewnienie się, że każde żądanie zmieniające stan aplikacji wymaga unikalnego, tajnego tokena, którego atakujący nie jest w stanie odgadnąć ani odczytać.
<details>
<summary>Rozwiązanie</summary>

1. W metodzie `app.get('/')` wygeneruj losowy ciąg znaków i zapisz go w sesji użytkownika jako `req.session.csrfToken`.

2. Przekaż ten token do widoku i umieść go w ukrytym polu formularza HTML `(<input type="hidden">)`.

3. W metodzie `app.post('/update-email')` dodaj logikę porównującą token przesłany w formularzu z tokenem zapisanym w sesji.

4. Jeśli tokeny nie są identyczne lub tokenu brakuje, przerwij operację i zwróć błąd `res.status(403)`.

</details>

### Zadanie 3

**Verifying Origin & Referer**

Wykorzystaj nagłówki HTTP przesyłane przez przeglądarkę do sprawdzenia, czy żądanie faktycznie zostało zainicjowane z naszej domeny. Stwórz funkcję dla tras typu POST.
<details>
<summary>Rozwiązanie</summary>
  
```js
const origin = req.get('Origin');
if (origin !== 'http://localhost:3000') {
  return res.status(403).send("Żądanie Cross-Site zostało zablokowane (Niepoprawny Origin)"); 
}
```

</details> 

### Zadanie 4

**Content-Type Enforcement**
Zmień logikę `server.js` tak, aby oczekiwał wyłącznie danych w formacie JSON 
<details>
<summary>Rozwiązanie</summary>

1. Zmodyfikuj server.js aby zamiast standardowego wysłania formularza używał funkcji `fetch()` z nagłówkiem: `headers: {'Content-Type': 'application/json'}`.

2. Zmodyfikuj server.js, aby sprawdzał, czy nagłówek `req.headers['content-type']` to dokładnie `application/json`.

</details>

