# DSA: en interaktiv, visuel implementering af A*-algoritmen
![placeholder, insert correct screenshot](ss.png)
![placeholder, insert correct screenshot](ss2.png)

## udarbejdet af:
Morten Gislund og Jacob Tobias Kristensen

## beskrivelse:
dette er en visualisering af A*-algoritmen i et 2D grid.
Det er muligt selv at vælge start og goal node, samt at tilføje vægge i form af forhindringer. 
Slideren over gridet kan justere hastigheden af visualiseringen.
Algoritmen finder den korteste vej fra start node med farven `#6b8e23` til mål noden med farven  `#f08080`.  Algoritmen søger aktivt fra den nuværende node og beregner omkostningen for hver af dens naboer frem mod mål-noden. disse naboer i det åbne set visualiseres i gul (`#ffff00`), når næste step starter skifter de evaluerede naboer farve til lysegul (`#ffffe0`), og nye naboer tilføjes og evalueres. Hvis algoritmen ikke finder en vej til mål cellen returneres et tomt array. dette er ikke visualiseret. hvis algoritmen finder en vej til mål-cellen farves denne sti grøn (`#008000`)

### Sådan kører du det lokalt:

1. klon dette repository
2. åbn mappen i dit foretrukne IDE
3. sørg for at have en live server extension installeret
4. start live server på index.html
5. følg anvisningerne på skærmen



## this code is live at:
[This Awesome Site, Github Pages(insert correct link)](https//github.com/)
