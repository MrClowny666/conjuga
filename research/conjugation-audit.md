# Conjugation audit (2026-11-20)

Checked the engine (`bare()` in `conjuga.html`) against an independent source: Fred Jehle's Spanish verb database (open CSV, used only to compare, nothing copied into the app).

**Compared:** 414 of the app's 576 non-reflexive verbs exist in that database. 21,528 forms across present, preterite, imperfect, future, conditional, present and imperfect subjunctive and both command forms (17,262 without the commands), plus the gerund and participle of each verb.

**Not in that database:** 167 verbs. These were compared with Wiktionary's Spanish conjugation tables (a second, independent source, fetched 2026-11-20 and not stored in the repo): 164 had a table. 7,907 forms across present, preterite, imperfect, future, conditional, present subjunctive, imperfect (-ra) subjunctive, affirmative commands, participle and gerund. Result: 14 differences. 8 are explained below; 6 were a real app bug (fiais, fieis, liais, lieis, piais, pieis: criar, fiar, guiar, liar, piar must not carry a tilde in the vosotros present and subjunctive, because RAE 2010 counts them as one syllable). Fixed. The 5 reflexive verbs among them (arrepentirse, atreverse, preocuparse, quejarse, relajarse) were not compared, because Wiktionary lays out reflexive pages differently and my parser skipped them (three had no table at all; I did not check why the other two produced no rows). Only arrepentirse is irregular (e→ie); it and the others rest on the hand check plus the attached-pronoun accent check.

## What the comparison found and what was done

| Finding | Verdict | Action |
|---|---|---|
| predecir future and conditional were prediré/prediría (12 forms) | Both are valid; the DPD marks the regular predeciré as the usual one today | Main form now predeciré; prediré accepted as an alternative (`ALT`) |
| llover, nevar, doler, ocurrir had a full paradigm (yo lluevo ...) | Third person only (weather verbs singular only); the database leaves the other slots empty | Other persons removed in `bare()`; no commands for these |
| haber had a command form | None exists | Removed |
| imprimir participle: impreso only | The database lists imprimido and impreso | imprimido accepted (`ALT`) |
| criar crie / freír frio / reír riais / fiar fie | Database uses the older tilde (crié, frió, riáis). Conjuga follows the 2010 RAE rule: forms that count as one syllable carry no tilde | Kept as is; typing the old accent is still accepted in the default (non-strict) setting |
| ir: vamos vs vayamos for "let's go" | Both correct; vamos is the usual one | Kept |
| ser no seáis, soñar soñemos, graduar graduéis, tropezar tropecéis, invertir invirtiéramos | The database is wrong (missing accent / letter) and the app is right | None |

Wiktionary differences judged not to be app errors: haber `hay` vs `ha` (impersonal vs auxiliary), haber commands (literary, deliberately absent), rehacer rehíce/rehízo (Wiktionary is wrong: monosyllable-derived llana forms take no tilde).

## Answer variants now accepted
-se imperfect and pluperfect subjunctive (hablase, hubiese hablado); participle doublets freído, electo, imprimido (alone or combined with -se); prediré/prediría.

## Defective verbs
Third person only: doler, llover, nevar, ocurrir, suceder, gustar, faltar, importar, molestar. Soler has no preterite, future, conditional, commands or compound-future forms.

## Still unverified
- Attached-pronoun commands: the accent rule was checked with an independent rule implementation (200 reflexive commands, 40 gerunds, 0 mismatches). Only reflexive pronouns are generated; object pronouns (dámelo) are not generated at all.
- Voseo (tenés, sos, vení) is not supported.
- Verbs that follow the tilde rule above are checked by logic and Wiktionary, not by the RAE tables directly.
