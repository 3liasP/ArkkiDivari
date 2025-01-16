# Näkymät

## Johdettavat tiedot
- Tilauksen kokonaispaino ja jakaminen painoluokittain
- Tilauksessa olevien niteiden kokonaishinta
- Tilauksen postituksen kustannukset
- Tilauksen kokonaishinta (niteiden ja postituksen yhteishinta)


## Raporttien näkymät

### Raportti R1

Haku kohdistuu suoraan Books-tauluun, joten haussa käytettyä tietoa ei tarvitse varsinaisesti johtaa.

### Raportti R2

Raportti voidaan esittää tietokantakaaviona seuraavasti:

R2(genre, totalSoldPrice, averagePrice)

Genre (luokka) saadaan suoraan Books-taulusta. TotalSoldPrice johdetaan luokkakohtaisesti kaikkien saman luokan niteille laskemalla näiden kokonaismyyntihinta summaamalla kaikkien luokan niteiden attribuutti price. AveragePrice voidaan johtaa totalSoldPrice attribuutin perusteella jakamalla se luokassa olevien niteiden kokonaismäärällä.

### Raportti R3

Raportti voidaan esittää tietokantakaaviona seuraavasti:

R3(usersName, boughtBooksCount)

Käyttäjänimet saadaan suoraan Users-taulusta. Teemme haun Order-tauluun ryhmitellen käyttäjänimen perusteella ja rajaten hakutulokset viime vuoden ajalta. Viime vuosi voidaan johtaa nykyisestä vuodesta vähentämällä siitä yksi (ei kiinnitetä). Asiakkaan ostamat niteet saadaan Order-taulusta ja lopuksi kaikkien niteiden summa voidaan laskea asiakaskohtaisesti. Hakua voidaan optimoida myöhemmässä vaiheessa eli tässä demonstroidaan esimerkillä, kuinka tulokset on mahdollista johtaa nykyisestä tietokannasta.

### Raportti R4

Raportti R4 on jatkojalostus raporttiin R1, jolloin vakiojärjestys toteutetaan relevanssin perusteella. Tämä voidaan toteuttaa esimerkiksi vektorihaulla tai muulla vastaavalla menetelmällä.