# TODO

## Settings

- [x] Theme setting on the Settings screen: System (default), Light, Dark. In the app since the merge.
- [x] Maybe three more themes (to be designed). Added Sunset (warm light), Ocean (dark teal) and Contrast (black and yellow) as a swatch grid in Settings.
- [x] Settings moved out of the Progress tab into their own full-screen sheet, opened by the gear button in the top bar. Every setting kept, plus Reset all progress.
- [x] "Use Spanish tense names" takes effect straight away, including on the screen under the Settings sheet.
- [x] Tense names inside sentences use the short form ("5 questions · pretérito irregulars" / "preterite irregulars"). Same fix for Verb of the day, Weakest, quiz feedback and Conjugation steps.

## Merge the prototype into the app

Decided 2026-11-07: `conjuga.html` is the one app. The prototype's design and features were merged into it. Rule: never drop a feature unless that is decided explicitly.

- [x] Prototype colours, light and dark themes, pill buttons, rounded cards and bottom-bar style applied to the app.
- [x] Theme setting (System, Light, Dark) added to the app's settings.
- [x] Practice tab: Today's set (5 pretérito irregulars), Sentences, Verb of the day, then the custom quiz and Smart review.
- [x] Progress: accuracy by tense and person, tap a cell to practise it, and a "Weakest" shortcut. Uses real answers, not example data.
- [x] Light vibration on each answer, where the phone supports it.
- [x] Old prototype file (`mockups/conjuga-prototype.html`) and its artifact kept for reference only. No new work goes into them.

## Practice modes

- [x] Sentence quiz: fill the missing verb in a short Spanish sentence (English translation underneath), 5-question set and a 10-question level-up test (pass mark 8) on the Practice tab.
- [x] Grow the sentence bank: now 846 sentences (was 24) across all 16 tenses, 9 for every tense and person (5 persons for commands). Every sentence is tagged with its person and every answer is checked against the conjugation engine. Sentence answers now count towards the Progress grid and Accuracy by tense. Vosotros sentences are skipped when vosotros is turned off.
- [x] Meaning questions accept true synonyms (e.g. arreglar/reparar, empezar/comenzar/iniciar). A SYN list in `conjuga.html` adds pairs the English glosses don't show; one-way pairs (pensar > creer) only work in one direction. Multiple-choice options never include a second correct answer.

## Hints & tips

- [x] Tips tab: 14 expandable cards (SER/ESTAR, POR/PARA, reflexive pronouns, possessives (tables), yo/me/mí/mi (tables), personal a, false friends, small words, verb pairs, preterite/imperfect, subjunctive, grammar traps, pronunciation, Spain vs. Latin America).
- [x] Quiz per tip: "Quiz yourself" button in each card, up to 8 multiple-choice questions with a note on wrong answers. Tip answers do not touch verb stats or Smart review.
- [x] Tip links ("💡 Tip: ...") under the matching tense on the path screen and in the level intro. Tapping one opens the Tips tab with that card open.
- [x] Tip of the day card on the Practice tab, under Verb of the day. Changes daily and opens the tip.
- [x] Tip titles that name a tense follow "Use Spanish tense names" (Pretérito vs. imperfecto, Cuándo usar el subjuntivo).

## Offline app on Android (PWA)

- [x] Conjuga is an installable PWA: `manifest.webmanifest`, icons in `icons/`, a cache-first service worker (`sw.js`) and self-hosted fonts in `fonts/`. No external requests. After the first visit it runs fully offline.
- [x] Progress and settings stay in `localStorage` (key `conjuga-v1`, format unchanged). The app calls `navigator.storage.persist()` so the browser doesn't evict it.

### Hosting on GitHub Pages

1. Push the repo to GitHub.
2. Settings → Pages → Build and deployment → Source: "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
3. After a minute the app is at `https://<user>.github.io/<repo>/conjuga.html`. It must be HTTPS (Pages is), or the service worker won't run.

### Installing on Android

1. Open that URL in Chrome on the phone (needs internet this once).
2. Chrome menu (⋮) → "Add to Home screen" → "Install" (or "Install app" if Chrome shows it).
3. Open Conjuga from the home screen. From now on it works without internet.

### Releasing an update

Change `VERSION` in `sw.js` (e.g. `conjuga-v2`) whenever any app file changes, then push. The phone picks up the new version the next time the app is opened online, and uses it from the launch after that. Progress is kept.
