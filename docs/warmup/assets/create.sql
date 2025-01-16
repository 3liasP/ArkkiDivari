CREATE TABLE Opetustila (
    opetustilaId SERIAL PRIMARY KEY,
    tunnus VARCHAR(255) NOT NULL,
    paikkaluku INT NOT NULL,
    vuokrakustannus DECIMAL(10, 2),
    lisatiedot TEXT
);

CREATE TABLE Varustus (
    varustusId SERIAL PRIMARY KEY,
    nimi VARCHAR(255) NOT NULL
);

-- Opetustilassa voi olla useita varusteita
CREATE TABLE OpetustilaVarustus (
    opetustilaId INT NOT NULL,
    varustusId INT NOT NULL,
    PRIMARY KEY (opetustilaId, varustusId),
    FOREIGN KEY (opetustilaId) REFERENCES Opetustila(opetustilaId),
    FOREIGN KEY (varustusId) REFERENCES Varustus(varustusId)
);

CREATE TABLE Kayttaja (
    kayttajaId SERIAL PRIMARY KEY,
    nimi VARCHAR(255) NOT NULL,
    yksikko VARCHAR(255)
);

-- Periodin aika voi vaihdella, pitää päivittää manuaalisesti
CREATE TABLE Periodi (
    periodiId SERIAL PRIMARY KEY,
    numero INT NOT NULL,
    alkupaiva DATE NOT NULL,
    loppupaiva DATE NOT NULL
);

CREATE TABLE Varaus (
    varausId SERIAL PRIMARY KEY,
    opetustilaId INT NOT NULL,
    kayttajaId INT NOT NULL,
    periodiId INT NOT NULL,
    kuvaus TEXT,
    startTime TIMESTAMP NOT NULL,
    endTime TIMESTAMP NOT NULL,
    FOREIGN KEY (opetustilaId) REFERENCES Opetustila(opetustilaId),
    FOREIGN KEY (kayttajaId) REFERENCES Kayttaja(kayttajaId),
    FOREIGN KEY (periodiId) REFERENCES Periodi(periodiId)
);

