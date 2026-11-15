'use strict';
/* Textes de lecture de secours (utilisés quand l'IA n'est pas disponible).
   TEXTS['langue|niveau'] = liste de { t: titre, x: texte, f: traduction, p: idées clés (français), m: résumé modèle } */
var TEXTS = {};

TEXTS['es|A1'] = [{
  t: 'Mi familia',
  x: 'Me llamo Lucía y vivo en Valencia. Tengo una familia pequeña: mi madre, mi padre y mi hermano Pablo. Mi madre es profesora y trabaja en una escuela. Mi padre es cocinero. Pablo tiene doce años y le gusta el fútbol. Los domingos comemos todos juntos en casa de mi abuela.',
  f: 'Je m’appelle Lucía et j’habite à Valence. J’ai une petite famille : ma mère, mon père et mon frère Pablo. Ma mère est professeure et travaille dans une école. Mon père est cuisinier. Pablo a douze ans et aime le football. Le dimanche, nous mangeons tous ensemble chez ma grand-mère.',
  p: ['Lucía habite à Valence avec une petite famille', 'Sa mère est professeure, son père est cuisinier', 'Le dimanche, ils mangent chez la grand-mère'],
  m: 'Lucía vive en Valencia con su familia. Su madre es profesora, su padre es cocinero y los domingos comen en casa de su abuela.'
}];
TEXTS['es|A2'] = [{
  t: 'Un fin de semana en Madrid',
  x: 'El sábado pasado visité Madrid con mi mejor amiga. Por la mañana fuimos al Museo del Prado y vimos cuadros muy famosos. Después comimos en un restaurante pequeño cerca del Retiro, donde pedí una tortilla de patatas. Por la tarde paseamos por el parque y tomamos un helado. El domingo volvimos a casa en tren, muy cansadas pero contentas.',
  f: 'Samedi dernier, j’ai visité Madrid avec ma meilleure amie. Le matin, nous sommes allées au musée du Prado et nous avons vu des tableaux très célèbres. Ensuite, nous avons déjeuné dans un petit restaurant près du Retiro, où j’ai commandé une tortilla de pommes de terre. L’après-midi, nous nous sommes promenées dans le parc et nous avons pris une glace. Dimanche, nous sommes rentrées en train, très fatiguées mais contentes.',
  p: ['Visite de Madrid un samedi avec une amie', 'Musée du Prado, déjeuner près du Retiro, promenade dans le parc', 'Retour en train le dimanche'],
  m: 'La autora visitó Madrid con una amiga: vieron el Prado, comieron cerca del Retiro, pasearon por el parque y volvieron en tren el domingo.'
}, {
  t: 'Mi rutina diaria',
  x: 'Todos los días me levanto a las siete y desayuno café con tostadas. Voy al trabajo en metro porque no tengo coche. Trabajo en una oficina de recursos humanos y mis compañeros son muy simpáticos. A las dos como en un restaurante cerca de la oficina. Por la tarde atiendo a los candidatos y respondo correos. Cuando llego a casa, cocino algo ligero y leo un poco antes de dormir.',
  f: 'Tous les jours, je me lève à sept heures et je prends un café avec des tartines. Je vais au travail en métro parce que je n’ai pas de voiture. Je travaille dans un bureau de ressources humaines et mes collègues sont très sympathiques. À deux heures, je déjeune dans un restaurant près du bureau. L’après-midi, je reçois les candidats et je réponds aux e-mails. Quand j’arrive à la maison, je cuisine quelque chose de léger et je lis un peu avant de dormir.',
  p: ['Lever à sept heures, métro pour aller au travail', 'Travail dans les ressources humaines : candidats et e-mails', 'Le soir : cuisine légère et lecture'],
  m: 'Se levanta a las siete, va al trabajo en metro, trabaja en recursos humanos y por la noche cocina y lee.'
}];
TEXTS['es|B1'] = [{
  t: 'El turismo en España',
  x: 'España recibe cada año a millones de turistas que buscan sol, playa y buena comida. Sin embargo, muchos visitantes también descubren ciudades históricas y pueblos tranquilos del interior. Algunos vecinos opinan que el turismo masivo hace subir los precios de las viviendas, mientras que otros recuerdan que genera muchos empleos. Creo que las autoridades deberían limitar los pisos turísticos y promover un turismo más sostenible.',
  f: 'L’Espagne reçoit chaque année des millions de touristes qui cherchent le soleil, la plage et la bonne cuisine. Pourtant, beaucoup de visiteurs découvrent aussi des villes historiques et des villages tranquilles de l’intérieur. Certains habitants pensent que le tourisme de masse fait monter le prix des logements, alors que d’autres rappellent qu’il crée beaucoup d’emplois. Je crois que les autorités devraient limiter les logements touristiques et promouvoir un tourisme plus durable.',
  p: ['Des millions de touristes viennent pour le soleil, la plage et la cuisine', 'Le tourisme de masse fait monter les loyers mais crée des emplois', 'L’auteur propose de limiter les logements touristiques'],
  m: 'España recibe muchos turistas; el turismo masivo encarece las viviendas pero crea empleo, y el autor propone limitar los pisos turísticos.'
}];

TEXTS['de|B1'] = [{
  t: 'Mein Arbeitstag',
  x: 'Ich arbeite seit drei Jahren in einem Unternehmen in Straßburg. Normalerweise stehe ich um sechs Uhr auf, weil ich eine Stunde mit dem Zug fahren muss. Im Büro beginnt der Tag mit einer kurzen Besprechung, bei der wir die Aufgaben verteilen. Mittags esse ich oft mit meinen Kollegen in der Kantine. Am Nachmittag schreibe ich E-Mails und telefoniere mit Bewerbern. Nach der Arbeit gehe ich gern spazieren, um den Kopf freizubekommen.',
  f: 'Je travaille depuis trois ans dans une entreprise à Strasbourg. D’habitude, je me lève à six heures parce que je dois prendre le train pendant une heure. Au bureau, la journée commence par une courte réunion où nous répartissons les tâches. À midi, je mange souvent avec mes collègues à la cantine. L’après-midi, j’écris des e-mails et je téléphone à des candidats. Après le travail, j’aime me promener pour me vider la tête.',
  p: ['Lever à six heures et une heure de train', 'Réunion le matin, e-mails et appels aux candidats l’après-midi', 'Promenade après le travail pour se détendre'],
  m: 'Der Autor fährt mit dem Zug zur Arbeit, hat morgens eine Besprechung, schreibt E-Mails, telefoniert mit Bewerbern und geht abends spazieren.'
}];
TEXTS['de|B2'] = [{
  t: 'Homeoffice – Fluch oder Segen?',
  x: 'Seit der Pandemie arbeiten viele Menschen mindestens einen Tag pro Woche von zu Hause aus. Befürworter betonen, dass man Pendelzeit spart und flexibler planen kann. Kritiker dagegen warnen, dass die Grenze zwischen Arbeit und Freizeit verschwimmt und der Kontakt zu den Kollegen verloren geht. Viele Unternehmen setzen deshalb auf ein Mischmodell, bei dem die Mitarbeiter an zwei oder drei Tagen im Büro sind. Entscheidend ist, dass die Regeln klar und für alle verständlich bleiben.',
  f: 'Depuis la pandémie, beaucoup de personnes travaillent au moins un jour par semaine à domicile. Les partisans soulignent qu’on gagne du temps de trajet et qu’on peut s’organiser plus librement. Les critiques avertissent en revanche que la frontière entre travail et loisirs s’estompe et que le contact avec les collègues se perd. De nombreuses entreprises misent donc sur un modèle mixte, où les employés sont au bureau deux ou trois jours. L’essentiel est que les règles restent claires et compréhensibles pour tous.',
  p: ['Beaucoup travaillent à domicile au moins un jour par semaine', 'Avantages : gain de temps et flexibilité ; risques : frontière floue et perte de contact', 'Solution : modèle mixte avec des règles claires'],
  m: 'Das Homeoffice spart Zeit und ist flexibel, kann aber die Grenze zwischen Arbeit und Freizeit verwischen; ein Mischmodell mit klaren Regeln ist eine häufige Lösung.'
}, {
  t: 'Lebenslanges Lernen',
  x: 'In einer Arbeitswelt, die sich ständig verändert, reicht eine einmal erworbene Ausbildung nicht mehr aus. Deshalb bieten immer mehr Betriebe Weiterbildungen an, die während der Arbeitszeit stattfinden. Wer neue Kenntnisse erwirbt, erhöht nicht nur seine Chancen auf dem Arbeitsmarkt, sondern arbeitet oft auch motivierter. Allerdings fehlt vielen Beschäftigten die Zeit, weil Alltag und Familie bereits viel Energie verlangen. Experten fordern daher, dass Weiterbildung ein fester Bestandteil des Arbeitsvertrags sein sollte.',
  f: 'Dans un monde du travail qui change sans cesse, une formation acquise une fois ne suffit plus. C’est pourquoi de plus en plus d’entreprises proposent des formations pendant le temps de travail. Celui qui acquiert de nouvelles connaissances augmente ses chances sur le marché du travail et travaille souvent avec plus de motivation. Mais beaucoup de salariés manquent de temps, car le quotidien et la famille demandent déjà beaucoup d’énergie. Des experts demandent donc que la formation fasse partie intégrante du contrat de travail.',
  p: ['Une formation initiale ne suffit plus', 'Les entreprises proposent des formations pendant le temps de travail', 'Obstacle : le manque de temps ; proposition : l’inscrire au contrat'],
  m: 'Weil sich die Arbeitswelt ändert, ist Weiterbildung wichtig; viele haben jedoch keine Zeit, deshalb soll sie Teil des Arbeitsvertrags werden.'
}];
TEXTS['de|C1'] = [{
  t: 'Digitalisierung und Datenschutz',
  x: 'Die zunehmende Digitalisierung eröffnet Unternehmen ungeahnte Möglichkeiten, wirft jedoch zugleich heikle Fragen des Datenschutzes auf. Während Verbraucher einerseits personalisierte Angebote schätzen, sind sie andererseits kaum bereit, ihre persönlichen Daten preiszugeben. Die Datenschutz-Grundverordnung hat zwar den rechtlichen Rahmen verschärft, doch in der Praxis fehlt es häufig an Transparenz. Kritiker bemängeln, dass Einwilligungen oft per Mausklick erteilt werden, ohne dass die Betroffenen die Tragweite verstehen. Eine nachhaltige Lösung setzt daher voraus, dass Technik, Recht und Aufklärung Hand in Hand gehen.',
  f: 'La numérisation croissante offre aux entreprises des possibilités insoupçonnées, mais soulève en même temps des questions délicates de protection des données. Alors que les consommateurs apprécient d’un côté les offres personnalisées, ils sont de l’autre à peine prêts à livrer leurs données personnelles. Le RGPD a certes durci le cadre juridique, mais en pratique la transparence fait souvent défaut. Les critiques reprochent que les consentements soient souvent donnés d’un clic sans que les personnes concernées comprennent la portée. Une solution durable suppose donc que la technique, le droit et l’information avancent main dans la main.',
  p: ['La numérisation offre des opportunités mais pose des questions de données', 'Les consommateurs veulent des offres personnalisées sans livrer leurs données', 'Le RGPD existe mais le consentement manque de transparence ; il faut technique, droit et information'],
  m: 'Die Digitalisierung bietet Chancen, aber der Datenschutz bleibt problematisch, weil Einwilligungen oft unverstanden erteilt werden; nötig sind Technik, Recht und Aufklärung.'
}];

TEXTS['en|B2'] = [{
  t: 'The rise of remote hiring',
  x: 'More and more companies now interview and hire candidates entirely online. This has widened the talent pool, since employers are no longer limited to people living nearby. However, recruiters admit that it is harder to judge personality through a screen, and some candidates feel less able to ask the questions they would raise in person. To make the process fairer, many firms have introduced structured interviews in which every applicant is asked the same questions. Whether this will become the norm remains to be seen.',
  f: 'De plus en plus d’entreprises reçoivent et recrutent désormais des candidats entièrement en ligne. Cela a élargi le vivier de talents, car les employeurs ne sont plus limités aux personnes qui habitent à proximité. Cependant, les recruteurs reconnaissent qu’il est plus difficile de juger la personnalité à travers un écran, et certains candidats osent moins poser les questions qu’ils poseraient en personne. Pour rendre le processus plus équitable, de nombreuses entreprises ont introduit des entretiens structurés où chaque candidat reçoit les mêmes questions. Reste à savoir si cela deviendra la norme.',
  p: ['Le recrutement en ligne élargit le vivier de talents', 'Il est plus difficile de juger la personnalité et de poser des questions', 'Les entretiens structurés rendent le processus plus équitable'],
  m: 'Online hiring widens the talent pool but makes it harder to judge candidates, so many firms use structured interviews to be fairer.'
}, {
  t: 'Why sleep matters',
  x: 'Although many of us treat sleep as a luxury, researchers have repeatedly shown that it is essential for memory, mood and physical health. People who regularly sleep less than six hours are more likely to make mistakes at work and to fall ill. Experts recommend going to bed at the same time every night and avoiding screens for an hour beforehand. Some companies have even started to offer quiet rooms where staff can rest during the day, an idea that would have seemed strange a decade ago.',
  f: 'Bien que beaucoup d’entre nous considèrent le sommeil comme un luxe, les chercheurs ont montré à maintes reprises qu’il est essentiel pour la mémoire, l’humeur et la santé physique. Les personnes qui dorment régulièrement moins de six heures font plus d’erreurs au travail et tombent plus souvent malades. Les experts recommandent de se coucher à la même heure chaque soir et d’éviter les écrans pendant l’heure qui précède. Certaines entreprises proposent même des salles calmes où le personnel peut se reposer en journée, une idée qui aurait paru étrange il y a dix ans.',
  p: ['Le sommeil est essentiel pour la mémoire, l’humeur et la santé', 'Dormir moins de six heures augmente erreurs et maladies', 'Conseils : heure fixe, pas d’écran ; certaines entreprises ont des salles de repos'],
  m: 'Sleep is vital for memory, mood and health; experts advise regular bedtimes and no screens, and some companies now provide rest rooms.'
}];
TEXTS['en|C1'] = [{
  t: 'The ethics of persuasion',
  x: 'Advertising has always relied on persuasion, but the line between persuading and manipulating is becoming increasingly blurred. Algorithms now predict our moods and tailor messages to exploit our vulnerabilities, often without our noticing. Defenders of the industry argue that consumers remain free to choose and that personalised content is simply more relevant. Critics counter that genuine choice requires transparency, which is precisely what is missing. Whatever one’s position, it is difficult to deny that regulators are struggling to keep pace with the technology.',
  f: 'La publicité a toujours reposé sur la persuasion, mais la frontière entre persuader et manipuler devient de plus en plus floue. Des algorithmes prédisent désormais nos humeurs et adaptent les messages pour exploiter nos failles, souvent à notre insu. Les défenseurs du secteur soutiennent que les consommateurs restent libres de choisir et que le contenu personnalisé est simplement plus pertinent. Les critiques rétorquent qu’un vrai choix exige de la transparence, ce qui fait justement défaut. Quelle que soit sa position, il est difficile de nier que les régulateurs peinent à suivre la technologie.',
  p: ['La frontière entre persuasion et manipulation devient floue', 'Les défenseurs invoquent la liberté de choix et la pertinence ; les critiques, le manque de transparence', 'Les régulateurs ont du mal à suivre la technologie'],
  m: 'Algorithm-driven advertising blurs persuasion and manipulation; supporters stress choice, critics stress missing transparency, and regulators lag behind.'
}];

TEXTS['ru|A0'] = [{
  t: 'Меня зовут Анна',
  x: 'Привет! Меня зовут Анна. Я живу в Париже. Я работаю в офисе. Это мой друг Иван. Он живёт в Москве. Иван любит чай и кофе.',
  f: 'Salut ! Je m’appelle Anna. J’habite à Paris. Je travaille dans un bureau. Voici mon ami Ivan. Il habite à Moscou. Ivan aime le thé et le café.',
  p: ['Anna habite à Paris et travaille dans un bureau', 'Son ami Ivan habite à Moscou', 'Ivan aime le thé et le café'],
  m: 'Анна живёт в Париже. Её друг Иван живёт в Москве.'
}];
TEXTS['ru|A1'] = [{
  t: 'Мой день',
  x: 'Я встаю в семь часов. Утром я пью чай и читаю новости. Потом я еду на работу на метро. На работе я пишу письма и разговариваю с коллегами. Вечером я иду в магазин и покупаю хлеб и молоко. Дома я готовлю ужин и смотрю фильм.',
  f: 'Je me lève à sept heures. Le matin, je bois du thé et je lis les nouvelles. Ensuite, je vais au travail en métro. Au travail, j’écris des lettres et je parle avec mes collègues. Le soir, je vais au magasin et j’achète du pain et du lait. À la maison, je prépare le dîner et je regarde un film.',
  p: ['Le matin : thé, nouvelles, puis métro pour aller au travail', 'Au travail : lettres et discussions avec les collègues', 'Le soir : magasin, dîner et film'],
  m: 'Утром он встаёт и едет на работу, а вечером идёт в магазин и готовит ужин.'
}];
TEXTS['ru|A2'] = [{
  t: 'Выходные в Санкт-Петербурге',
  x: 'В прошлом году мы с другом ездили в Санкт-Петербург. Мы жили в маленькой гостинице рядом с вокзалом. Каждый день мы гуляли по городу и ходили в музеи. Особенно нам понравился Эрмитаж. Вечером мы ужинали в ресторане и пробовали русские блюда. В воскресенье мы вернулись домой на поезде, уставшие, но довольные.',
  f: 'L’année dernière, mon ami et moi sommes allés à Saint-Pétersbourg. Nous avons logé dans un petit hôtel près de la gare. Chaque jour, nous nous sommes promenés en ville et avons visité des musées. Nous avons surtout aimé l’Ermitage. Le soir, nous dînions au restaurant et goûtions des plats russes. Dimanche, nous sommes rentrés en train, fatigués mais contents.',
  p: ['Voyage à Saint-Pétersbourg avec un ami, logés près de la gare', 'Promenades, musées, surtout l’Ermitage, dîners au restaurant', 'Retour en train le dimanche'],
  m: 'Автор с другом ездили в Санкт-Петербург, гуляли по городу, ходили в музеи и вернулись домой на поезде.'
}];
