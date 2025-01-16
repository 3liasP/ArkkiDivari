# Dokumentaatio

## UML-kaavion muunnons tietokantakaavioksi

UML-kaavion perusteella luotiin tietokantaskeema keskustietokantaa varten (central).

Sellers-entiteetistä otettiin central.Scheman pääavaimeksi attribuutti bookId ja vierasavaimeksi attribuutti schemaName. Loput attribuutit lisättiin mukaan. Sellersillä (myyjä) tarkoitetaan yksittäistä keskustietokantaan kuuluvaa divaria.

Books-entiteetin perusteella luotiin central.Books, jonka pääavaimeksi tuli bookId ja vierasavaimeksi sellerId. Loput attribuutit lisättiin muuttamattomina mukaan. Books-taulussa jokainen rivi on yksittäinen nide, jonka yksilöi bookId (UUID). ISBN-attribuutin avulla saadaan rajattua kaikki yksittäisen teoksen niteet. Tällä rajauksella saamme laskettua teosten lukumäärät samalla säilyttäen yksittäisten niteiden yksilöinnin. Esimerkiksi samaa teosta voi olla usealla divarilla myynnissä ja hinnoissa voi olla eroavaisuuksia.

Users-entiteetin perusteella luotiin central.Users, jonka pääavaimeksi valittiin userId ja vierasavaimeksi sinne valittiin sellerId. Loput attribuutit lisättiin kaavioon muuttumattomina perään. Users-taulu sisältää pääkäyttäjät, myyjät sekä asiakkaat. Käyttäjän rooli määritetään enum-tyypin attribuutilla. Käyttäjällä *voi* olla sellerId, mikäli käyttäjän rooli on "seller".

Orders-entiteetin perusteella luotiin central.Orders, jonka pääavaimeksi valittiin orderId ja vierasavaimeksi userId. Loput entitettin attribuutit lisättiin kaavioon mukaan. Tilaus-tauluun tallennetaan kokonaistilauksen summa kirjanpitoa ajatellen (attribuutti total) sekä pelkkien kirjojen osuun kokonaistilauksesta (attribuutti subtotal).

OrderItems-entiteetin perusteella lisättiin relaatio kirjojen ja tilausten välille, jotta tilaukseen liittyvät niteet voidaan tallentaa tietokantaan. Täten esimerkiksi voidaan tilausnumeron perusteella voidaan hakea kaikki siihen liittyvät niteet.

Central-skeeman lisäksi luotiin skeema D1 divaria varten, johon tallennettaan kyseisen divarin niteet. D1-skeemaan ei tarvitse tallentaa muuta tietoa, sillä keskusdivari huolehtii asikastietojen ja tilausten tallentamisesta.

## Attribuuttien arvoalueet ja rajoitukset

### Sellers-taulu

Myyjä-taulun pääavain on serial-tyyppinen ja myyjällä on myös tekstimuotoinen skeeman nimi, joka ei saa olla tyhjä. Mikäli myyjällä ei ole omaa tietokantaa (käyttää keskustietokantaa), skeeman nimi on "central". Attribuutti "independent" on arvoltaan "tosi", kun divarilla on oma erillinen tietokanta. Myyjän nimi ei saa olla tyhjä. Sähköpostien tulee olla uniikkeja. Muut osoite-/yhteystiedot eivät ole pakollisia ja ne ovat tekstimuotoisia.

### Books-taulu

Kirja-taulun pääavain on UUID-tyyppinen (bookId), jotta niteiden tunnukset säilyvät yksilöivinä eri tietokantojen välillä. ISBN on pakollinen tekstimuotoinen attribuutti, joka yksilöi teokset (teoksista voi olla useampi nide). Niteellä on vierasavain sellerId, joka liittää niteen johonkin myyjään. SellerId:n avulla voidaan hakea niteitä myyjäkohtaisesti. Niteellä on attribuutti "status", joka ei saa olla tyhjä ja on oletuksena "available". Status on enum-tyyppinen ja sisältää arvot "available", "reserved" ja "sold". Niteellä on attribuutti hinta, joka ei saa olla "null" eli ilmaiseksi annettavat kirjat saavat hinnan 0. Niteellä on otsikko ja kirjailija, jotka ovat tekstimuotoisia pakollisia tietoja. Kirjalle voi lisätä myös kokonaislukumuotoisen julkaisuvuoden, mikäli se on tiedossa. Kirjan kuvausta voidaan tarkentaa lisäämällä tekstimuotonen tyyppi ja genre. Tyyppi määrittää, onko kirja esimerkiksi sarjakuva vai romaani, ja genre määrittää kirjan luokan (esim. "jännitys"). Jokaisille kirjalle tulee lisätä myös kokonaislukumuotoinen massa (punnitse, jos et tiedä). Jokaiselle kirjalle voidaan merkitä sisäänostohinta. Mikäli sisäänostohintaa ei ole merkitty, saa se arvon 0. Niteellä on myös timestamp-tyylinen myyntipäivämäärä ja kellonaika, joka lisätään onnistuneen myyntitapahtuman yhteydessä.

### Users-taulu

Käyttäjä-taulun pääavain on serial-muotoinen (userId). Käyttäjällä on pakollinen enum-tyyppinen rooli, joka sisältää arvot "customer", "seller" ja "admin". Käyttäjällä on vierasavain (sellerId), mikä lisätään vain käyttäjän roolin ollessa "seller". Käyttäjällä tulee olla yksilöivä tekstimuotoinen käyttäjänimi ja siihen liittyvä salasana. Salasana hajautetaan ja suolataan (hashing and salting) ennen tietokantaan tallentamista. Salasanan tallennus ei välttämättä vastaa oikean tietoturvallisen tuotantokelpoisen sovelluksen standardeja. Kirjautumistietoja tarvitaan sovelluksen toiminnan testaamisessa. Käyttäjä voi lisätä omiin tietoihinsa tekstimuotoisen nimen, osoitteen, postinumeron, kaupungin, sähköpostin ja puhelinnumeron. Näistä nimi on pakollinen ja sähköpostin tulee olla yksilöivä. Käyttäjän yhteystiedot tarvitaan tilausvaiheessa, mutta tästä vastuussa on käyttöliittymä.

### Orders-taulu

Tilaus-taulun pääavain on serial-muotoinen (orderId). Tilaustapahtumassa tallennetaan käyttäjän yksilöivä userId. Tilaustapahtuman aikaleima lisätään onnistuneen tilauksen yhteydessä. Tilauksella on enum-tyyppinen attribuutti status, joka voi saada arvot "pending" ja "completed". Tietyn kuluneen ajanjakson jälkeen tilauksen statuksen ollessa edelleenkin "pending", varatut niteet palautetaan tilaan "available" ja peruttu tilaus poistetaan. Asiakas voi myös itse perua tilauksen. Tilauksella on numeeriset attribuutit subtotal, shipping ja total. Subtotal käsittää tilaukseen kuuluvien niteiden kokonaishinnan, shipping postikulut ja total tilauksen kokonaishinnan.

### OrderItems-taulu

Tilaustuotteet-taulussa lisätään relaatio tilausten ja niteiden välille, eli se toimii ns. linkkinä näiden välillä. Tilaustuote-taulussa on vain attribuutit orderId ja bookId, jotka ovat samanaikaisesti pääavaimia sekä vierasavaimia.

### Skeema

Tietokannassa käytetään skeemaa erottamaan keskusdivari ja yksittäiset divarit toisistaan. Skeemat kuuluvat myyjille ja myyjät viittavat skeemoihin tietokantaa päivittäessä. Yksittäinen nide voidaan yksilöidä UUID:n avulla, jolloin se voidaan tallentaa turvallisesti eri skeemojen (tietokantojen) välillä.

## Toteutusvälineet

Ohjelmointikielenä käytetään JavaScriptiä. Alla yksityiskohtaisempi erittely käytetyistä työkaluista:

### Palvelin
- Suorituspäristö: Node.js
- Verkkokehys: Express.js
- Tietokantamoduuli: pg
- Tietokanta: PostgreSQL


### Käyttöliittymä
- Verkkokehys: React
- Tilanhallinta: Redux


### Kehitysympäristö
- Käyttöliittymä: Vite
- Formatointityökalu: Prettier
- Tarkistustyökalu: ESLint
- Versiohallinta: Git
