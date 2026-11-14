'use strict';
/* Parcours de 26 semaines : une unité par semaine = 5 leçons + 1 bilan.
   Champs d'une unité : [titre, niveau, consigne pour l'IA (anglais), options]
   options : conj (temps), verbs (index de verbes), rules (fiches), q (questions du quiz),
             sit (situation), core (contenu manuel espagnol), alpha (alphabet russe) */

var MB = [0, 4, 9, 13, 18, 22, 26];   /* bornes des 6 mois, en unités */

var GOALS = {
  es: { from: 'A2', to: 'B1 solide, premiers pas en B2',
    months: ['Bases et vie courante (A1 → A2)', 'Voyager, manger, se repérer (A2)', 'Parler du passé (A2+)', 'Imparfait, futur, impératif (B1)', 'Pronoms, subjonctif, opinion (B1)', 'Travail, hypothèses, débats (B1+)'] },
  de: { from: 'B2 rouillé', to: 'B2 solide, début de C1',
    months: ['Réactivation express (B1)', 'Grammaire du B1 au B2', 'Structures du B2', 'Style et argumentation (B2+)', 'Monde professionnel et société (B2+)', 'Nuances et registres (C1)'] },
  en: { from: 'B2', to: 'C1 installé',
    months: ['Temps et structures (B2)', 'Conditionnels, modaux, discours indirect (B2)', 'Structures avancées (B2+)', 'Fluidité et idiomes (C1)', 'Registres et argumentation (C1)', 'Nuance et naturel (C1)'] },
  ru: { from: 'A0', to: 'A1 solide, début de A2',
    months: ['Alphabet et premiers mots (A0)', 'Les verbes et le lieu (A1)', 'Se déplacer, acheter, manger (A1)', 'Passé, futur, datif (A2)', 'Instrumental, adjectifs, aspect (A2)', 'Impératif, conditionnel, voyage (A2)'] }
};

var CUR = {};
CUR.es = [
  ['Prononciation et salutations', 'A1', 'Pronunciation of the Spanish alphabet and letters j/g/h/ll/ñ/z, greetings, introducing yourself and others, polite phrases.', { rules: [0], core: 1, sit: 'rencontre' }],
  ['Chiffres, heure et jours', 'A1', 'Numbers 0-100, days of the week, telling the time, ayer/hoy/mañana.', { core: 2 }],
  ['Ser, estar et présent régulier', 'A1', 'ser vs estar, regular present of -ar/-er/-ir verbs, negation (no, nada, nadie, nunca, tampoco).', { conj: ['pres'], verbs: [0, 1, 2, 3, 4], rules: [1], q: [4, 5, 15], core: 3 }],
  ['Famille et description', 'A1', 'Family members, physical and personality adjectives, agreement of adjectives, hair and eye colors.', { rules: [7], q: [13], core: 4, sit: 'rencontre' }],
  ['Maison, lieux et directions', 'A1', 'Rooms and furniture, places in town, directions (izquierda, derecha, todo recto), hay vs estar.', { rules: [2], q: [12], core: 5, sit: 'voyage' }],
  ['Repas, restaurant et goûts', 'A2', 'Meals, restaurant vocabulary, ordering, gustar and similar verbs (encantar, interesar, molestar).', { rules: [3], q: [9], core: 6, sit: 'restaurant' }],
  ['Voyager : aéroport et hôtel', 'A2', 'Airport, transport, hotel, booking; ir a / tener que / poder / querer + infinitive.', { conj: ['pres'], verbs: [5, 6, 8, 9], rules: [5], core: 7, sit: 'voyage' }],
  ['Vêtements, couleurs et météo', 'A2', 'Clothes, colors, shopping, weather expressions, seasons.', { core: 8, sit: 'supermarche' }],
  ['Routine, corps et mois', 'A2', 'Daily routine, reflexive verbs, body parts, health (me duele...), months of the year.', { rules: [6], core: 9 }],
  ['Passé composé (perfecto)', 'A2', 'Pretérito perfecto: haber + participle, irregular participles, time markers hoy/esta semana/ya/todavía no.', { conj: ['perf'], rules: [4], q: [7] }],
  ['Passé simple régulier (indefinido)', 'A2', 'Pretérito indefinido of regular verbs, time markers ayer/anoche/el año pasado.', { conj: ['past'], verbs: [0, 1, 2] }],
  ['Indefinido irrégulier et contrastes', 'A2', 'Irregular indefinido (ser, ir, hacer, tener, estar, poder, querer), perfecto vs indefinido.', { conj: ['past'], verbs: [3, 4, 5, 6, 7, 8, 9], rules: [4], q: [6] }],
  ['Raconter un week-end ou un voyage', 'A2', 'Narrating past events with sequence connectors (primero, luego, después, al final), past-tense dialogue.', { sit: 'voyage' }],
  ['Imparfait : décrire et habitudes', 'B1', 'Imperfecto: regular and irregular (ser, ir, ver), describing the past, habitual actions.', { conj: ['impf'] }],
  ['Imparfait ou indefinido ?', 'B1', 'Narrative contrast between imperfecto and indefinido, background vs events.', { conj: ['impf', 'past'] }],
  ['Futur, projets et conditionnel', 'B1', 'Futuro simple and condicional, expressing plans, polite requests and advice.', { conj: ['fut', 'cond'], rules: [5], q: [8, 10] }],
  ['Impératif et instructions', 'B1', 'Imperative affirmative and negative, giving directions and instructions, tú/usted.', { conj: ['imp'], q: [11] }],
  ['Pronoms compléments', 'B1', 'Direct and indirect object pronouns lo/la/los/las, le/les, placement, se lo.', {}],
  ['Subjonctif présent (1)', 'B1', 'Present subjunctive formation, wishes and requests (quiero que, espero que).', {}],
  ['Subjonctif présent (2)', 'B1', 'Subjunctive after doubt, emotion, impersonal expressions; indicative vs subjunctive.', {}],
  ['Comparer et donner son avis', 'B1', 'Comparatives, superlatives, giving and defending an opinion, agreeing and disagreeing.', {}],
  ['Por et para, prépositions', 'B1', 'por vs para, verbs with prepositions, common prepositional phrases.', {}],
  ['Travail et carrière', 'B1', 'Jobs, HR vocabulary, meetings, interviews, writing a professional email.', { core: 23, sit: 'travail' }],
  ['Hypothèses avec « si »', 'B1', 'Si clauses: real conditions and imperfect subjunctive hypotheses (si tuviera...).', { conj: ['cond'] }],
  ['Actualité, débats et connecteurs', 'B2', 'News vocabulary, connectors for argumentation (sin embargo, por lo tanto), impersonal se and passive.', {}],
  ['Bilan final et conversation libre', 'B1', 'Comprehensive review of A2-B1 topics and free conversation.', {}]
];
CUR.de = [
  ['Articles et genres (réactivation)', 'B1', 'Reactivation: definite/indefinite articles, noun genders and endings, nominative/accusative.', { rules: [0, 1], q: [0, 3, 4, 5, 20, 21], sit: 'rencontre' }],
  ['Datif et prépositions', 'B1', 'Dative case, prepositions with accusative/dative, two-way prepositions (wo/wohin).', { rules: [2], q: [1, 6, 7, 8, 9], sit: 'voyage' }],
  ['Présent, verbes forts et modaux', 'B1', 'Present tense, strong verbs, modal verbs (können, müssen, wollen, dürfen, sollen, mögen).', { conj: ['pres'], sit: 'restaurant' }],
  ['Perfekt (haben/sein)', 'B1', 'Perfect tense with haben/sein, participles of weak/strong/separable verbs, talking about last weekend.', { conj: ['perf'], rules: [4], q: [10, 11] }],
  ['Ordre des mots et subordonnées', 'B1', 'Word order: verb second, subordinate clauses (weil, dass, wenn, ob, obwohl), separable verbs.', { rules: [3], q: [12, 13] }],
  ['Prétérit et récit', 'B1', 'Preterite for narration (written German), sein/haben/modals in preterite, storytelling connectors.', { conj: ['prat'] }],
  ['Adjectifs : déclinaison', 'B1', 'Adjective endings after definite, indefinite articles and without articles.', { rules: [6], q: [17, 18] }],
  ['Génitif et noms faibles', 'B2', 'Genitive case, genitive prepositions (wegen, trotz, während), n-declension nouns.', { rules: [5], q: [2, 14, 15] }],
  ['Konjunktiv II : politesse et hypothèses', 'B2', 'Konjunktiv II: wäre, hätte, würde, könnte; polite requests, wishes, irreal conditions.', { conj: ['konj'], rules: [7], q: [16], sit: 'restaurant' }],
  ['Passif', 'B2', 'Vorgangspassiv and Zustandspassiv, passive with modals, passive alternatives (man, sich lassen).', {}],
  ['Propositions relatives', 'B2', 'Relative clauses and relative pronouns in all cases, with prepositions.', {}],
  ['Constructions infinitives', 'B2', 'um…zu, ohne…zu, (an)statt…zu, zu + infinitive, haben/sein + zu.', {}],
  ['Verbes à préposition', 'B2', 'Verb + preposition combinations (warten auf, sich freuen über, denken an), da- and wo- compounds.', {}],
  ['Connecteurs et adverbes', 'B2', 'Connectors and adverbs: deshalb, trotzdem, außerdem, dennoch, zwar…aber, entweder…oder.', {}],
  ['Discours indirect (Konjunktiv I)', 'B2', 'Reported speech and Konjunktiv I, news reporting style.', {}],
  ['Participes et style nominal', 'B2', 'Participial constructions, Nominalstil vs Verbalstil, formal writing.', {}],
  ['Argumenter et débattre', 'B2', 'Expressing opinions, structuring arguments, agreeing/disagreeing, concession.', { sit: 'rencontre' }],
  ['Candidature et e-mails formels', 'B2', 'Formal letters and emails, applications, CV vocabulary, polite formulas.', { sit: 'travail' }],
  ['Réunions et négociation', 'B2', 'Meetings, negotiation language, proposals, minutes.', { sit: 'travail' }],
  ['Médias et société', 'B2', 'Media, politics, society vocabulary, discussing current events.', {}],
  ['Sciences, environnement, économie', 'C1', 'Abstract vocabulary: environment, technology, economy; describing graphs and trends.', {}],
  ['Expressions idiomatiques', 'C1', 'Idioms, fixed expressions, proverbs, colloquial German.', {}],
  ['Registres de langue', 'C1', 'Formal vs informal register, Umgangssprache, regional variants (Austria, Switzerland).', {}],
  ['Compréhension écrite C1', 'C1', 'Reading press articles, summarizing, vocabulary in context, cohesion.', {}],
  ['Expression orale : présenter et résumer', 'C1', 'Giving presentations, summarizing texts and talks, transitions, structuring speech.', {}],
  ['Bilan final B2 solide / C1', 'C1', 'Comprehensive review and free conversation.', {}]
];
CUR.en = [
  ['Révision des temps', 'B2', 'Review of all main tenses with error correction and register.', { conj: ['pres', 'past', 'perf'] }],
  ['Present perfect et prétérit', 'B2', 'Present perfect vs past simple, duration (for/since), recent events, experience.', { rules: [1], q: [0, 1, 15], conj: ['perf'] }],
  ['Temps du récit', 'B2', 'Narrative tenses: past simple, past continuous, past perfect, used to / would.', { rules: [5] }],
  ['Futur et projets', 'B2', 'Future forms: will, going to, present continuous, future continuous/perfect.', { conj: ['fut'] }],
  ['Conditionnels', 'B2', 'Zero to third conditionals and mixed conditionals, unless/as long as/provided.', { conj: ['cond'], rules: [2], q: [5, 6] }],
  ['Wish, if only, regrets', 'B2', 'wish/if only with past simple, past perfect and would; regrets and complaints.', { rules: [3], q: [7] }],
  ['Déduction et modaux au passé', 'B2', 'Modals of deduction and past modals: must have, can’t have, should have.', { rules: [4], q: [8] }],
  ['Discours indirect', 'B2', 'Reported speech, backshift, reporting verbs (suggest, admit, deny, warn).', { rules: [6], q: [10] }],
  ['Passif et causatif', 'B2', 'Passive forms, have/get something done, passive reporting structures.', {}],
  ['Propositions relatives', 'B2', 'Defining and non-defining relative clauses, reduced relatives.', {}],
  ['Articles et déterminants', 'B2', 'Articles, quantifiers, countable/uncountable nouns, common French-speaker errors.', { rules: [0, 7], q: [2, 3, 4, 11, 14] }],
  ['Gérondif et infinitif', 'B2', 'Verb patterns: gerund vs infinitive, used to / be used to / get used to.', { rules: [5], q: [9, 12] }],
  ['Connecteurs et fluidité', 'C1', 'Discourse markers, hedging, buying time, rephrasing to sound fluent.', { rules: [8], q: [13] }],
  ['Collocations du monde du travail', 'C1', 'Work collocations and idioms: meet a deadline, take the initiative, step down.', { sit: 'travail' }],
  ['Idiomes : opinions et émotions', 'C1', 'Idioms about feelings and opinions, common phrasal verbs.', {}],
  ['Phrasal verbs professionnels', 'C1', 'Business phrasal verbs: follow up, carry out, set up, roll out, bring forward.', { sit: 'travail' }],
  ['Inversion et mise en relief', 'C1', 'Negative inversion, cleft sentences, emphasis.', {}],
  ['Registre formel : e-mails et rapports', 'C1', 'Formal register, email conventions, report writing.', { sit: 'travail' }],
  ['Débattre et argumenter', 'C1', 'Debating, concession, counter-arguments, persuasive structures.', { sit: 'rencontre' }],
  ['Réunions et négociation', 'C1', 'Meetings, negotiating, proposing, diplomatic language.', { sit: 'travail' }],
  ['Actualité et médias', 'C1', 'News and media vocabulary, discussing current events.', {}],
  ['Vocabulaire académique et abstrait', 'C1', 'Academic word list, abstract nouns, nominalization.', {}],
  ['Nuance : atténuer et renforcer', 'C1', 'Understatement, hedging, intensifiers, tentative language.', {}],
  ['Prononciation et rythme', 'C1', 'Stress, connected speech, intonation, schwa, common mispronounced words for French speakers.', {}],
  ['Raconter et faire de l’humour', 'C1', 'Storytelling, anecdotes, humor, irony, native-like reactions.', { sit: 'rencontre' }],
  ['Bilan final C1', 'C1', 'Comprehensive review and free conversation.', {}]
];
CUR.ru = [
  ['Alphabet (1) : premières lettres', 'A0', 'First half of the Cyrillic alphabet, reading simple words.', { alpha: 1 }],
  ['Alphabet (2) : sons et lecture', 'A0', 'Rest of the alphabet, ы ъ ь, reading and stress, basic greetings.', { alpha: 2, q: [0, 1, 2], rules: [6] }],
  ['Se présenter', 'A0', 'я, ты, вы; меня зовут; no verb to be in present; nationality and city.', { rules: [0, 2], sit: 'rencontre' }],
  ['Nombres, âge et heure', 'A0', 'Numbers 0-100, age, telling the time, days of the week.', {}],
  ['Genre et pluriel des noms', 'A1', 'Noun gender and basic plurals, это, adjectives intro.', { rules: [1], q: [4, 5] }],
  ['Verbes : 1re conjugaison', 'A1', 'Present tense of -ать/-ять verbs (работать, читать, делать).', { conj: ['pres'], verbs: [0, 3] }],
  ['Verbes : 2e conjugaison et négation', 'A1', 'Present tense of -ить verbs (говорить, жить), negation не, нет.', { conj: ['pres'], verbs: [1, 2] }],
  ['Le lieu : в et на', 'A1', 'Prepositional case for location with в and на, cities and countries.', { rules: [4], q: [7] }],
  ['Famille et « у меня есть »', 'A1', 'Family vocabulary, possession with у меня есть, genitive after нет.', { rules: [2], q: [8, 12], sit: 'rencontre' }],
  ['Accusatif et directions', 'A1', 'Accusative case for direct objects and direction (в Москву), asking the way.', { rules: [3], sit: 'voyage' }],
  ['Courses et prix', 'A1', 'Food, shopping, prices, quantities, asking how much.', { sit: 'supermarche' }],
  ['Au restaurant', 'A1', 'Restaurant vocabulary, ordering, polite phrases.', { sit: 'restaurant' }],
  ['Aller : идти et ехать', 'A1', 'Verbs of motion идти/ехать, transport, travelling.', { conj: ['pres'], verbs: [4], sit: 'voyage' }],
  ['Le passé', 'A2', 'Past tense with gender agreement; talking about yesterday.', { conj: ['past'], q: [10] }],
  ['Le futur', 'A2', 'Future with быть + infinitive; plans.', { conj: ['fut'], q: [9] }],
  ['Datif : мне нравится, мне нужно', 'A2', 'Dative case, expressing likes and needs, age.', { q: [13] }],
  ['Quantités et génitif pluriel', 'A2', 'Numbers with nouns, quantities, genitive plural basics.', {}],
  ['Instrumental', 'A2', 'Instrumental case: with (с), professions, instruments.', {}],
  ['Adjectifs et description', 'A2', 'Adjective agreement, describing people, objects, places.', {}],
  ['Aspect : introduction', 'A2', 'Imperfective vs perfective: делать/сделать, читать/прочитать.', { rules: [5] }],
  ['Travail et bureau', 'A2', 'Work vocabulary, schedule, simple emails.', { sit: 'travail' }],
  ['Impératif et politesse', 'A2', 'Imperative, polite requests, formal vs informal.', { conj: ['imp'], q: [11], rules: [6] }],
  ['Conditionnel et souhaits', 'A2', 'Conditional with бы, wishes and polite requests.', { conj: ['cond'] }],
  ['Météo, saisons et dates', 'A2', 'Weather, seasons, months, dates.', {}],
  ['Voyage et logement', 'A2', 'Hotel, tickets, directions, solving problems.', { sit: 'voyage' }],
  ['Bilan A1-A2', 'A2', 'Review and free conversation.', {}]
];

/* ----- imparfait espagnol (absent des tables de base) ----- */
(function () {
  var M = {
    hablar: ['hablaba', 'hablabas', 'hablaba', 'hablábamos', 'hablabais', 'hablaban'],
    comer: ['comía', 'comías', 'comía', 'comíamos', 'comíais', 'comían'],
    vivir: ['vivía', 'vivías', 'vivía', 'vivíamos', 'vivíais', 'vivían'],
    ser: ['era', 'eras', 'era', 'éramos', 'erais', 'eran'],
    estar: ['estaba', 'estabas', 'estaba', 'estábamos', 'estabais', 'estaban'],
    ir: ['iba', 'ibas', 'iba', 'íbamos', 'ibais', 'iban'],
    tener: ['tenía', 'tenías', 'tenía', 'teníamos', 'teníais', 'tenían'],
    hacer: ['hacía', 'hacías', 'hacía', 'hacíamos', 'hacíais', 'hacían'],
    querer: ['quería', 'querías', 'quería', 'queríamos', 'queríais', 'querían'],
    poder: ['podía', 'podías', 'podía', 'podíamos', 'podíais', 'podían']
  };
  D.es.verbs.forEach(function (v) { v.t.impf = M[v.inf]; });
  D.es.tenses.splice(3, 0, { k: 'impf', fr: 'Imparfait', sub: 'imperfecto', rows: P.es,
    tip: 'Pour décrire, pour les habitudes passées et le décor d’une histoire. -ar : -aba ; -er / -ir : -ía. Seuls ser, ir et ver sont irréguliers.' });
})();

/* ----- contenu issu du manuel d'espagnol (corrigé) ----- */
function vb(s) {
  return s.split(';').map(function (x) { return x.trim(); }).filter(Boolean).map(function (x) {
    var p = x.split('='); return [p[0].trim(), p[1].trim()];
  });
}
var ESCORE = {
  1: {
    vocab: vb('Hola=Salut ; Buenos días=Bonjour (le matin) ; Buenas tardes=Bonjour ou bonsoir (après-midi, soirée) ; Buenas noches=Bonsoir tard le soir, bonne nuit ; ¿Cómo estás?=Comment vas-tu ? ; ¿Qué tal?=Ça va ? ; ¿Cómo está usted?=Comment allez-vous ? ; Estoy muy bien, ¿y tú?=Je vais très bien, et toi ? ; Gracias=Merci ; De nada=De rien ; Por favor=S’il vous plaît ; Perdón=Pardon ; Adiós=Au revoir ; Hasta pronto=À bientôt ; Hasta la próxima=À la prochaine ; Mucho gusto=Enchanté ; ¿Cómo te llamas?=Comment t’appelles-tu ? ; Me llamo Ana=Je m’appelle Ana ; Soy de Francia=Je viens de France ; Lo siento=Je suis désolé').map(function (x) { return [x[0], x[1].replace(/ $/, '')]; }),
    phrases: vb('Quiero presentarte a mi colega Juan.=Je veux te présenter mon collègue Juan. ; Les presento a nuestra nueva directora.=Je vous présente notre nouvelle directrice. ; Mi nombre es Ana López y trabajo en logística.=Je m’appelle Ana López et je travaille dans la logistique. ; ¿Puede repetir, por favor?=Pouvez-vous répéter, s’il vous plaît ? ; No entiendo muy bien.=Je ne comprends pas très bien. ; Gracias por su tiempo.=Merci pour votre temps.'),
    note: 'L’espagnol s’écrit comme il se prononce. À retenir : h est muet ; j se prononce comme un h aspiré (Juan = « Houan ») ; g devant e / i aussi (general = « henéral ») ; ll ≈ « y » ; ñ = « gn » ; v ≈ b ; z se prononce « s » en Amérique latine et comme un « th » anglais dans le centre et le nord de l’Espagne. Tu = amical, usted = formel.'
  },
  2: {
    vocab: vb('uno=un ; dos=deux ; tres=trois ; cuatro=quatre ; cinco=cinq ; seis=six ; siete=sept ; ocho=huit ; nueve=neuf ; diez=dix ; once=onze ; doce=douze ; quince=quinze ; veinte=vingt ; treinta=trente ; cincuenta=cinquante ; cien=cent ; mil=mille ; lunes=lundi ; martes=mardi ; miércoles=mercredi ; jueves=jeudi ; viernes=vendredi ; sábado=samedi ; domingo=dimanche ; ayer=hier ; hoy=aujourd’hui ; mañana=demain ; ¿Qué hora es?=Quelle heure est-il ? ; Es la una=Il est une heure'),
    phrases: vb('Hoy es martes.=Aujourd’hui, c’est mardi. ; Mi cumpleaños es un sábado.=Mon anniversaire est un samedi. ; Son las tres menos cuarto.=Il est trois heures moins le quart. ; Son las dos y diez.=Il est deux heures dix. ; Mañana es lunes.=Demain, c’est lundi. ; Ayer fue domingo.=Hier, c’était dimanche.'),
    note: 'De 21 à 29 les nombres sont collés (veintiuno, veintidós…), à partir de 30 on sépare avec « y » (treinta y uno). On dit Es la una pour 1 h, mais Son las dos, tres… pour les autres heures. Pour les minutes : Son las dos y diez, Son las tres menos cuarto.'
  },
  3: {
    vocab: vb('yo=je ; tú=tu ; él=il ; ella=elle ; nosotros=nous ; vosotros=vous (pluriel, amical, Espagne) ; ustedes=vous (pluriel, formel) ; ellos=ils ; hablar=parler ; comer=manger ; vivir=vivre, habiter ; trabajar=travailler ; beber=boire ; abrir=ouvrir ; estudiar=étudier ; escribir=écrire ; leer=lire ; no=ne… pas, non ; nada=rien ; nadie=personne ; nunca=jamais ; tampoco=non plus ; soy=je suis (identité) ; estoy=je suis (lieu, état)'),
    phrases: vb('Yo hablo español.=Je parle espagnol. ; Ella no come carne.=Elle ne mange pas de viande. ; Yo vivo en París.=J’habite à Paris. ; Soy estudiante y estoy en clase.=Je suis étudiant et je suis en classe. ; Nadie está en casa.=Personne n’est à la maison. ; No tengo nada.=Je n’ai rien.'),
    note: 'Ser pour l’identité, l’origine, la profession et les traits permanents ; estar pour le lieu et les états passagers. Négation : « no » devant le verbe (Yo no hablo inglés). Avec nunca, nadie, nada après le verbe, on garde « no » : No tengo nada.'
  },
  4: {
    vocab: vb('el abuelo=le grand-père ; la abuela=la grand-mère ; el padre=le père ; la madre=la mère ; el hermano=le frère ; la hermana=la sœur ; el hijo=le fils ; la hija=la fille (enfant) ; el tío=l’oncle ; la tía=la tante ; el primo=le cousin ; la prima=la cousine ; el sobrino=le neveu ; la sobrina=la nièce ; el amigo=l’ami ; el novio=le petit ami ; la novia=la petite amie ; el compañero=le camarade ; alto=grand ; bajo=petit ; delgado=mince ; gordo=gros ; guapo=beau ; feo=laid ; joven=jeune ; viejo=vieux ; simpático=sympathique ; serio=sérieux ; tímido=timide ; trabajador=travailleur ; perezoso=paresseux ; divertido=drôle ; generoso=généreux ; tranquilo=calme ; hablador=bavard ; rubio=blond ; castaño=châtain ; pelirrojo=roux'),
    phrases: vb('Mi hermano se llama Juan.=Mon frère s’appelle Juan. ; Mi prima es amable.=Ma cousine est gentille. ; Ella tiene el pelo largo.=Elle a les cheveux longs. ; Él tiene los ojos marrones.=Il a les yeux marron. ; Mi amiga es simpática y trabajadora.=Mon amie est sympathique et travailleuse. ; Él es muy divertido pero un poco perezoso.=Il est très drôle mais un peu paresseux.'),
    note: 'L’adjectif s’accorde en genre et en nombre et se place en général après le nom : una casa bonita. Attention : « hijo / hija » = fils / fille (enfant) ; « chico / chica » = garçon / fille (jeune).'
  },
  5: {
    vocab: vb('el salón=le salon ; el dormitorio=la chambre ; la cocina=la cuisine ; el baño=la salle de bain ; el jardín=le jardin ; el balcón=le balcon ; el pasillo=le couloir ; el garaje=le garage ; la mesa=la table ; la silla=la chaise ; la cama=le lit ; el armario=l’armoire ; el sofá=le canapé ; la alfombra=le tapis ; la lámpara=la lampe ; el horno=le four ; la nevera=le frigo (Espagne) ; a la izquierda=à gauche ; a la derecha=à droite ; todo recto=tout droit ; delante de=devant ; detrás de=derrière ; cerca de=près de ; lejos de=loin de ; arriba=en haut ; abajo=en bas ; la escuela=l’école ; el mercado=le marché ; el parque=le parc ; la calle=la rue ; el hospital=l’hôpital ; la estación=la gare ; el aeropuerto=l’aéroport ; el supermercado=le supermarché'),
    phrases: vb('La cama está en el dormitorio.=Le lit est dans la chambre. ; Hay una lámpara sobre la mesa.=Il y a une lampe sur la table. ; Gira a la izquierda.=Tourne à gauche. ; La farmacia está delante del banco.=La pharmacie est devant la banque. ; El mercado está a la derecha.=Le marché est à droite. ; El hospital está detrás de la estación.=L’hôpital est derrière la gare.'),
    note: 'Hay = il y a (quelque chose d’indéfini) ; estar situe quelque chose de connu. Contractions : de + el = del, a + el = al (delante del banco). En Amérique latine, le frigo se dit plutôt « el refrigerador ».'
  },
  6: {
    vocab: vb('el desayuno=le petit-déjeuner ; el almuerzo=le déjeuner ; la merienda=le goûter ; la cena=le dîner ; el camarero=le serveur ; la carta=la carte, le menu ; el primer plato=l’entrée ; el plato principal=le plat principal ; el postre=le dessert ; la cuenta=l’addition ; el vaso=le verre ; el plato=l’assiette ; el tenedor=la fourchette ; el cuchillo=le couteau ; la cuchara=la cuillère ; el agua sin gas=l’eau plate ; el vino tinto=le vin rouge ; el vino blanco=le vin blanc ; la cerveza=la bière ; la ensalada=la salade ; la carne=la viande ; el pescado=le poisson ; el arroz=le riz ; me gusta=j’aime (ça me plaît) ; me encanta=j’adore ; me interesa=ça m’intéresse ; me molesta=ça me dérange ; quisiera=je voudrais'),
    phrases: vb('Una mesa para dos, por favor.=Une table pour deux, s’il vous plaît. ; Quisiera pedir la especialidad de la casa.=Je voudrais commander la spécialité de la maison. ; ¿Tienen postres caseros?=Avez-vous des desserts maison ? ; Me gusta el café.=J’aime le café. ; Me gustan los libros.=J’aime les livres. ; Nos encanta viajar.=Nous adorons voyager.'),
    dialogue: [
      { w: 'Cliente', t: 'Buenas tardes, ¿tienen mesa libre?', f: 'Bonsoir, avez-vous une table libre ?' },
      { w: 'Camarero', t: 'Sí, por aquí. ¿Qué desea tomar?', f: 'Oui, par ici. Que désirez-vous prendre ?' },
      { w: 'Cliente', t: 'Quisiera una sopa y luego una ensalada.', f: 'Je voudrais une soupe, puis une salade.' },
      { w: 'Camarero', t: 'Perfecto. ¿Para beber?', f: 'Parfait. Et pour boire ?' },
      { w: 'Cliente', t: 'Un agua, por favor.', f: 'Une eau, s’il vous plaît.' }
    ],
    note: 'Gustar = « plaire » : le verbe s’accorde avec ce qui plaît. Me gusta el café (singulier), me gustan los libros (pluriel), me gusta viajar (verbe). Même construction : encantar, interesar, molestar.'
  },
  7: {
    vocab: vb('el aeropuerto=l’aéroport ; el avión=l’avion ; el vuelo=le vol ; el billete=le billet (Espagne) ; la facturación=l’enregistrement ; la puerta de embarque=la porte d’embarquement ; el retraso=le retard ; el taxi=le taxi ; el tren=le train ; el metro=le métro ; el autobús=le bus ; la reserva=la réservation ; la habitación individual=la chambre simple ; la habitación doble=la chambre double ; la llave=la clé ; el ascensor=l’ascenseur ; la recepción=la réception ; la factura=la facture ; ir a=aller (+ infinitif) ; tener que=devoir (+ infinitif) ; poder=pouvoir ; querer=vouloir ; quisiera registrarme=je voudrais m’enregistrer'),
    phrases: vb('¿A qué hora sale el vuelo a Barcelona?=À quelle heure part le vol pour Barcelone ? ; ¿Dónde está la puerta de embarque?=Où est la porte d’embarquement ? ; Necesito un billete de ida y vuelta.=J’ai besoin d’un billet aller-retour. ; Quisiera una habitación doble con baño.=Je voudrais une chambre double avec salle de bain. ; ¿Tiene servicio de lavandería?=Avez-vous un service de blanchisserie ? ; Nuestro vuelo tiene un retraso de treinta minutos.=Notre vol a trente minutes de retard.'),
    note: 'Pour parler d’un projet proche : ir a + infinitif (Voy a viajar mañana). Pour demander poliment : Quisiera… (conditionnel de politesse). Attention : « billete » en Espagne, « boleto » en Amérique latine.'
  },
  8: {
    vocab: vb('rojo=rouge ; azul=bleu ; verde=vert ; amarillo=jaune ; negro=noir ; blanco=blanc ; gris=gris ; marrón=marron ; rosa=rose ; morado=violet ; naranja=orange ; el pantalón=le pantalon ; la camisa=la chemise ; la camiseta=le tee-shirt ; el vestido=la robe ; la falda=la jupe ; el abrigo=le manteau ; los zapatos=les chaussures ; los calcetines=les chaussettes ; el sombrero=le chapeau ; el cinturón=la ceinture ; las gafas=les lunettes ; hace calor=il fait chaud ; hace frío=il fait froid ; hace sol=il y a du soleil ; hace viento=il y a du vent ; llueve=il pleut ; nieva=il neige ; está nublado=le ciel est couvert ; hay niebla=il y a du brouillard ; hay tormenta=il y a un orage ; el invierno=l’hiver ; la primavera=le printemps ; el verano=l’été ; el otoño=l’automne'),
    phrases: vb('Llevo una camisa blanca.=Je porte une chemise blanche. ; Le gustan los zapatos rojos.=Elle aime les chaussures rouges. ; Hoy hace mucho calor.=Aujourd’hui, il fait très chaud. ; En invierno nieva mucho en España.=En hiver, il neige beaucoup en Espagne. ; Está lloviendo.=Il est en train de pleuvoir. ; Tengo un abrigo negro y un pantalón gris.=J’ai un manteau noir et un pantalon gris.'),
    note: 'Les couleurs s’accordent avec le nom : un pantalón negro, unas faldas rojas. Pour la météo, on utilise « hacer » (hace calor, hace frío) ; llover et nevar se conjuguent seulement à la 3e personne : llueve, nieva.'
  },
  9: {
    vocab: vb('levantarse=se lever ; ducharse=se doucher ; desayunar=prendre le petit-déjeuner ; ir al trabajo=aller au travail ; volver a casa=rentrer à la maison ; cenar=dîner ; acostarse=se coucher ; por la mañana=le matin ; por la tarde=l’après-midi ; por la noche=le soir, la nuit ; la cabeza=la tête ; los ojos=les yeux ; la nariz=le nez ; la boca=la bouche ; la oreja=l’oreille ; los dientes=les dents ; el brazo=le bras ; la mano=la main ; la pierna=la jambe ; el pie=le pied ; la espalda=le dos ; el corazón=le cœur ; me duele la cabeza=j’ai mal à la tête ; enero=janvier ; febrero=février ; marzo=mars ; abril=avril ; mayo=mai ; junio=juin ; julio=juillet ; agosto=août ; septiembre=septembre ; octubre=octobre ; noviembre=novembre ; diciembre=décembre'),
    phrases: vb('Me levanto a las siete.=Je me lève à sept heures. ; Desayuno a las siete y media.=Je prends mon petit-déjeuner à sept heures et demie. ; Me duele la espalda.=J’ai mal au dos. ; Me duele la cabeza.=J’ai mal à la tête. ; Estamos en abril.=Nous sommes en avril. ; Cenamos juntos a las ocho.=Nous dînons ensemble à vingt heures.'),
    note: 'Verbes pronominaux : me levanto, te levantas, se levanta… Le pronom se place devant le verbe. Pour la douleur : me duele + partie du corps (singulier), me duelen + pluriel (me duelen los pies). Les mois ne prennent pas de majuscule en espagnol.'
  },
  23: {
    vocab: vb('el director=le directeur ; la directora=la directrice ; el responsable de Recursos Humanos=le responsable RH ; el empleado=l’employé ; el gerente=le manager ; el becario=le stagiaire ; el colaborador=le collaborateur ; el reclutador=le recruteur ; el candidato=le candidat ; el consultor=le consultant ; reclutar=recruter ; formar=former ; evaluar=évaluer ; planificar=planifier ; organizar=organiser ; redactar un informe=rédiger un rapport ; preparar una entrevista=préparer un entretien ; gestionar conflictos=gérer les conflits ; la reunión=la réunion ; el orden del día=l’ordre du jour ; presentar un proyecto=présenter un projet ; discutir=discuter ; decidir=décider ; el informe=le rapport ; la retroalimentación=le feedback ; la prioridad=la priorité'),
    phrases: vb('Estamos reclutando nuevos talentos.=Nous recrutons de nouveaux talents. ; Evaluamos el desempeño del personal cada trimestre.=Nous évaluons la performance du personnel chaque trimestre. ; Hoy voy a presentar el proyecto de expansión.=Aujourd’hui, je vais présenter le projet d’expansion. ; ¿Qué opinas sobre este plan?=Que penses-tu de ce plan ? ; ¿Cuál es la prioridad esta semana?=Quelle est la priorité cette semaine ? ; Adjunto el informe de desempeño de este mes.=Je joins le rapport de performance de ce mois.'),
    note: 'En contexte professionnel on utilise « usted / ustedes » pour vouvoyer (Les envío el documento que solicitaron). Avec des collègues proches, « tú » en Espagne et « vosotros » entre amis. Formule utile : Quedo a su disposición.'
  }
};
