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

## Level path

- [x] Path grouped into Beginner, Intermediate and Advanced (`STAGES` in `conjuga.html`). Beginner covers the everyday tenses (present, near future, present perfect, preterite) with regular verbs and everyday irregulars. Stem changes start in Intermediate. Only the current stage opens by default, the current level is marked, and Today's set and Verb of the day follow the path. All 35 earlier levels kept, plus a new near future level. Saved progress carries over.

## Ideas from other language apps

Compared against Duolingo, Babbel, Anki, Memrise, Busuu and Conjuguemos on 2026-11-07. Ordered by how much each would help. Left out on purpose: hearts or lives, leagues, AI chat partners and push reminders.

### Tier 1: biggest gains

- [x] **Backup and restore.** Done (see "Offline app on Android" below).
- [ ] **Listening / dictation mode.** The app speaks a form or a short sentence with the existing `speak()` (speech synthesis, works offline with the phone's Spanish voice) and the learner types what they heard. Today every question is read, never heard, so the ear never gets trained. Start with single forms ("hablaron"), then the sentence bank with the verb blanked. Needs a fallback message when no Spanish voice is installed.
- [ ] **English to Spanish production.** Show the English ("they had eaten", "we will go") and ask for the Spanish form, without naming the tense or person. Current questions hand over the verb, tense and person, so the learner never has to choose the tense themselves, which is the hard part in real speech. `english(v,t,i)` already builds the English, so this is mostly a new question kind.
- [ ] **Recognition drill.** The reverse of the normal quiz: show a form ("tuviéramos") and ask which verb, tense and person it is (multiple choice per part). Reading real Spanish starts with recognising forms, not producing them. `formIndex` already maps a form back to its verb, and the loop in `diagnose()` finds its tense and person. Must allow every valid answer where a form is shared (e.g. yo and él in the imperfecto).
- [ ] **Pretérito vs. imperfecto drill.** Sentences where the learner picks or types the right past tense from context ("Cuando ___ (ser) niño, ___ (vivir) en Madrid"), with a one-line reason on each answer. This is the single most common sticking point for learners and the app only teaches it as a tip card. Could extend the sentence bank with tagged pairs; the same pattern later works for indicative vs. subjunctive and ser vs. estar.
- [ ] **Real spaced repetition.** Smart review (`S.miss`) is a list of missed forms that leave after two right answers, and never come back. Replace or extend it with per-form intervals (e.g. 1, 3, 7, 16, 35 days, reset on a miss, in the style of Anki/SM-2) so forms already learned resurface just before they are forgotten. Show "N due today" on the Practice tab. Keep stored data small: only forms that have been answered.
- [ ] **Home-screen shortcuts.** Add `shortcuts` to `manifest.webmanifest` (e.g. "Today's set", "Smart review", "Verb of the day") so a long press on the Android icon jumps straight in. Needs a URL hash or query the app reads at start-up to open that screen. Small job, makes the app feel native.

### Tier 2: worth doing

- [ ] **Speed tracking and blitz rounds.** Record how long each answer takes and show a median per tense on Progress. Add a 60-second blitz: as many correct forms as possible, with a personal best. Fluency is speed as well as accuracy, and right-but-slow forms are not yet automatic.
- [ ] **Mistake patterns.** `diagnose()` already labels each wrong answer ("Right verb, wrong tense", "Right tense, wrong person", missing stem change, etc.) but the label is shown once and thrown away. Store counts per label and show the top patterns on Progress ("You often use the present for the pretérito"), with a button to drill that pattern.
- [ ] **Placement test.** A short adaptive test on first launch (or from Settings) that checks a few forms per tense and unlocks the path levels the learner already knows, so people who already know the present tense don't have to grind through it.
- [ ] **Speaking answers (optional).** Answer by voice with the browser's SpeechRecognition API. On Android Chrome this sends audio to Google and needs internet, so it must be off by default, clearly labelled as online-only, and hidden when the API is missing. The rest of the app stays fully offline.
- [ ] **Daily goal setting.** The weekly goal is hard-coded (`GOAL=5` days in `conjuga.html`). Let the learner choose days per week and a daily target (e.g. 1, 2 or 3 sets), shown as a ring or bar on the Practice tab.

### Tier 3: nice to have

- [ ] **Graded stories.** Short texts (5 to 10 sentences) built around one tense, with the verbs blanked or tappable for their tense and person. Gives the forms a context and a reason to read. Fits the Tips or Practice tab; content has to be written and checked against the conjugation engine like the sentence bank.
- [ ] **Voseo setting.** Option to practise vos forms (vos hablás, vos tenés, imperative hablá) for Argentina, Uruguay and Central America. Next to the existing "Include vosotros" setting. Needs vos forms in the engine for the present, imperative and present subjunctive, and sentences to match.
- [ ] **Accent feedback in relaxed mode.** "Check accents" is on/off today: off accepts "hablo" for "habló" silently. Add a note on a correct-but-unaccented answer ("Correct, but it's habló: the accent changes the meaning") so relaxed mode still teaches the accent, without counting it wrong.

## Hints & tips

- [x] Tips tab: 14 expandable cards (SER/ESTAR, POR/PARA, reflexive pronouns, possessives (tables), yo/me/mí/mi (tables), personal a, false friends, small words, verb pairs, preterite/imperfect, subjunctive, grammar traps, pronunciation, Spain vs. Latin America).
- [x] Quiz per tip: "Quiz yourself" button in each card, up to 8 multiple-choice questions with a note on wrong answers. Tip answers do not touch verb stats or Smart review.
- [x] Tip links ("💡 Tip: ...") under the matching tense on the path screen and in the level intro. Tapping one opens the Tips tab with that card open.
- [x] Tip of the day card on the Practice tab, under Verb of the day. Changes daily and opens the tip.
- [x] Tip titles that name a tense follow "Use Spanish tense names" (Pretérito vs. imperfecto, Cuándo usar el subjuntivo).

## Offline app on Android (PWA)

- [x] Conjuga is an installable PWA: `manifest.webmanifest`, icons in `icons/`, a cache-first service worker (`sw.js`) and self-hosted fonts in `fonts/`. No external requests. After the first visit it runs fully offline.
- [x] Progress and settings stay in `localStorage` (key `conjuga-v1`, format unchanged). The app calls `navigator.storage.persist()` so the browser doesn't evict it.
- [x] Backup in Settings: "Save backup file" downloads `conjuga-backup-YYYY-MM-DD.json`; "Restore from file" checks the file, asks before replacing progress, then loads it. The card shows the date of the last backup.

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
