# PRO203_exam

### Check-kid is a kindergarten management system built with spring boot and react native. The applications focus is to give parents and staff a platform that is easy to use for all roles in a kindergarten. 

### Tech stack:
-   Java 21
-   Springboot 5 +
-   PostgreSQL - Dual database architecture
-   Flyway for database migrations
-   Spring Security + JWT Authentication
-   Google OAuth 2.0
-   JUnit 5
-   React Native
-   Expo
-   TypeScript

### Prerequisites for environment
-   Java 21 +
-   Maven 3.6 +
-   PostgreSQL 14 +
-   Node.js 18 +
-   Expo CLI (latest)
-   Git

### Quick Start Guide:
#### Backend:
Run these commands
        
        Please ensure you are not running any old docker images for the project if your are
        1. mvn clean install
        2. docker compose down -v - This is to remove any old docker images
        3. docker compose up -d - Makes a docker image for the project
        4. mvn spring-boot:run - initialize spring-boot
        5. mvn test - to run the tests
#### Frontend:
Run these commands

        1. cd frontend - For setting working direcory to the frontned
        2. npm install - Installs the prerequisets
        3. npx expo start -> Press W for web - Starts expo. Please make sure to run in web mode as there are authentication errors when EMULATING android version due to how google handles expo uri redirects 


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
