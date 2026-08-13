# AURORA OS — Podręcznik użytkownika

Wszystko, czego potrzebujesz, aby żyć wewnątrz OS: nawigacja po pulpicie,
skróty, osiem aplikacji i kompletna referencja komend shella.

## Nawigacja po pulpicie

| Element | Jak używać |
|---|---|
| **Ikony pulpitu** | Pojedyncze kliknięcie zaznacza, podwójne uruchamia |
| **Menu start (◈)** | Kliknij przycisk start; siatka wszystkich aplikacji; Blokada i Restart w stopce |
| **Taskbar** | Jeden przycisk na uruchomioną aplikację; kliknięcie przełącza minimize/restore; aktywna aplikacja jest podświetlona |
| **Prawy klik na pulpicie** | Menu kontekstowe: Otwórz Terminal, Nowy folder…, Nowy plik…, Zmień tapetę, Zablokuj ekran, Restart |
| **Podwójny klik na tapetę** | Otwiera Terminal |
| **📶 ikona tray** | Wirtualny popup statusu sieci (AuroraNet) |
| **Ctrl+Alt+L** | Zablokuj system; kliknij lub naciśnij dowolny klawisz, aby odblokować |

## Skróty klawiaturowe

| Klawisze | Akcja |
|---|---|
| `Ctrl+Alt+L` | Ekran blokady |
| `Escape` | Zamknij menu start / menu kontekstowe |
| `Ctrl+S` (w Edytorze) | Zapisz bieżący plik |
| `Ctrl+L` (w Terminalu) | Wyczyść ekran terminala |
| `Ctrl+C` (w Terminalu) | Anuluj bieżącą linię wejścia |
| `↑` / `↓` (w Terminalu) | Historia komend |
| `Tab` (w Terminalu) | Uzupełnianie ścieżek |

## Aplikacje

| Aplikacja | Ikona | Co robi |
|---|---|---|
| **Pliki** | 📁 | Graficzny menedżer plików — breadcrumbs, wejście ścieżki, nowy plik/folder, odświeżanie, nawigacja w górę; dwuklik otwiera pliki w Edytorze |
| **Terminal** | ⌨️ | Shell — pełna referencja komend poniżej |
| **Edytor** | 📝 | Edytor tekstu z Otwórz / Zapisz i Ctrl+S; przyjmuje ścieżkę jako argument (`open editor /path/file.txt`) |
| **Kalkulator** | 🧮 | Kalkulator wyrażeń — operatory `+ − × ÷`, nawiasy, limit 30 znaków, obsługa błędów |
| **Paint** | 🎨 | Rysowanie canvas — paleta 12 kolorów, rozmiar pędzla 1–24 px, gumka, Wyczyść, eksport PNG |
| **Monitor systemu** | 📊 | Wykresy CPU i pamięci na żywo, tabela procesów z CPU/mem per proces, statystyki sesji |
| **Ustawienia** | ⚙️ | 5 motywów, 5 tapet, przełącznik dźwięku, zegar 12/24-godzinny |
| **O programie** | ◈ | Wersja, uptime sesji na żywo, statystyki podsystemów, siatka funkcji |

## Shell — kompletna referencja komend

Shell AURORA (`aurora-sh`) oferuje **37 komend**. Wpisz `help` w terminalu,
aby zobaczyć tę samą listę, lub `man &lt;command&gt;` dla wpisu manuala.

### Pliki i katalogi

| Komenda | Użycie | Opis |
|---|---|---|
| `ls` | `ls [path]` | Wypisz zawartość katalogu (katalogi na cyjanowo) |
| `ll` | `ll [path]` | Długie wypisanie z typem i czytelnymi rozmiarami |
| `cd` | `cd &lt;path&gt;` | Zmień katalog (domyślnie home) |
| `pwd` | `pwd` | Wypisz katalog roboczy |
| `tree` | `tree [path] [depth]` | Rekursywne drzewo katalogów |
| `mkdir` | `mkdir [-p] &lt;dir&gt;` | Utwórz katalog (`-p` tworzy rodziców) |
| `rm` | `rm [-r] &lt;path&gt;` | Usuń plik (`-r` dla katalogów) |
| `cp` | `cp &lt;src&gt; &lt;dst&gt;` | Skopiuj plik lub katalog (rekurencyjnie) |
| `mv` | `mv &lt;src&gt; &lt;dst&gt;` | Przenieś lub zmień nazwę |

### Czytanie i pisanie

| Komenda | Użycie | Opis |
|---|---|---|
| `cat` | `cat &lt;file&gt;...` | Skonkatenuj pliki do stdout |
| `echo` | `echo &lt;text&gt;` | Wypisz tekst (wspiera argumenty `"cytowane"`) |
| `touch` | `touch &lt;file&gt;` | Utwórz pusty plik |
| `head` | `head [-n N] &lt;file&gt;` | Pierwsze N linii (domyślnie 10) |
| `tail` | `tail [-n N] &lt;file&gt;` | Ostatnie N linii (domyślnie 10) |
| `wc` | `wc &lt;file&gt;` | Policz linie, słowa i znaki |
| `grep` | `grep &lt;pattern&gt; &lt;file&gt;` | Szukaj wzorca w pliku |

### Przekierowanie

| Przykład | Efekt |
|---|---|
| `echo hello > out.txt` | Zapisz wyjście do pliku (nadpisz) |
| `ls > listing.txt` | Przekieruj wyjście dowolnej komendy |
| `echo more >> out.txt` | Dopisz wyjście do pliku |

### Informacje o systemie

| Komenda | Użycie | Opis |
|---|---|---|
| `date` | `date` | Bieżąca data i czas |
| `whoami` | `whoami` | Wypisz bieżącego użytkownika (`user`) |
| `hostname` | `hostname` | Wypisz nazwę maszyny (`aurora`) |
| `uname` | `uname [-a]` | Informacje o jądrze / systemie |
| `uptime` | `uptime` | Czas od bootu |
| `neofetch` | `neofetch` | Baner systemu z logo |
| `df` | `df` | Użycie systemu plików na wirtualnym dysku |
| `du` | `du &lt;path&gt;` | Użycie dysku przez ścieżkę |
| `version` | `version` | Wersje OS, jądra, shella i menedżera okien |

### Procesy i aplikacje

| Komenda | Użycie | Opis |
|---|---|---|
| `ps` | `ps` | Tabela działających procesów (PID, CPU, pamięć) |
| `kill` | `kill &lt;pid&gt;` | Zakończ proces po PID |
| `open` | `open &lt;app&gt; [args]` | Uruchom aplikację (np. `open editor file.txt`) |
| `apps` | `apps` | Wypisz zainstalowane aplikacje z kategoriami |

### Wygody shella

| Komenda | Użycie | Opis |
|---|---|---|
| `help` | `help [command]` | Wypisz komendy lub pokaż pomoc dla jednej |
| `man` | `man &lt;command&gt;` | Wpis manuala dla komendy |
| `history` | `history` | Pokaż historię komend |
| `clear` | `clear` | Wyczyść ekran |
| `exit` | `exit` | Zamknij terminal |
| `sudo` | `sudo &lt;command&gt;` | Wykonaj jako root — już nim jesteś |
| `shutdown` | `shutdown` | Zrestartuj AURORA OS |
| `fortune` | `fortune` | Losowy cytat |

## Wskazówki

- **Tab** uzupełnia ścieżki; wpisz prefiks i naciśnij Tab. Wiele trafień
  jest wypisywanych inline.
- **↑/↓** przewijają historię komend; `history` pokazuje ponumerowaną listę.
- **Przekierowanie** działa z dowolną komendą, nie tylko `echo`.
- Pliki utworzone w terminalu pojawiają się natychmiast w aplikacji
  **Pliki** — system plików rozgłasza `fs:changed` przez EventBus.
- System plików trwa między przeładowaniami strony (localStorage). Używaj
  `rm -r` ostrożnie — `EPERM` chroni katalog główny.

## Rozwiązywanie problemów

| Objaw | Fix |
|---|---|
| Brak dźwięku | Dźwięk wymaga pierwszej interakcji użytkownika (polityka autoplay) — kliknij gdziekolwiek, potem sprawdź Ustawienia → Zachowanie → Dźwięk |
| Brak plików po przeładowaniu | Otwórz Ustawienia → zmiana motywu przeładowuje czysto; jeśli pamięć została wyczyszczona, obraz zasiewu przywraca się automatycznie |
| Terminal nie jest focusowany | Kliknij wewnątrz terminala; aplikacja focusuje się sama przy otwarciu |
| Okna poza ekranem | Okna kaskadują i przywierają do viewportu; maximize (□) resetuje geometrię |

---

*Wróć do [Przeglądu](/projects/aurora-os/) · [Architektury](architecture)*
