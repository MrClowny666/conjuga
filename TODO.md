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
- [x] Grow the sentence bank: now 400 sentences (was 24) across all 16 tenses. The seven level-path tenses and affirmative commands have 6 to 8 per person; the other eight tenses have 2 per person. Every sentence is tagged with its person and every answer is checked against the conjugation engine. Sentence answers now count towards the Progress grid and Accuracy by tense. Vosotros sentences are skipped when vosotros is turned off.
