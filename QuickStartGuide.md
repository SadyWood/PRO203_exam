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
