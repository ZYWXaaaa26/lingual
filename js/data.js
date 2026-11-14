'use strict';
/* Contenu pédagogique : conjugaison, grammaire, situations, alphabet.
   Format des formes : "a|b" = deux réponses acceptées ; "mach(e)" = avec ou sans -e. */
var D = {};
var P = {
  es: ['yo', 'tú', 'él / ella', 'nosotros', 'vosotros', 'ellos / ellas'],
  de: ['ich', 'du', 'er / sie / es', 'wir', 'ihr', 'sie / Sie'],
  en: ['I', 'you', 'he / she / it', 'we', 'you (pl.)', 'they'],
  ru: ['я', 'ты', 'он / она', 'мы', 'вы', 'они']
};
function mkTenses(list, rowsMap, def) {
  return list.map(function (t) {
    return { k: t[0], fr: t[1], sub: t[2], tip: t[3], rows: rowsMap[t[0]] || def };
  });
}

/* ================= ESPAGNOL (A2) ================= */
(function () {
  var F = function (s) { return ['é', 'ás', 'á', 'emos', 'éis', 'án'].map(function (e) { return s + e; }); };
  var C = function (s) { return ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'].map(function (e) { return s + e; }); };
  var Pf = function (pp) { return ['he', 'has', 'ha', 'hemos', 'habéis', 'han'].map(function (a) { return a + ' ' + pp; }); };
  function V(inf, fr, pres, past, pp, stem, imp) {
    return { inf: inf, fr: fr, t: { pres: pres, past: past, perf: Pf(pp), fut: F(stem), cond: C(stem), imp: imp } };
  }
  var serPast = ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'];
  D.es = {
    verbs: [
      V('hablar', 'parler', ['hablo', 'hablas', 'habla', 'hablamos', 'habláis', 'hablan'], ['hablé', 'hablaste', 'habló', 'hablamos', 'hablasteis', 'hablaron'], 'hablado', 'hablar', ['habla', 'hable', 'hablemos', 'hablad', 'hablen']),
      V('comer', 'manger', ['como', 'comes', 'come', 'comemos', 'coméis', 'comen'], ['comí', 'comiste', 'comió', 'comimos', 'comisteis', 'comieron'], 'comido', 'comer', ['come', 'coma', 'comamos', 'comed', 'coman']),
      V('vivir', 'vivre, habiter', ['vivo', 'vives', 'vive', 'vivimos', 'vivís', 'viven'], ['viví', 'viviste', 'vivió', 'vivimos', 'vivisteis', 'vivieron'], 'vivido', 'vivir', ['vive', 'viva', 'vivamos', 'vivid', 'vivan']),
      V('ser', 'être (identité)', ['soy', 'eres', 'es', 'somos', 'sois', 'son'], serPast, 'sido', 'ser', ['sé', 'sea', 'seamos', 'sed', 'sean']),
      V('estar', 'être (lieu, état)', ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'], ['estuve', 'estuviste', 'estuvo', 'estuvimos', 'estuvisteis', 'estuvieron'], 'estado', 'estar', ['está', 'esté', 'estemos', 'estad', 'estén']),
      V('ir', 'aller', ['voy', 'vas', 'va', 'vamos', 'vais', 'van'], serPast, 'ido', 'ir', ['ve', 'vaya', 'vayamos|vamos', 'id', 'vayan']),
      V('tener', 'avoir', ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen'], ['tuve', 'tuviste', 'tuvo', 'tuvimos', 'tuvisteis', 'tuvieron'], 'tenido', 'tendr', ['ten', 'tenga', 'tengamos', 'tened', 'tengan']),
      V('hacer', 'faire', ['hago', 'haces', 'hace', 'hacemos', 'hacéis', 'hacen'], ['hice', 'hiciste', 'hizo', 'hicimos', 'hicisteis', 'hicieron'], 'hecho', 'har', ['haz', 'haga', 'hagamos', 'haced', 'hagan']),
      V('querer', 'vouloir, aimer', ['quiero', 'quieres', 'quiere', 'queremos', 'queréis', 'quieren'], ['quise', 'quisiste', 'quiso', 'quisimos', 'quisisteis', 'quisieron'], 'querido', 'querr', ['quiere', 'quiera', 'queramos', 'quered', 'quieran']),
      V('poder', 'pouvoir', ['puedo', 'puedes', 'puede', 'podemos', 'podéis', 'pueden'], ['pude', 'pudiste', 'pudo', 'pudimos', 'pudisteis', 'pudieron'], 'podido', 'podr', ['puede', 'pueda', 'podamos', 'poded', 'puedan'])
    ],
    tenses: mkTenses([
      ['pres', 'Présent', 'presente', 'Les verbes irréguliers (ser, estar, ir, tener, hacer, querer, poder) sont à connaître par cœur : ce sont les plus fréquents.'],
      ['past', 'Passé simple', 'indefinido', 'Pour une action terminée à un moment précis (ayer, el año pasado). Ser et ir ont exactement la même forme.'],
      ['perf', 'Passé composé', 'perfecto', 'haber au présent + participe passé. Pour une période non terminée : hoy, esta semana, este año (en Espagne).'],
      ['fut', 'Futur', 'futuro', 'Infinitif + é, ás, á, emos, éis, án. Radicaux irréguliers : tendr-, har-, querr-, podr-.'],
      ['cond', 'Conditionnel', 'condicional', 'Même radical que le futur + ía, ías, ía, íamos, íais, ían. Sert à la politesse : querría un café.'],
      ['imp', 'Impératif', 'imperativo', 'Affirmatif tú = 3e personne du présent (habla). usted, nosotros et ustedes viennent du subjonctif. Négatif : no hables.']
    ], { imp: ['tú', 'usted', 'nosotros', 'vosotros', 'ustedes'] }, P.es),
    rules: [
      { title: 'Articles définis et indéfinis', body: '<table class="tbl"><tr><th></th><th>masc.</th><th>fém.</th></tr><tr><th>le / la / les</th><td>el · los</td><td>la · las</td></tr><tr><th>un / une / des</th><td>un · unos</td><td>una · unas</td></tr></table><p>Règle de base : <b>-o</b> = masculin, <b>-a</b> = féminin. Presque toujours féminin : -ción, -sión, -dad, -tud (la estación, la ciudad). Presque toujours masculin : -aje, -or (el viaje, el color).</p><p><b>Exceptions :</b> el día, el mapa, el problema, el tema, el idioma, el sistema, el programa (masculins en -a) ; la mano, la foto, la moto (féminins en -o).</p><p><b>Mots féminins à « a » accentué :</b> el agua fría, el águila. Au pluriel : las aguas. L’adjectif reste féminin.</p><p><b>Contractions :</b> a + el = <b>al</b>, de + el = <b>del</b> (voy al mercado, vengo del trabajo).</p><p>On dit el lunes (lundi), a las tres (à trois heures). Pas d’article devant une profession seule : soy profesor.</p>' },
      { title: 'Ser ou estar ?', body: '<p><b>ser</b> : identité, origine, profession, heure, caractère, matière. <i>Soy francés. Es médica. Son las tres. Ella es simpática.</i></p><p><b>estar</b> : lieu, état temporaire, résultat, action en cours (estar + gérondif). <i>Estoy en casa. La sopa está caliente. Estoy comiendo.</i></p><p>Certains adjectifs changent de sens : es aburrido (il est ennuyeux) / está aburrido (il s’ennuie).</p>' },
      { title: 'Hay ou estar ?', body: '<p><b>hay</b> = il y a, pour introduire quelque chose d’indéfini : <i>Hay un banco en la calle.</i></p><p><b>estar</b> pour situer quelque chose de connu : <i>El banco está en la calle.</i></p><p>Hay ne change jamais : hay un libro, hay tres libros.</p>' },
      { title: 'Gustar et les verbes comme lui', body: '<p>Le verbe s’accorde avec <b>ce qui plaît</b>, pas avec la personne.</p><p><i>Me gusta el café. Me gustan las tapas. ¿Te gusta viajar?</i></p><p>Pronoms : me, te, le, nos, os, les. Même construction : encantar, interesar, doler (me duele la cabeza).</p>' },
      { title: 'Passé : perfecto ou indefinido ?', body: '<p><b>Perfecto</b> (he comido) : période non terminée ou action liée au présent : hoy, esta mañana, esta semana, ya, todavía no.</p><p><b>Indefinido</b> (comí) : moment terminé : ayer, el año pasado, hace dos días, en 2020.</p><p>En Amérique latine, on utilise souvent l’indefinido même pour « aujourd’hui ».</p><p>Participes irréguliers : hecho, dicho, visto, escrito, puesto, vuelto, abierto.</p>' },
      { title: 'Exprimer l’obligation, le futur proche, la capacité', body: '<p><b>ir a + infinitif</b> : Voy a viajar mañana.</p><p><b>tener que + infinitif</b> : Tengo que trabajar.</p><p><b>poder + infinitif</b> : ¿Puedo pagar con tarjeta?</p><p><b>querer + infinitif</b> : Quiero reservar una mesa.</p>' },
      { title: 'Verbes pronominaux', body: '<table class="tbl"><tr><th>levantarse</th><td>me levanto · te levantas · se levanta</td></tr><tr><th></th><td>nos levantamos · os levantáis · se levantan</td></tr></table><p>Le pronom se place avant le verbe conjugué, ou accroché à l’infinitif : voy a levantarme / me voy a levantar.</p>' },
      { title: 'Adjectifs : accord et place', body: '<p>L’adjectif se place en général <b>après</b> le nom et s’accorde : una casa pequeña, unos libros interesantes.</p><p>Devant un nom masculin singulier : bueno → <b>buen</b>, malo → <b>mal</b>, grande → <b>gran</b> : un buen día, un gran problema.</p>' }
    ],
    quiz: [
      ['___ problema es difícil.', ['El', 'La', 'Los', 'Las'], 0, 'Problema est masculin malgré le -a, comme día, mapa, tema.'],
      ['___ mano está fría.', ['El', 'La', 'Los', 'Un'], 1, 'Mano est féminin malgré le -o : la mano.'],
      ['Voy ___ supermercado.', ['a el', 'al', 'a la', 'del'], 1, 'a + el se contracte en al.'],
      ['___ agua está muy fría.', ['La', 'El', 'Las', 'Una'], 1, 'Devant un mot féminin à « a » accentué on dit el agua. L’adjectif reste féminin : fría.'],
      ['Mi hermana ___ médica.', ['es', 'está', 'hay', 'tiene'], 0, 'Une profession se dit avec ser.'],
      ['La sopa ___ caliente.', ['es', 'está', 'hay', 'va'], 1, 'État temporaire ou résultat : estar.'],
      ['Ayer nosotros ___ al cine.', ['vamos', 'fuimos', 'iremos', 'hemos ido'], 1, 'Ayer = moment terminé : indefinido de ir, fuimos.'],
      ['Esta mañana yo ___ un café. (Espagne)', ['tomé', 'he tomado', 'tomaba', 'tomaré'], 1, 'Esta mañana est une période non terminée : pretérito perfecto, he tomado.'],
      ['Mañana yo ___ a Barcelona. (futur simple de ir)', ['iba', 'iré', 'voy', 'fui'], 1, 'Futur : infinitif + é, donc iré.'],
      ['A mí ___ gustan las tapas.', ['me', 'te', 'le', 'se'], 0, 'A mí → me. Gustan s’accorde avec « las tapas » (pluriel).'],
      ['Pour être plus poli : « Yo ___ un café, por favor. »', ['querría', 'quiero', 'quise', 'querré'], 0, 'Le conditionnel adoucit la demande : querría.'],
      ['¡___ más despacio, por favor! (tú, hablar)', ['Habla', 'Hables', 'Hable', 'Hablas'], 0, 'Impératif affirmatif de tú = 3e personne du présent : habla.'],
      ['¿___ una farmacia cerca de aquí?', ['Hay', 'Está', 'Es', 'Tiene'], 0, 'Chose non encore identifiée : hay.'],
      ['Hace un ___ día.', ['bueno', 'buen', 'bien', 'buena'], 1, 'Bueno devient buen devant un nom masculin singulier.'],
      ['Hay ___ libros en la mesa.', ['unos', 'unas', 'un', 'el'], 0, 'Pluriel masculin de un : unos.'],
      ['Mi madre ___ en Madrid.', ['vive', 'vivo', 'viven', 'vivimos'], 0, 'Troisième personne du singulier : vive.']
    ],
    sit: []
  };
})();

/* ================= ALLEMAND (B2, à réactiver) ================= */
(function () {
  var W = ['werde', 'wirst', 'wird', 'werden', 'werdet', 'werden'];
  var Q = ['würde', 'würdest', 'würde', 'würden', 'würdet', 'würden'];
  var H = ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'];
  var S = ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'];
  function V(inf, fr, pres, prat, aux, pp, konj, imp) {
    return { inf: inf, fr: fr, t: {
      pres: pres, prat: prat,
      perf: (aux === 'sein' ? S : H).map(function (a) { return a + ' ' + pp; }),
      fut: W.map(function (w) { return w + ' ' + inf; }),
      konj: konj || Q.map(function (w) { return w + ' ' + inf; }),
      imp: imp
    } };
  }
  D.de = {
    verbs: [
      V('sein', 'être', ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'], ['war', 'warst', 'war', 'waren', 'wart', 'waren'], 'sein', 'gewesen', ['wäre', 'wärst', 'wäre', 'wären', 'wärt', 'wären'], ['sei', 'seid', 'seien Sie']),
      V('haben', 'avoir', ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'], ['hatte', 'hattest', 'hatte', 'hatten', 'hattet', 'hatten'], 'haben', 'gehabt', ['hätte', 'hättest', 'hätte', 'hätten', 'hättet', 'hätten'], ['hab(e)', 'habt', 'haben Sie']),
      V('machen', 'faire', ['mache', 'machst', 'macht', 'machen', 'macht', 'machen'], ['machte', 'machtest', 'machte', 'machten', 'machtet', 'machten'], 'haben', 'gemacht', null, ['mach(e)', 'macht', 'machen Sie']),
      V('gehen', 'aller', ['gehe', 'gehst', 'geht', 'gehen', 'geht', 'gehen'], ['ging', 'gingst', 'ging', 'gingen', 'gingt', 'gingen'], 'sein', 'gegangen', null, ['geh(e)', 'geht', 'gehen Sie']),
      V('sprechen', 'parler', ['spreche', 'sprichst', 'spricht', 'sprechen', 'sprecht', 'sprechen'], ['sprach', 'sprachst', 'sprach', 'sprachen', 'spracht', 'sprachen'], 'haben', 'gesprochen', null, ['sprich', 'sprecht', 'sprechen Sie']),
      V('fahren', 'aller (en véhicule), conduire', ['fahre', 'fährst', 'fährt', 'fahren', 'fahrt', 'fahren'], ['fuhr', 'fuhrst', 'fuhr', 'fuhren', 'fuhrt', 'fuhren'], 'sein', 'gefahren', null, ['fahr(e)', 'fahrt', 'fahren Sie']),
      V('kommen', 'venir', ['komme', 'kommst', 'kommt', 'kommen', 'kommt', 'kommen'], ['kam', 'kamst', 'kam', 'kamen', 'kamt', 'kamen'], 'sein', 'gekommen', null, ['komm(e)', 'kommt', 'kommen Sie']),
      V('können', 'pouvoir (modal)', ['kann', 'kannst', 'kann', 'können', 'könnt', 'können'], ['konnte', 'konntest', 'konnte', 'konnten', 'konntet', 'konnten'], 'haben', 'gekonnt', ['könnte', 'könntest', 'könnte', 'könnten', 'könntet', 'könnten'], ['—', '—', '—'])
    ],
    tenses: mkTenses([
      ['pres', 'Présent', 'Präsens', 'Verbes forts : changement de voyelle à du / er (sprechen → du sprichst, fahren → du fährst).'],
      ['prat', 'Prétérit', 'Präteritum', 'Surtout à l’écrit. À l’oral, on utilise le Perfekt, sauf pour sein, haben et les modaux.'],
      ['perf', 'Passé composé', 'Perfekt', 'haben ou sein en 2e position, participe passé à la fin. sein pour le mouvement et le changement d’état.'],
      ['fut', 'Futur', 'Futur I', 'werden + infinitif à la fin de la phrase. Souvent remplacé par le présent + une indication de temps (morgen).'],
      ['konj', 'Conditionnel', 'Konjunktiv II', 'Politesse et hypothèses. würde + infinitif ; pour sein, haben et les modaux, formes propres : wäre, hätte, könnte.'],
      ['imp', 'Impératif', 'Imperativ', 'du : radical sans -st. ihr : comme au présent. Sie : verbe + Sie. Les verbes e→i gardent le i : sprich ! Les modaux n’ont pas d’impératif.']
    ], { imp: ['du', 'ihr', 'Sie'] }, P.de),
    rules: [
      { title: 'Articles : tableau des 4 cas', body: '<p><b>Articles définis</b></p><table class="tbl"><tr><th></th><th>m.</th><th>f.</th><th>n.</th><th>pl.</th></tr><tr><th>Nominatif</th><td>der</td><td>die</td><td>das</td><td>die</td></tr><tr><th>Accusatif</th><td><b>den</b></td><td>die</td><td>das</td><td>die</td></tr><tr><th>Datif</th><td>dem</td><td>der</td><td>dem</td><td>den (+n)</td></tr><tr><th>Génitif</th><td>des (+s)</td><td>der</td><td>des (+s)</td><td>der</td></tr></table><p><b>Articles indéfinis</b> (kein, mein, dein… se déclinent pareil)</p><table class="tbl"><tr><th></th><th>m.</th><th>f.</th><th>n.</th><th>pl.</th></tr><tr><th>Nominatif</th><td>ein</td><td>eine</td><td>ein</td><td>—</td></tr><tr><th>Accusatif</th><td><b>einen</b></td><td>eine</td><td>ein</td><td>—</td></tr><tr><th>Datif</th><td>einem</td><td>einer</td><td>einem</td><td>—</td></tr><tr><th>Génitif</th><td>eines</td><td>einer</td><td>eines</td><td>—</td></tr></table><p>À retenir : seul le <b>masculin</b> change à l’accusatif. Au datif pluriel, le nom prend -n (mit den Kindern). Au génitif, les noms masculins et neutres prennent -(e)s (des Mannes).</p>' },
      { title: 'Deviner le genre : terminaisons', body: '<p><b>der</b> (masc.) : jours, mois, saisons (der Montag, der Juli, der Winter) ; -er (personnes : der Lehrer) ; -ling ; -ismus ; -ig ; -or.</p><p><b>die</b> (fém.) : -ung, -heit, -keit, -schaft, -tion, -ität, -ik, -ur, -ei ; -in (femmes : die Lehrerin) ; la plupart des mots en -e (die Lampe).</p><p><b>das</b> (neutre) : diminutifs -chen et -lein (toujours), -ment, -um ; infinitifs devenus noms (das Essen).</p><p><b>Exceptions classiques :</b> das Mädchen (diminutif donc neutre, même si c’est une fille) ; das Fenster, das Zimmer, das Wasser, das Messer ; die Butter, die Mutter, die Tochter, die Schwester ; der Käse, der Löffel ; die Gabel ; das Auto.</p><p>Astuce : apprends toujours le nom <b>avec son article</b> (der Tisch, pas Tisch).</p>' },
      { title: 'Prépositions et cas', body: '<p><b>Accusatif</b> : durch, für, gegen, ohne, um (<i>ohne meinen Freund</i>).</p><p><b>Datif</b> : aus, bei, mit, nach, seit, von, zu, gegenüber (<i>mit dem Bus</i>).</p><p><b>Génitif</b> : wegen, trotz, während, statt (à l’oral, souvent le datif).</p><p><b>Wechselpräpositionen</b> : an, auf, hinter, in, neben, über, unter, vor, zwischen.<br>Wo ? (position) → <b>Datif</b> : <i>Ich bin in der Stadt.</i><br>Wohin ? (mouvement vers) → <b>Accusatif</b> : <i>Ich gehe in die Stadt.</i></p>' },
      { title: 'Ordre des mots', body: '<p><b>Verbe en 2e position</b> : Heute gehe ich ins Büro. (si un autre élément ouvre la phrase, le sujet passe après le verbe.)</p><p><b>Subordonnée</b> (dass, weil, wenn, ob, obwohl) : le verbe conjugué va à la <b>fin</b> : <i>Ich weiß, dass er morgen kommt.</i></p><p><b>Perfekt</b> : auxiliaire en 2e, participe à la fin : <i>Ich habe gestern einen Kaffee getrunken.</i></p><p><b>Verbes séparables</b> : Ich stehe um sieben Uhr auf. / Ich bin aufgestanden. / Ich will früh aufstehen.</p><p><b>Question sans mot interrogatif</b> : verbe en 1re position : Kommst du morgen ?</p>' },
      { title: 'Perfekt : haben ou sein ?', body: '<p><b>sein</b> : mouvement (gehen, fahren, kommen, fliegen) et changement d’état (aufstehen, einschlafen, werden) ; aussi sein et bleiben.</p><p><b>haben</b> : tout le reste, y compris les verbes transitifs (machen, trinken, sprechen).</p><p>Participes : faibles <b>ge-…-t</b> (gemacht), forts <b>ge-…-en</b> (gesprochen, gegangen). Séparables : aufgestanden. Sans « ge- » : verbes inséparables (besucht, verstanden) et en -ieren (telefoniert).</p>' },
      { title: 'Déclinaison faible (n-Deklination)', body: '<p>Quelques noms masculins (surtout des êtres vivants) prennent <b>-(e)n</b> à tous les cas sauf au nominatif singulier.</p><p><i>der Student → den Studenten → dem Studenten.</i><br>Autres : der Junge, der Kollege, der Kunde, der Mensch, der Herr (den Herrn).</p>' },
      { title: 'Terminaisons des adjectifs', body: '<p><b>Après l’article défini</b> :</p><table class="tbl"><tr><th></th><th>m.</th><th>f.</th><th>n.</th><th>pl.</th></tr><tr><th>Nom.</th><td>-e</td><td>-e</td><td>-e</td><td>-en</td></tr><tr><th>Akk.</th><td>-en</td><td>-e</td><td>-e</td><td>-en</td></tr><tr><th>Dat.</th><td>-en</td><td>-en</td><td>-en</td><td>-en</td></tr><tr><th>Gen.</th><td>-en</td><td>-en</td><td>-en</td><td>-en</td></tr></table><p>Exemples : der gute Wein, den guten Wein, mit dem guten Wein.</p><p><b>Après ein-</b> : l’adjectif porte la marque que l’article n’a pas : ein gut<b>er</b> Mann, eine gute Frau, ein gut<b>es</b> Kind.</p>' },
      { title: 'Politesse et hypothèses (Konjunktiv II)', body: '<p><i>Könnten Sie mir helfen ? Ich hätte gern einen Kaffee. Ich würde gern bezahlen.</i></p><p>Hypothèse irréelle : <i>Wenn ich mehr Zeit hätte, würde ich reisen.</i></p><p>Pour le passé : <i>Wenn ich das gewusst hätte, wäre ich gekommen.</i></p>' }
    ],
    quiz: [
      ['Ich sehe ___ Mann.', ['der', 'den', 'dem', 'des'], 1, 'Complément direct (Akkusativ) masculin : der → den.'],
      ['Ich helfe ___ Frau.', ['die', 'der', 'den', 'dem'], 1, 'helfen + Dativ. Féminin au datif : der Frau.'],
      ['Das ist das Auto ___ Mannes.', ['der', 'dem', 'des', 'den'], 2, 'Génitif masculin : des (le nom prend -es).'],
      ['Ich habe ___ Hund.', ['ein', 'einen', 'einem', 'eine'], 1, 'Akkusativ masculin : ein → einen.'],
      ['___ Mädchen ist nett.', ['Der', 'Die', 'Das', 'Den'], 2, 'Les noms en -chen sont neutres : das Mädchen.'],
      ['___ Zeitung ist neu.', ['Der', 'Die', 'Das', 'Dem'], 1, '-ung est toujours féminin.'],
      ['Ich fahre mit ___ Bus.', ['der', 'den', 'dem', 'das'], 2, 'mit + Dativ. Masculin : dem Bus.'],
      ['Ich gehe ohne ___ Freund ins Kino.', ['mein', 'meinen', 'meinem', 'meiner'], 1, 'ohne + Akkusativ. Masculin : meinen.'],
      ['Wohin ? Ich gehe in ___ Küche.', ['die', 'der', 'dem', 'das'], 0, 'Mouvement (wohin) → Akkusativ. Féminin : die Küche.'],
      ['Wo ? Das Buch liegt auf ___ Tisch.', ['den', 'dem', 'der', 'das'], 1, 'Position (wo) → Dativ. Masculin : dem Tisch.'],
      ['Gestern ___ ich nach Berlin gefahren.', ['habe', 'bin', 'war', 'wurde'], 1, 'fahren (mouvement) se conjugue avec sein : ich bin gefahren.'],
      ['Ich ___ gestern einen Kaffee getrunken.', ['bin', 'habe', 'war', 'werde'], 1, 'trinken se conjugue avec haben.'],
      ['Welcher Satz ist richtig ?', ['Ich weiß, dass er morgen kommt.', 'Ich weiß, dass er kommt morgen.', 'Ich weiß, dass kommt er morgen.', 'Ich weiß, er dass morgen kommt.'], 0, 'Dans la subordonnée, le verbe conjugué va à la fin.'],
      ['Welcher Satz ist richtig ?', ['Heute ich gehe ins Büro.', 'Heute gehe ich ins Büro.', 'Heute gehe ins Büro ich.', 'Ich heute gehe ins Büro.'], 1, 'Le verbe reste en 2e position : après « Heute », il passe avant le sujet.'],
      ['Ich spiele mit den Kinder___.', ['rien', '-n', '-en', '-s'], 1, 'Datif pluriel : on ajoute -n au nom (den Kindern).'],
      ['Ich kenne den Student___.', ['rien', '-n', '-en', '-s'], 2, 'Nom faible : den Studenten.'],
      ['Wenn ich mehr Zeit ___, würde ich reisen.', ['habe', 'hatte', 'hätte', 'haben'], 2, 'Irréel : Konjunktiv II de haben → hätte.'],
      ['Ich trinke den gut___ Wein.', ['-e', '-en', '-er', '-es'], 1, 'Après den (Akkusativ masculin) : -en.'],
      ['Das ist ein klein___ Kind.', ['-e', '-en', '-er', '-es'], 3, 'Après ein, neutre au nominatif : ein kleines Kind.'],
      ['___ bitte langsamer ! (du, sprechen)', ['Sprech', 'Sprich', 'Sprichst', 'Sprecht'], 1, 'Les verbes e→i gardent le i à l’impératif : sprich !'],
      ['___ Freiheit ist wichtig.', ['Der', 'Die', 'Das', 'Den'], 1, '-heit → féminin.'],
      ['___ Frühling ist meine Lieblingsjahreszeit.', ['Der', 'Die', 'Das', 'Den'], 0, 'Saisons, mois et jours sont masculins.']
    ],
    sit: []
  };
})();

/* ================= ANGLAIS (B2 → fluidité) ================= */
(function () {
  var HV = ['have', 'have', 'has', 'have', 'have', 'have'];
  function expand(forms) {
    return forms.map(function (f) { return f; });
  }
  function V(inf, fr, third, past, pp, imp, special) {
    var pres = special && special.pres ? special.pres : [inf, inf, third, inf, inf, inf];
    var pst = special && special.past ? special.past : [past, past, past, past, past, past];
    var perf = HV.map(function (a) {
      return pp.split('|').map(function (p) { return a + ' ' + p; }).join('|');
    });
    return { inf: inf, fr: fr, t: {
      pres: pres, past: pst, perf: perf,
      fut: ['I', 'you', 'he', 'we', 'you', 'they'].map(function () { return 'will ' + inf; }),
      cond: ['', '', '', '', '', ''].map(function () { return 'would ' + inf; }),
      imp: imp
    } };
  }
  D.en = {
    verbs: [
      V('be', 'être', 'is', 'was', 'been', ['Be careful!', 'Don’t be late!', 'Let’s be honest.'], { pres: ['am', 'are', 'is', 'are', 'are', 'are'], past: ['was', 'were', 'was', 'were', 'were', 'were'] }),
      V('have', 'avoir', 'has', 'had', 'had', ['Have a seat!', 'Don’t have too much!', 'Let’s have lunch.']),
      V('go', 'aller', 'goes', 'went', 'gone|been', ['Go straight on!', 'Don’t go there!', 'Let’s go!']),
      V('do', 'faire', 'does', 'did', 'done', ['Do it now!', 'Don’t do that!', 'Let’s do it.']),
      V('make', 'faire, fabriquer', 'makes', 'made', 'made', ['Make a decision!', 'Don’t make noise!', 'Let’s make a plan.']),
      V('take', 'prendre', 'takes', 'took', 'taken', ['Take a seat!', 'Don’t take it personally!', 'Let’s take a break.']),
      V('get', 'obtenir, devenir', 'gets', 'got', 'got|gotten', ['Get ready!', 'Don’t get angry!', 'Let’s get started.']),
      V('work', 'travailler', 'works', 'worked', 'worked', ['Work hard!', 'Don’t work too late!', 'Let’s work together.'])
    ],
    tenses: mkTenses([
      ['pres', 'Présent simple', 'present simple', 'Troisième personne du singulier : -s (he works). Be, have et do sont irréguliers.'],
      ['past', 'Prétérit', 'past simple', 'Réguliers : -ed. Irréguliers à mémoriser. Pour un moment terminé : yesterday, last year, in 2019.'],
      ['perf', 'Present perfect', 'present perfect', 'have / has + participe passé. Lien avec le présent : I’ve lived here for five years. Avec for (durée) et since (point de départ).'],
      ['fut', 'Futur', 'will', 'will pour une décision spontanée ou une prévision ; be going to pour une intention ou une évidence.'],
      ['cond', 'Conditionnel', 'would', 'would + base verbale. Hypothèse : If I had time, I would travel. Politesse : I’d like a coffee.'],
      ['imp', 'Impératif', 'imperative', 'Forme de base du verbe. Négatif : Don’t + base. Suggestion : Let’s + base.']
    ], { imp: ['à l’affirmatif', 'au négatif', 'suggestion « on… »'] }, P.en),
    noDrill: { imp: 1 },
    rules: [
      { title: 'Articles : a, an, the, ou rien', body: '<p><b>a / an</b> : selon le <b>son</b>, pas la lettre. <i>a university, a European, a one-off</i> (son consonne) ; <i>an hour, an MBA, an honest man</i> (son voyelle).</p><p><b>the</b> : chose précise ou déjà mentionnée, unique (the sun), superlatifs (the best), fleuves, océans, chaînes de montagnes, pays au pluriel ou à nom composé (the Alps, the USA, the Netherlands).</p><p><b>Pas d’article</b> : généralités au pluriel ou indénombrables (<i>Life is hard. I like music.</i>), langues, repas (have breakfast), sports, la plupart des pays et villes.</p><p><b>Exceptions classiques</b> : go to school / church / prison / hospital / work, be in bed, by car, at home (pas d’article quand on pense à la fonction du lieu). Avec the, on pense au bâtiment : <i>I’m going to the hospital to visit a friend.</i> (en anglais américain : in the hospital.)</p>' },
      { title: 'Past simple ou present perfect ?', body: '<p><b>Past simple</b> : moment terminé, daté ou sous-entendu. <i>I lived in Lyon in 2018. She called yesterday.</i></p><p><b>Present perfect</b> : lien avec le présent ; expérience sans date ; durée jusqu’à maintenant. <i>I’ve lived here since 2019. Have you ever been to Berlin? I’ve just finished.</i></p><p>Avec un marqueur de temps passé (yesterday, last week, ago), on ne peut <b>pas</b> utiliser le present perfect.</p>' },
      { title: 'Conditionnels', body: '<p><b>0</b> : If you heat ice, it melts. (vérité générale)</p><p><b>1</b> : If it rains, I’ll stay home. (possible)</p><p><b>2</b> : If I had more time, I’d learn Russian. (irréel du présent)</p><p><b>3</b> : If I had known, I would have told you. (irréel du passé)</p><p><b>Mixte</b> : If I had taken that job, I would be living in Berlin now.</p><p>Jamais « would » juste après « if » dans la condition.</p>' },
      { title: 'Wish et if only', body: '<p><b>wish + prétérit</b> : regret ou souhait au présent. <i>I wish I spoke Russian.</i></p><p><b>wish + past perfect</b> : regret sur le passé. <i>I wish I had studied more.</i></p><p><b>wish + would</b> : agacement. <i>I wish you would stop interrupting.</i></p>' },
      { title: 'Déduction et modaux au passé', body: '<p><b>must have + participe</b> : quasi-certitude. <i>He must have left already.</i></p><p><b>might / may / could have</b> : possibilité. <i>She might have missed the train.</i></p><p><b>can’t have</b> : impossibilité. <i>They can’t have arrived yet.</i></p><p><b>should have</b> : reproche ou regret. <i>I should have called.</i></p>' },
      { title: 'Used to, would, be used to, get used to', body: '<p><b>used to + base</b> : habitude passée. <i>I used to smoke.</i></p><p><b>be used to + -ing</b> : être habitué. <i>I’m used to working late.</i></p><p><b>get used to + -ing</b> : s’habituer. <i>I’m getting used to living here.</i></p>' },
      { title: 'Style indirect', body: '<p>Les temps reculent d’un cran : present → past, will → would, can → could, present perfect → past perfect.</p><p><i>“I’ll call you tomorrow.” → She said she would call me the next day.</i></p><p><b>say</b> sans complément de personne, <b>tell</b> avec : say that…, tell me that…</p>' },
      { title: 'Pièges pour francophones', body: '<p><b>I am 30</b> (pas « I have 30 years »). <b>I agree</b> (pas « I am agree »).</p><p><b>for / since</b> : for three years, since 2020 (jamais « since three years »).</p><p><b>Indénombrables</b> : information, advice, news, luggage, furniture (pas de -s, pas de « an »). <i>some advice, a piece of advice.</i></p><p><b>Faux amis</b> : actually = en fait ; eventually = finalement ; sensible = raisonnable ; library = bibliothèque ; lecture = cours magistral ; to attend = assister à ; to assist = aider.</p><p><b>look forward to + -ing</b> : I look forward to hearing from you.</p>' },
      { title: 'Connecteurs pour parler avec fluidité', body: '<p><b>Nuancer</b> : to be fair, having said that, on the other hand, that said.</p><p><b>Donner son avis</b> : as far as I’m concerned, if you ask me, I’d say that…</p><p><b>Gagner du temps</b> : let me think, that’s a good question, how can I put this?</p><p><b>Reformuler</b> : in other words, what I mean is…, to put it simply.</p><p><b>Verbes à particule utiles</b> : set off, check in, catch up, look into, put off, get back to, carry on, sort out.</p>' }
    ],
    quiz: [
      ['I’ve lived here ___ 2019.', ['for', 'since', 'from', 'during'], 1, 'since + point de départ ; for + durée.'],
      ['She ___ in Paris last year.', ['has lived', 'lived', 'lives', 'is living'], 1, 'Last year = moment terminé : past simple.'],
      ['It took me ___ hour to get here.', ['a', 'an', 'the', 'no article'], 1, '« hour » commence par un son voyelle (h muet) : an hour.'],
      ['He studies at ___ university in Leeds.', ['a', 'an', 'the', 'no article'], 0, '« university » commence par le son /j/ : a university.'],
      ['She’s been in ___ hospital for a week. (as a patient, British English)', ['a', 'an', 'the', 'no article'], 3, 'Quand on pense à la fonction du lieu, pas d’article en anglais britannique : in hospital. (US : in the hospital.)'],
      ['If I ___ more time, I’d learn Russian.', ['have', 'had', 'would have', 'will have'], 1, 'Deuxième conditionnel : if + prétérit, would + base.'],
      ['If I had known, I ___ you.', ['would tell', 'would have told', 'will tell', 'had told'], 1, 'Troisième conditionnel : if + past perfect, would have + participe.'],
      ['I wish I ___ more languages.', ['speak', 'spoke', 'would speak', 'had spoken'], 1, 'wish + prétérit pour un souhait irréel au présent.'],
      ['She ___ left already; her coat is still here.', ['can’t have', 'mustn’t have', 'shouldn’t', 'can’t'], 0, 'Déduction négative sur le passé : can’t have + participe.'],
      ['I’m not used to ___ up so early.', ['get', 'getting', 'got', 'be getting'], 1, 'be used to + -ing.'],
      ['He said he ___ the next day.', ['will come', 'would come', 'comes', 'came'], 1, 'Style indirect : will → would.'],
      ['Could you give me some ___ ?', ['advices', 'advice', 'an advice', 'advise'], 1, 'Advice est indénombrable.'],
      ['I look forward to ___ from you.', ['hear', 'hearing', 'heard', 'have heard'], 1, 'look forward to + -ing.'],
      ['Quel mot veut dire « finalement » ?', ['actually', 'eventually', 'currently', 'sensibly'], 1, 'Eventually = finalement ; actually = en fait.'],
      ['I ___ 30 years old.', ['have', 'am', 'do', 'make'], 1, 'L’âge se dit avec be : I am 30.'],
      ['I’ve known her ___ three years.', ['since', 'for', 'during', 'from'], 1, 'for + durée.']
    ],
    sit: []
  };
})();

/* ================= RUSSE (niveau 0) ================= */
(function () {
  var BUD = ['буду', 'будешь', 'будет', 'будем', 'будете', 'будут'];
  function V(inf, fr, pres, past, imp) {
    return { inf: inf, fr: fr, t: {
      pres: pres,
      past: past,
      fut: BUD.map(function (b) { return b + ' ' + inf; }),
      cond: past.map(function (p) { return p + ' бы'; }),
      imp: imp
    } };
  }
  var PL = ['я / ты / он (м.)', 'я / ты / она (ж.)', 'оно (с.)', 'мы / вы / они'];
  D.ru = {
    verbs: [
      V('работать', 'travailler', ['работаю', 'работаешь', 'работает', 'работаем', 'работаете', 'работают'], ['работал', 'работала', 'работало', 'работали'], ['работай', 'работайте']),
      V('говорить', 'parler, dire', ['говорю', 'говоришь', 'говорит', 'говорим', 'говорите', 'говорят'], ['говорил', 'говорила', 'говорило', 'говорили'], ['говори', 'говорите']),
      V('жить', 'vivre, habiter', ['живу', 'живёшь', 'живёт', 'живём', 'живёте', 'живут'], ['жил', 'жила', 'жило', 'жили'], ['живи', 'живите']),
      V('читать', 'lire', ['читаю', 'читаешь', 'читает', 'читаем', 'читаете', 'читают'], ['читал', 'читала', 'читало', 'читали'], ['читай', 'читайте']),
      V('идти', 'aller à pied', ['иду', 'идёшь', 'идёт', 'идём', 'идёте', 'идут'], ['шёл', 'шла', 'шло', 'шли'], ['иди', 'идите'])
    ],
    tenses: mkTenses([
      ['pres', 'Présent', 'настоящее', 'Deux types de conjugaison : -ешь (работаешь) et -ишь (говоришь). Le verbe « être » n’existe pas au présent.'],
      ['past', 'Passé', 'прошедшее', 'Radical + -л, avec accord du genre : он читал, она читала, оно читало, они читали. Pas de personne dans le verbe.'],
      ['fut', 'Futur', 'будущее', 'быть conjugué + infinitif : я буду читать. (Les verbes perfectifs ont un futur sans быть : прочитаю.)'],
      ['cond', 'Conditionnel', 'сослагательное', 'Passé + particule бы : я читал бы (homme), я читала бы (femme).'],
      ['imp', 'Impératif', 'повелительное', 'Radical + -й ou -и. Pluriel ou politesse : + -те. Ex. : говори ! (ты), говорите ! (вы).']
    ], { past: PL, cond: PL, imp: ['ты', 'вы'] }, P.ru),
    rules: [
      { title: 'Pas d’articles', body: '<p>Le russe n’a <b>ni article défini ni indéfini</b> : стол = « une table » ou « la table » selon le contexte.</p><p>C’est le seul point où le russe est plus simple que l’allemand ou l’espagnol.</p>' },
      { title: 'Le genre des noms', body: '<p><b>Masculin</b> : consonne finale (стол, дом), -й (музей), certains en -ь (день).</p><p><b>Féminin</b> : -а, -я (книга, неделя), certains en -ь (дверь).</p><p><b>Neutre</b> : -о, -е (окно, море).</p><p>Exceptions : папа, дедушка, мужчина, дядя sont masculins malgré leur -а / -я.</p>' },
      { title: 'Pas de verbe « être » au présent', body: '<p><i>Я студент.</i> (Je suis étudiant.) <i>Она дома.</i> (Elle est à la maison.)</p><p><b>Avoir</b> : <i>У меня есть брат.</i> (litt. « chez moi il y a un frère »). Négation : <i>У меня нет брата.</i> (génitif)</p><p>Passé : был, была, было, были. Futur : буду, будешь…</p>' },
      { title: 'Les six cas', body: '<table class="tbl"><tr><th>Cas</th><th>Questions</th><th>Emploi</th></tr><tr><td>Nominatif</td><td>кто ? что ?</td><td>sujet</td></tr><tr><td>Génitif</td><td>кого ? чего ?</td><td>« de », absence : у меня нет брата</td></tr><tr><td>Datif</td><td>кому ? чему ?</td><td>« à quelqu’un » : даю книгу брату</td></tr><tr><td>Accusatif</td><td>кого ? что ?</td><td>COD, direction : в Москву</td></tr><tr><td>Instrumental</td><td>кем ? чем ?</td><td>« avec » : с другом</td></tr><tr><td>Prépositionnel</td><td>о ком ? о чём ?</td><td>lieu : в Москве</td></tr></table><p>On les apprend progressivement, avec des phrases toutes faites. Commence par le nominatif, le prépositionnel (lieu) et le génitif après нет.</p>' },
      { title: 'Où ? et Où (vers) ?', body: '<p><b>В / на + prépositionnel</b> : lieu où l’on est. <i>Я в Москве. Я на работе.</i></p><p><b>В / на + accusatif</b> : direction. <i>Я иду в Москву. Я иду на работу.</i></p><p>Usage : на pour les événements, les espaces ouverts et certaines institutions (на работе, на улице, на вокзале), в pour les espaces fermés (в магазине).</p>' },
      { title: 'Aspect des verbes', body: '<p>La plupart des verbes ont deux formes :</p><p><b>Imperfectif</b> : action en cours ou répétée : <i>читать, делать</i>.</p><p><b>Perfectif</b> : action achevée, résultat : <i>прочитать, сделать</i>.</p><p>Vu au fil des leçons : au niveau 0, mémorise les deux formes ensemble.</p>' },
      { title: 'Politesse et prononciation', body: '<p><b>ты</b> = tutoiement, <b>вы</b> = vouvoiement ou pluriel. Bonjour poli : <i>Здравствуйте</i>. Entre amis : <i>Привет</i>.</p><p>L’accent tonique est libre et <b>change la prononciation</b> : un « о » non accentué se prononce « a » (молоко → malaKO). Ж, Ш, Ц sont toujours durs.</p>' }
    ],
    quiz: [
      ['Que signifie « спасибо » ?', ['merci', 'bonjour', 'pardon', 'au revoir'], 0, 'спасибо = merci.'],
      ['Que signifie « до свидания » ?', ['bonne nuit', 'au revoir', 'bienvenue', 'à demain'], 1, 'до свидания = au revoir.'],
      ['Quel mot veut dire « s’il vous plaît / je vous en prie » ?', ['пожалуйста', 'привет', 'здравствуйте', 'нет'], 0, 'пожалуйста sert pour demander et pour répondre à merci.'],
      ['Combien y a-t-il de cas en russe ?', ['3', '4', '6', '8'], 2, 'Six cas : nominatif, génitif, datif, accusatif, instrumental, prépositionnel.'],
      ['Quel est le genre de « книга » (livre) ?', ['masculin', 'féminin', 'neutre', 'pluriel'], 1, 'Les noms en -а sont en général féminins.'],
      ['Quel est le genre de « окно » (fenêtre) ?', ['masculin', 'féminin', 'neutre', 'pluriel'], 2, '-о et -е : neutre.'],
      ['« Я ___ студент. » (Je suis étudiant.) Quel verbe ?', ['есть', 'буду', 'был', 'aucun : on ne l’exprime pas'], 3, 'Au présent, le verbe être n’est pas exprimé : Я студент.'],
      ['« Я живу ___ Москве. »', ['в', 'из', 'к', 'от'], 0, 'в + prépositionnel pour le lieu : в Москве.'],
      ['« У меня ___ брат. » (J’ai un frère.)', ['есть', 'нет', 'быть', 'был'], 0, '« Avoir » se dit у меня есть.'],
      ['Futur de « работать » : « Я ___ ».', ['работаю', 'буду работать', 'работал', 'работай'], 1, 'Futur imperfectif : быть + infinitif.'],
      ['Passé féminin de « читать » :', ['читал', 'читала', 'читало', 'читали'], 1, '-ла pour le féminin.'],
      ['Impératif (ты) de « говорить » :', ['говори', 'говорите', 'говорит', 'говорил'], 0, 'Radical + -и : говори !'],
      ['« У меня нет ___ . » (брат)', ['брат', 'брата', 'брату', 'братом'], 1, 'нет + génitif : брата.'],
      ['« Мне нужно больше времени » signifie :', ['J’ai besoin de plus de temps', 'Je n’ai pas le temps', 'Il est tard', 'Je suis pressé'], 0, 'мне нужно = j’ai besoin ; больше времени = plus de temps.']
    ],
    alpha: [
      ['А', 'а', 'a', 'мама', 'maman'], ['Б', 'б', 'b', 'банк', 'banque'], ['В', 'в', 'v', 'вода', 'eau'],
      ['Г', 'г', 'g', 'город', 'ville'], ['Д', 'д', 'd', 'дом', 'maison'], ['Е', 'е', 'ié', 'еда', 'nourriture'],
      ['Ё', 'ё', 'io', 'ёлка', 'sapin'], ['Ж', 'ж', 'j (comme jour)', 'жизнь', 'vie'], ['З', 'з', 'z', 'зима', 'hiver'],
      ['И', 'и', 'i', 'имя', 'prénom'], ['Й', 'й', 'i bref (comme yeux)', 'май', 'mai'], ['К', 'к', 'k', 'кофе', 'café'],
      ['Л', 'л', 'l', 'лампа', 'lampe'], ['М', 'м', 'm', 'мир', 'monde, paix'], ['Н', 'н', 'n', 'нос', 'nez'],
      ['О', 'о', 'o', 'окно', 'fenêtre'], ['П', 'п', 'p', 'папа', 'papa'], ['Р', 'р', 'r roulé', 'рука', 'main'],
      ['С', 'с', 's', 'сок', 'jus'], ['Т', 'т', 't', 'такси', 'taxi'], ['У', 'у', 'ou', 'улица', 'rue'],
      ['Ф', 'ф', 'f', 'фото', 'photo'], ['Х', 'х', 'kh (jota espagnole)', 'хлеб', 'pain'], ['Ц', 'ц', 'ts', 'цветок', 'fleur'],
      ['Ч', 'ч', 'tch', 'чай', 'thé'], ['Ш', 'ш', 'ch', 'школа', 'école'], ['Щ', 'щ', 'chtch', 'борщ', 'bortsch'],
      ['Ы', 'ы', 'y (entre i et ou)', 'мы', 'nous'], ['Э', 'э', 'è', 'это', 'ceci'], ['Ю', 'ю', 'iou', 'юг', 'sud'],
      ['Я', 'я', 'ia', 'яблоко', 'pomme']
    ],
    alphaSigns: [
      ['Ъ', 'ъ', 'signe dur : sépare deux sons, rare (объект)'],
      ['Ь', 'ь', 'signe mou : adoucit la consonne précédente (день)']
    ],
    sit: []
  };
})();

/* ================= SITUATIONS RÉELLES ================= */
function SIT(lang, list) { D[lang].sit = list.map(function (s) { return { id: s[0], title: s[1], intro: s[2], phrases: s[3] }; }); }

SIT('es', [
  ['voyage', 'En voyage', 'Gare, hôtel, se repérer', [
    ['¿Dónde está la estación de tren?', 'Où est la gare ?'],
    ['Un billete de ida y vuelta a Madrid, por favor.', 'Un billet aller-retour pour Madrid, s’il vous plaît.'],
    ['¿A qué hora sale el próximo autobús?', 'À quelle heure part le prochain bus ?'],
    ['Tengo una reserva a nombre de García.', 'J’ai une réservation au nom de García.'],
    ['¿Cuánto cuesta una habitación por noche?', 'Combien coûte une chambre par nuit ?'],
    ['Perdone, estoy perdido. ¿Me puede ayudar?', 'Excusez-moi, je suis perdu. Pouvez-vous m’aider ?']]],
  ['supermarche', 'Au supermarché', 'Courses, caisse, paiement', [
    ['¿Dónde puedo encontrar la leche?', 'Où puis-je trouver le lait ?'],
    ['Quiero un kilo de tomates, por favor.', 'Je voudrais un kilo de tomates, s’il vous plaît.'],
    ['¿Tiene bolsas?', 'Avez-vous des sacs ?'],
    ['¿Esto está en oferta?', 'Est-ce en promotion ?'],
    ['¿Puedo pagar con tarjeta?', 'Puis-je payer par carte ?'],
    ['¿Cuánto es todo?', 'Combien ça fait en tout ?']]],
  ['restaurant', 'Au restaurant', 'Commander, demander l’addition', [
    ['Una mesa para dos, por favor.', 'Une table pour deux, s’il vous plaît.'],
    ['¿Me puede traer la carta?', 'Pouvez-vous m’apporter la carte ?'],
    ['Soy vegetariano. ¿Qué me recomienda?', 'Je suis végétarien. Que me recommandez-vous ?'],
    ['Para beber, agua sin gas, por favor.', 'Comme boisson, de l’eau plate, s’il vous plaît.'],
    ['La cuenta, por favor.', 'L’addition, s’il vous plaît.'],
    ['Estaba todo muy rico, gracias.', 'C’était très bon, merci.']]],
  ['rencontre', 'Rencontrer des gens', 'Se présenter, faire connaissance', [
    ['Hola, me llamo Ana. ¿Y tú?', 'Salut, je m’appelle Ana. Et toi ?'],
    ['Mucho gusto.', 'Enchanté(e).'],
    ['¿De dónde eres?', 'D’où viens-tu ?'],
    ['Soy de Francia.', 'Je viens de France.'],
    ['¿A qué te dedicas?', 'Que fais-tu dans la vie ?'],
    ['Hablo un poco de español.', 'Je parle un peu espagnol.']]],
  ['travail', 'Au travail', 'Réunions, e-mails, organisation', [
    ['Trabajo en una empresa internacional.', 'Je travaille dans une entreprise internationale.'],
    ['Tengo una reunión a las diez.', 'J’ai une réunion à dix heures.'],
    ['¿Puede enviarme el informe por correo electrónico?', 'Pouvez-vous m’envoyer le rapport par e-mail ?'],
    ['Necesito más tiempo para terminar el proyecto.', 'J’ai besoin de plus de temps pour terminer le projet.'],
    ['¿Podemos hablar mañana por la mañana?', 'Pouvons-nous parler demain matin ?'],
    ['Trabajo desde casa dos días a la semana.', 'Je travaille de chez moi deux jours par semaine.']]]
]);

SIT('de', [
  ['voyage', 'En voyage', 'Gare, hôtel, se repérer', [
    ['Entschuldigung, wie komme ich zum Hauptbahnhof?', 'Excusez-moi, comment aller à la gare centrale ?'],
    ['Einmal hin und zurück nach Berlin, bitte.', 'Un aller-retour pour Berlin, s’il vous plaît.'],
    ['Von welchem Gleis fährt der Zug ab?', 'De quelle voie part le train ?'],
    ['Ich habe ein Zimmer auf den Namen Martin reserviert.', 'J’ai réservé une chambre au nom de Martin.'],
    ['Wie viel kostet die Übernachtung pro Nacht?', 'Combien coûte la nuit ?'],
    ['Könnten Sie mir bitte helfen? Ich habe mich verlaufen.', 'Pourriez-vous m’aider ? Je me suis perdu.']]],
  ['supermarche', 'Au supermarché', 'Courses, caisse, paiement', [
    ['Wo finde ich die Milch?', 'Où est-ce que je trouve le lait ?'],
    ['Ich hätte gern ein Kilo Tomaten.', 'Je voudrais un kilo de tomates.'],
    ['Haben Sie eine Tüte?', 'Avez-vous un sac ?'],
    ['Kann ich mit Karte bezahlen?', 'Puis-je payer par carte ?'],
    ['Ist das im Angebot?', 'Est-ce en promotion ?'],
    ['Muss ich Pfand bezahlen?', 'Dois-je payer une consigne ?']]],
  ['restaurant', 'Au restaurant', 'Commander, demander l’addition', [
    ['Einen Tisch für zwei Personen, bitte.', 'Une table pour deux personnes, s’il vous plaît.'],
    ['Könnte ich bitte die Speisekarte haben?', 'Pourrais-je avoir la carte, s’il vous plaît ?'],
    ['Ich bin Vegetarier. Was können Sie empfehlen?', 'Je suis végétarien. Que pouvez-vous recommander ?'],
    ['Ein stilles Wasser, bitte.', 'Une eau plate, s’il vous plaît.'],
    ['Wir möchten bitte zahlen.', 'Nous voudrions payer, s’il vous plaît.'],
    ['Das hat sehr gut geschmeckt, vielen Dank.', 'C’était très bon, merci beaucoup.']]],
  ['rencontre', 'Rencontrer des gens', 'Se présenter, faire connaissance', [
    ['Hallo, ich heiße Anna. Und du?', 'Salut, je m’appelle Anna. Et toi ?'],
    ['Freut mich, dich kennenzulernen.', 'Ravi de faire ta connaissance.'],
    ['Woher kommst du?', 'D’où viens-tu ?'],
    ['Ich komme aus Frankreich.', 'Je viens de France.'],
    ['Was machst du beruflich?', 'Que fais-tu comme métier ?'],
    ['Ich lerne gerade wieder Deutsch.', 'Je réapprends l’allemand en ce moment.']]],
  ['travail', 'Au travail', 'Réunions, e-mails, organisation', [
    ['Ich arbeite in einem internationalen Unternehmen.', 'Je travaille dans une entreprise internationale.'],
    ['Ich habe um zehn Uhr eine Besprechung.', 'J’ai une réunion à dix heures.'],
    ['Könnten Sie mir den Bericht per E-Mail schicken?', 'Pourriez-vous m’envoyer le rapport par e-mail ?'],
    ['Ich brauche noch etwas Zeit für das Projekt.', 'J’ai encore besoin d’un peu de temps pour le projet.'],
    ['Können wir morgen früh telefonieren?', 'Pouvons-nous nous appeler demain matin ?'],
    ['Zwei Tage pro Woche arbeite ich im Homeoffice.', 'Deux jours par semaine, je travaille en télétravail.']]]
]);

SIT('en', [
  ['voyage', 'En voyage', 'Gare, hôtel, imprévus', [
    ['Excuse me, is this the right platform for the Edinburgh train?', 'Excusez-moi, est-ce le bon quai pour le train d’Édimbourg ?'],
    ['I’d like a return ticket to Manchester, please.', 'Je voudrais un billet aller-retour pour Manchester, s’il vous plaît.'],
    ['I’ve booked a room under the name Martin.', 'J’ai réservé une chambre au nom de Martin.'],
    ['Is breakfast included in the price?', 'Le petit-déjeuner est-il compris dans le prix ?'],
    ['I’m afraid I’ve missed my connection. What are my options?', 'Je crains d’avoir raté ma correspondance. Quelles sont mes options ?'],
    ['Could you recommend something worth seeing nearby?', 'Pourriez-vous me recommander quelque chose à voir dans le coin ?']]],
  ['supermarche', 'Au supermarché', 'Courses, caisse, paiement', [
    ['Where would I find the oat milk?', 'Où trouverais-je le lait d’avoine ?'],
    ['Do you have a loyalty card?', 'Avez-vous une carte de fidélité ? (question de la caissière)'],
    ['Would you like a bag?', 'Voulez-vous un sac ? (question de la caissière)'],
    ['I’ll pay by card, please.', 'Je vais payer par carte, s’il vous plaît.'],
    ['Is this on offer at the moment?', 'Est-ce en promotion en ce moment ?'],
    ['Could I have a receipt, please?', 'Puis-je avoir un ticket de caisse, s’il vous plaît ?']]],
  ['restaurant', 'Au restaurant', 'Commander, nuancer, régler', [
    ['Could we have a table for two, please?', 'Pourrions-nous avoir une table pour deux, s’il vous plaît ?'],
    ['What would you recommend?', 'Que me conseilleriez-vous ?'],
    ['I’ll have the soup to start, and then the fish.', 'Je prendrai la soupe en entrée, puis le poisson.'],
    ['Is the service included?', 'Le service est-il compris ?'],
    ['Could we have the bill, please?', 'Pourrions-nous avoir l’addition, s’il vous plaît ?'],
    ['It’s on me.', 'C’est moi qui invite.']]],
  ['rencontre', 'Rencontrer des gens', 'Conversation naturelle', [
    ['Nice to meet you. What do you do for a living?', 'Enchanté. Que faites-vous dans la vie ?'],
    ['Where are you from originally?', 'D’où venez-vous à l’origine ?'],
    ['How long have you been living here?', 'Depuis combien de temps vivez-vous ici ?'],
    ['We should catch up sometime.', 'On devrait se voir un de ces jours.'],
    ['I couldn’t agree more.', 'Je suis tout à fait d’accord.'],
    ['Sorry, could you say that again more slowly?', 'Pardon, pouvez-vous répéter plus lentement ?']]],
  ['travail', 'Au travail', 'Réunions, suivi, échéances', [
    ['I’m responsible for a small team.', 'Je suis responsable d’une petite équipe.'],
    ['Let’s touch base next week.', 'Faisons un point la semaine prochaine.'],
    ['Could you get back to me by Friday?', 'Pouvez-vous me répondre d’ici vendredi ?'],
    ['I’ll look into it and let you know.', 'Je vais regarder ça et je vous tiens au courant.'],
    ['That sounds like a plan.', 'Ça me paraît être un bon plan.'],
    ['I’m running a bit behind schedule.', 'J’ai un peu de retard sur le planning.']]]
]);

SIT('ru', [
  ['voyage', 'En voyage', 'Gare, hôtel, se repérer', [
    ['Где вокзал?', 'Où est la gare ?', 'Gdié vagzal ?'],
    ['Один билет до Москвы, пожалуйста.', 'Un billet pour Moscou, s’il vous plaît.', 'Adine biliét da Maskvy, pajalousta.'],
    ['Во сколько отправляется поезд?', 'À quelle heure part le train ?', 'Va skolka atpravliaïétsa poïezd ?'],
    ['Сколько стоит номер?', 'Combien coûte la chambre ?', 'Skolka stoït nomer ?'],
    ['Извините, я заблудился.', 'Excusez-moi, je suis perdu.', 'Izvinité, ia zabloudilsia.'],
    ['Помогите, пожалуйста.', 'Aidez-moi, s’il vous plaît.', 'Pamaguité, pajalousta.']]],
  ['supermarche', 'Au supermarché', 'Courses, caisse, paiement', [
    ['Где молоко?', 'Où est le lait ?', 'Gdié malako ?'],
    ['Сколько это стоит?', 'Combien ça coûte ?', 'Skolka éta stoït ?'],
    ['Один килограмм помидоров, пожалуйста.', 'Un kilo de tomates, s’il vous plaît.', 'Adine kilagram pamidorov, pajalousta.'],
    ['Можно заплатить картой?', 'Peut-on payer par carte ?', 'Mojna zaplatite kartoï ?'],
    ['Мне нужен пакет.', 'J’ai besoin d’un sac.', 'Mnié noujen paket.'],
    ['Спасибо, до свидания.', 'Merci, au revoir.', 'Spassiba, da svidania.']]],
  ['restaurant', 'Au restaurant', 'Commander, demander l’addition', [
    ['Столик на двоих, пожалуйста.', 'Une table pour deux, s’il vous plaît.', 'Stolik na dvoïkh, pajalousta.'],
    ['Меню, пожалуйста.', 'Le menu, s’il vous plaît.', 'Minïou, pajalousta.'],
    ['Я вегетарианец.', 'Je suis végétarien. (femme : вегетарианка)', 'Ia viguitarianiéts.'],
    ['Воду без газа, пожалуйста.', 'De l’eau plate, s’il vous plaît.', 'Vodou biez gaza, pajalousta.'],
    ['Счёт, пожалуйста.', 'L’addition, s’il vous plaît.', 'Chtchiot, pajalousta.'],
    ['Очень вкусно!', 'C’est très bon !', 'Otchine fkousna !']]],
  ['rencontre', 'Rencontrer des gens', 'Se présenter, faire connaissance', [
    ['Привет! Меня зовут Анна.', 'Salut ! Je m’appelle Anna.', 'Privièt ! Minia zavout Anna.'],
    ['Очень приятно.', 'Enchanté.', 'Otchine priiatna.'],
    ['Откуда вы?', 'D’où venez-vous ?', 'Atkouda vy ?'],
    ['Я из Франции.', 'Je viens de France.', 'Ia iz Frantsii.'],
    ['Вы говорите по-английски?', 'Parlez-vous anglais ?', 'Vy gavarité pa-angliski ?'],
    ['Я немного говорю по-русски.', 'Je parle un peu russe.', 'Ia nimnoga gavariou pa-rouski.']]],
  ['travail', 'Au travail', 'Réunions, e-mails, organisation', [
    ['Я работаю в компании.', 'Je travaille dans une entreprise.', 'Ia rabotaïou f kampanii.'],
    ['У меня встреча в десять часов.', 'J’ai une réunion à dix heures.', 'Ou minia vstrietcha v diessiat tchassov.'],
    ['Пришлите мне, пожалуйста, отчёт.', 'Envoyez-moi le rapport, s’il vous plaît.', 'Prichlité mnié, pajalousta, atchiot.'],
    ['Мне нужно больше времени.', 'J’ai besoin de plus de temps.', 'Mnié noujna bolché vriémini.'],
    ['Давайте поговорим завтра.', 'Parlons-en demain.', 'Davaïté pagavarim zaftra.'],
    ['Я работаю из дома.', 'Je travaille de chez moi.', 'Ia rabotaïou iz doma.']]]
]);

/* ================= SCÉNARIOS DE CONVERSATION ================= */
var SCEN = {
  voyage: 'A traveller at a train station ticket counter, then at a hotel reception. You play the staff member; the learner is the traveller.',
  supermarche: 'At a supermarket. You play a shop assistant or cashier; the learner is a customer looking for products and paying.',
  restaurant: 'In a restaurant. You play the waiter; the learner orders food and drinks, asks questions, and asks for the bill.',
  rencontre: 'At a social gathering. You play a friendly local meeting the learner for the first time; ask about origin, job, hobbies.',
  travail: 'In an office. You play a new colleague; talk about the job, the schedule of the day, a meeting, an email to send.',
  libre: 'Free conversation about everyday life. Ask open, simple questions and let the learner lead.'
};
