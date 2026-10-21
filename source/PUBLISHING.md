# Publikowanie Czytelni

## Zrodla

- `source/articles.json`: tresc, tytul, slug i data wpisow.
- `source/site_content.json`: wspolna tresc strony i stopki.
- `scripts/build.mjs`: wspolny szablon generujacy strone i wszystkie artykuly.

## Dodawanie wpisu

1. Dodaj jeden obiekt do `source/articles.json`: `approved: true`, unikalne `post` i `slug`, zatwierdzony `title`, rzeczywista data `date` w formacie YYYY-MM-DD oraz tekst w `paragraphs`.
2. Zachowaj tresc autora. Nie dodawaj zdjec, emotikon ani nowych tresci bez zgody.
3. Uruchom `npm run build` i `npm run check`.
4. Zapisz zmiane pliku tresci w galezi `main`. Nie trzeba przesylac wygenerowanych plikow HTML ani stopki przy kazdym poscie.
5. Cloudflare automatycznie uruchamia `node scripts/build.mjs && node scripts/check.mjs`, a potem publikuje katalog `public`. Nieudane kontrole blokuja wdrozenie.
6. Potwierdz powodzenie wdrozenia i sprawdz wpis na `https://przemyslawfolwarski.pl/czytelnia/` oraz jego osobnym adresie. Sam zapis repozytorium nie oznacza publikacji.

Wpisy sa sortowane od najnowszego; generator aktualizuje liste, nawigacje, dane strukturalne i mape strony. Stopka jest generowana ze wspolnego zrodla. Telefon i NIP pozostaja w stopce, numer rachunku zostal usuniety z aktualnego zrodla. Fragmenty stopki poza imieniem i nazwiskiem, zawodem oraz `Warszawa online` maja `data-nosnippet`. Google sam wybiera opis wyniku.

Pliki HTML w repozytorium sa starszymi artefaktami. Wersja publikowana powstaje z aktualnych zrodel podczas wdrozenia. Zmiana danych na stronie nie usuwa historii repozytorium.
