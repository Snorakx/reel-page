# Konfiguracja EmailJS dla Kalkulatora Projektowego

## Krok 1: Utwórz konto EmailJS

1. Przejdź na https://www.emailjs.com/
2. Zarejestruj się (darmowe konto pozwala na 200 maili/miesiąc)
3. Zweryfikuj email

## Krok 2: Dodaj Email Service

1. W dashboardzie kliknij "Add New Service"
2. Wybierz "Gmail" lub inny serwis email
3. Podaj dane do autoryzacji (dla Gmail - email i hasło aplikacji)
4. Zapisz **Service ID** (np. `service_coderno`)

## Krok 3: Utwórz Email Template

1. Kliknij "Create New Template"
2. Wklej poniższy template:

```
Nowe zapytanie z Kalkulatora Projektowego

Dane kontaktowe:
- Imię: {{first_name}}
- Email: {{email}}
- Telefon: {{phone}}

Projekt:
- Typ: {{project_type}}
- Całkowity koszt: {{total_cost}}
- Data: {{timestamp}}

Wybrane dodatki:
{{addons}}

Uwagi:
{{notes}}

---
Automatyczna wiadomość z kalkulatora projektowego Coderno
```

3. Zapisz **Template ID** (np. `template_calculator`)

## Krok 4: Pobierz Public Key

1. Przejdź do "Account" -> "General"
2. Skopiuj **Public Key**

## Krok 5: Skonfiguruj zmienne środowiskowe

1. Skopiuj `env.example` do `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Otwórz `.env.local` i wpisz prawdziwe wartości z EmailJS:
   ```bash
   PUBLIC_EMAILJS_SERVICE_ID=service_coderno
   PUBLIC_EMAILJS_TEMPLATE_ID=template_calculator
   PUBLIC_EMAILJS_PUBLIC_KEY=user_xxxxxxxxxx
   PUBLIC_CONTACT_EMAIL=kontakt@coderno.pl
   ```

3. Zapisz plik (będzie automatycznie ignorowany przez Git)

## Krok 6: Testuj

1. Restartuj serwer deweloperski (aby załadować nowe zmienne środowiskowe):
   ```bash
   npm run dev
   ```

2. Wypełnij kalkulator
3. Sprawdź czy mail dotarł na `kontakt@coderno.pl`

## Możliwe błędy

- **"EmailJS configuration is not set up properly"** - sprawdź czy plik `.env.local` istnieje i zawiera wszystkie wymagane zmienne
- **"Service unavailable"** - sprawdź czy Service ID i Template ID są prawidłowe
- **"Invalid public key"** - sprawdź czy Public Key jest prawidłowy

## Bezpieczeństwo

- Public Key może być widoczny w kodzie (nie zawiera poufnych danych)
- EmailJS automatycznie zabezpiecza przed spamem
- Można ustawić rate limiting w dashboardzie EmailJS

## Alternatywne rozwiązania

Jeśli EmailJS nie spełnia wymagań, można użyć:
- Formspree.io
- Netlify Forms
- Getform.io
- Własny backend z Express.js + Nodemailer 