# PRO203_exam

### Check-kid er et managment system bygget med spring boot og react native med expo. Applikasjonen tilatter managment av roller som parents, staff og boss for håndtering av children, attendance, health data, og kommunikasjon.

### Tech stack:
-   Java 21
-   Springboot 5 +
-   PostgreSQL
-   Flyway
-   Spring Security
-   Google OAuth 2.0
-   JUnit 5
-   React Native
-   Expo
-   TypeScript

### Setup
-   Java 21 +
-   Maven 3.6 +
-   PostgreSQL 14 +
-   Node.js 18 +
-   Expo CLI (latest)
-   Git

**Kjøre følgende komandoer i terminalen:**
-      mvn clean install
-      cd frontend
-      npm install
-      docker compose up -d
(Viktig å avslutte med docker compose down -v, før ny oppstart)
-      Kjøre backend gjennom IDE eller gjennom mvn spring-boot:run
-      cd frontend om du ikke er der ennå
-      npx expo start -> presse w for web
(Viktig å forstå at appen er tilpasset mobil løsning, men pågrunn av kombinasjonen av Google OAuth og Expo så har det faktisk ikke gått å sette opp autentisering på denne måten da google sitt oppsett krever en redirect url som starter med "https://, mens expo sin starter med exp:)
-      mvn test, for å kjøre gjennom 5 enkle tester for å teste funksjoner.

## Test flow på frontend siden.
- Trykke start knapp på start siden.
- Logge inn med google.
- Er bruker registrert før blir man sendt direkte til hjemmesiden.
- Er bruker ikke registrert før, blir man sendt til en side hvor man velger en rolle, og fyller inn informasjonen.
- Rollene har egne tilpasset felt som må fylles inn.
- **Forelder** fyller inn egen personlig informasjon, og får valget mellom å legge til et barn med engang, eller etterpå gjennom profilen.
- **Ansatt** fyller inn egen personlig informasjon, og må i tillegg velge bhg, denne blir tilgjengelig etter at sjef er opprettet sammen med ny bhg.
- **Sjef** har høyeste grad av tilgang og må fylles inn med personlig informasjon, i tillegg til å opprette en tilhørende bhg.

Hver enkel rolle har ulik tilgang.
- Forelder har tilgang og oversikt til sitt barn, kan sjekke inn barnet, og i tillegg har oversikt over blog, kalender og meldinger.
- Ansatt har tilgang til bekreftelse av at ett barn er sjekket inn, oversikt over barnet, meldinger, blogg, kalender, og hendelser som bleieskift.
- Sjef har tilgang til absolutt alle tjenestene, som for eksempel å opprette en barnehage eller å tildele en ansatt til en avdeling.
