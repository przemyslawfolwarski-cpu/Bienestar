# Dane strukturalne Bienestar

Zakres zatwierdzony 20.10.2026: osobne opracowanie danych dla wyszukiwarek, bez zmian widocznego projektu i tekstów.

## Model

- Wspólne, stabilne identyfikatory na domenie przemyslawfolwarski.pl: Person (#person) i WebSite (#website).
- Strona główna: WebPage z mainEntity wskazującym osobę. Nie opisujemy działalności jako przychodni, lekarza ani gabinetu z niepotwierdzonym adresem.
- Czytelnia: CollectionPage i ItemList, dokładnie 9 zatwierdzonych tytułów, adresów i ich obecna kolejność.
- Każdy wpis: WebPage i BlogPosting. Autor oraz wydawca wskazują tę samą osobę, tytuł i pełny tekst pochodzą z articles.json, datePublished zachowuje datę oryginalnego postu widoczną na stronie. Nie znamy godziny publikacji, więc jej nie wymyślamy.
- 404 pozostaje noindex i nie otrzymuje danych opisujących prawdziwy artykuł.

## Źródła i ograniczenia

site_content.json i articles.json pozostają źródłem treści. Nazwa, zawód Psycholog oraz oryginalne zdjęcie osoby pochodzą z istniejącej strony. Nie dodajemy adresu gabinetu, e-maila, ocen, opinii, certyfikatów, stopnia naukowego ani tytułu psychoterapeuty. Nie dodajemy dateModified, gdyż nie ma zatwierdzonych dat modyfikacji artykułów.

Artykuły nie otrzymują wymyślonej ilustracji. Zdjęcie osoby jest przypisane do osoby, nie do wpisu. Brak opcjonalnego image w BlogPosting jest świadomy i może ograniczać prezentację wizualną w wynikach Google. Nie oznacza blokady indeksowania.

JSON-LD jest zapisany w początkowym HTML, bez JavaScriptu uruchamianego po stronie czytelnika, z bezpiecznym kodowaniem znaków HTML. Dane nie zmieniają treści, wyglądu ani działania strony i nie dodają śledzenia.

## Weryfikacja

1. node scripts/build.mjs
2. node scripts/check.mjs: dokładna zgodność zatwierdzonych tekstów, chronione sumy plików zdjęcia i QR, identyczna stopka.
3. node scripts/check-structured-data.mjs: wszystkie 11 stron kanonicznych, składnia JSON, tożsamość autora, daty, pełne treści, kolejność listy, brak wymyślonych pól i wyłączenie 404.
4. Porównanie widocznego body każdej z 12 stron przed/po: identyczne.
5. Po publikacji kontrola rzeczywistego HTML na głównej domenie i Google Rich Results Test dla wpisu.

Dokumentacja: https://developers.google.com/search/docs/appearance/structured-data/article oraz https://developers.google.com/search/docs/appearance/structured-data/sd-policies

Dane pomagają wyszukiwarce rozumieć stronę. Nie gwarantują pozycji, indeksacji ani konkretnego wyglądu wyniku.

## Ikonka

Favicon jest osobną, zatwierdzoną zmianą. Litera B została wycięta z obecnego wordmarku. ICO 16/32/48 px oraz PNG 192 i apple-touch-icon 180 px są podłączone na wszystkich podstronach. Oryginalny wordmark i zdjęcie pozostają nietknięte.

## Wynik kontroli opublikowanej wersji, 20.10.2026

Google Rich Results Test: https://search.google.com/test/rich-results/result?id=9TCsepbkwCLGv56lyGUoBg . Wpis Trigger ma 1 prawidłowy element Article/BlogPosting i 3 niekrytyczne zalecenia: brak opcjonalnego image oraz pełnej godziny/strefy czasowej datePublished. Schema.org dopuszcza Date lub DateTime (https://schema.org/datePublished), ale test Google oczekuje pełnego DateTime. Zachowujemy znaną datę, bez wymyślania godziny. Nie dodajemy przypadkowych ilustracji do zatwierdzonych wpisów.

Sprawdzono HTTP 200 i JSON-LD na wszystkich 11 stronach głównej domeny, poprawne typy plików ikon. Search Console potwierdza indeksowanie strony głównej, Czytelni i sprawdzonego przykładowo wpisu Trigger. Mapa witryny ma stan Sukces i 11 wykrytych adresów; nie jest to dowód indeksacji wszystkich 11 adresów. Pełny raport zbiorczy Google nadal przetwarza dane.

