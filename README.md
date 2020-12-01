# Test Node.JS App

### General
1. Launching the app is very easy due to scripts:
    1. ```npm run prod``` will run production server.
    1. ```npm run dev``` will run developer server under nodemon.
    1. ```npm test``` will run tests.
    1. ```npm run posttest``` will run eslint linter.
1. Everything that concerns app functionality is situated in ```src``` directory, everything concerning tests in situted in ```tests``` directory
1. MongoDB is used as storage, as there is only one table and therefore there is no need for SQL. Everyting concerning database is situated in ```src/db``` directory. Database uses a cloud cluster, so there is no need for database setup.
1. REST API is situated in src/app.js, app starts woking from ```src/server.js``` .
1. Everyting concerning logging is situated in ```src/logging``` directory. Logging is using winston module. One can read logs in ```src/logging/logs``` directory.
1. Txt files parsing and util for uploading file is situated in ```src/utils``` directory.
1. CLI is called ```movie-cli```. Everyting concerning CLI is situated in ```src/cli``` directory. CLI is using inquirer and args modules. One needs to run ```npm link``` to be able to use the CLI.(It is better done on UNIX-like systems because npm link seems not to work on Windows. The reason I haven't published the module to npm is because I don't want to litter npm even more, when there is more than 1 million of modules published).
1. CLI interface is very easy to use. One is just asked questions.