# Systemy gry

Novactorio odtwarza w przeglądarce pętlę automatyzacji fabryk: zbieraj
surowce, buduj maszyny, transportuj materiały, badaj i przetrwaj.

## Główna pętla

1. **Wydobywaj** surowe zasoby z proceduralnie generowanego świata.
2. **Buduj** maszyny, taśmy, rury i inserters, aby zautomatyzować produkcję.
3. **Badaj** ulepszenia w drzewie badań.
4. **Rozbudowuj się** — zanieczyszczenie przyciąga i ewoluuje wrogów.
5. **Co-op** — dziel fabrykę ze znajomymi w czasie rzeczywistym.

## Łańcuchy dostaw i logistyka

`systems.ts` implementuje symulację przepływu materiałów:

- **Taśmociągi** — przedmioty poruszają się po taśmach i łączą/rozdzielają
  na skrzyżowaniach.
- **Inserters** — przenoszą przedmioty między taśmami, pojemnikami
  i maszynami.
- **Sieci rur** — płyny i materiały płyną przez połączone rury.
- **Łańcuchy dostaw** — przepisy konsumują wejścia i produkują wyjścia;
  maszyny pauzują, gdy zabraknie wejść.

## Generacja świata

- **Chunkowy** nieskończony świat (`world.ts`).
- **Teren szumem Perlina** (`noise.ts`) z płynną zmiennością wysokości.
- **Płynne przewijanie** — chunki generują się i wyładowują wokół gracza.

## Walka i ewolucja

- **AI wrogów** — wrogowie spawnują się, podążają w stronę
  zanieczyszczenia/fabryki i atakują.
- **Zanieczyszczenie** — produkcja emituje zanieczyszczenie; wyższe
  zanieczyszczenie napędza szybszą ewolucję wrogów (z czasem więksi
  i twardsi).
- Zanieczyszczenie jest wizualizowane w grze przez moduł renderowania
  `PollutionOverlay`.

## Walka i interakcje

- **Buduj / usuwaj** bloki i maszyny z menu budowania.
- **Inventory** per gracz z dostępem w stylu hotbara.
- **Cząsteczki i liczby obrażeń** dla satysfakcjonującego feedbacku
  (`renderer.ts`).

## Systemy wizualne i otoczenia (`src/render/`)

| Moduł | Efekt w grze |
|---|---|
| `AmbientAtmosphere.ts` | Gradacja nieba i atmosfery |
| `ParticleEffects.ts` | Dym, iskry, cząsteczki eksplozji |
| `PollutionOverlay.ts` | Smog zanieczyszczenia nad zanieczyszczonymi obszarami |
| `ScreenEffects.ts` | Feedback przestrzeni ekranu (flash, winieta) |
| `SpriteManager.ts` | Wydajne renderowanie atlasu sprite'ów |
| `WeatherSystem.ts` | Dynamiczne warunki pogodowe |

## Audio

`audio.ts` zapewnia proceduralne efekty dźwiękowe powiązane ze zdarzeniami
gry — budowanie, wydobycie, walka i ambient.

## Post-processing

`postproc.ts` nakłada efekty post-processingu na bazowy render canvas dla
dopracowania wizualnego.

## Multiplayer co-op

Supabase Realtime rozgłasza:

- Pozycje graczy (synchronizacja ruchu)
- Akcje budowania (place / remove)
- Wiadomości czatu (`ChatPanel`)

Każdy klient uruchamia deterministyczną symulację lokalnie; zdarzenia
realtime utrzymują wspólny stan między graczami.

## Handel

Gracze mogą handlować ze sobą; transakcje są zabezpieczone checkoutem
z opłatą obsługiwanym przez `trade-fee-checkout` i rozliczanym przez
`trade-webhook` (Edge Functions).

## Funkcje premium

Poziom premium (Stripe) odblokowuje dodatkową zawartość. Zobacz
[Backend i monetyzacja](./backend.md), aby poznać przepływ płatności.

## Sterowanie i UI

- Responsywne UI działa na desktopie i mobile (dotyk).
- 23 języki przez przełączanie i18n w runtime.
