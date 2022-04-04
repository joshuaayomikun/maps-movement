# About the App

## Stacks used
- NextJs used for the frontend

    read more about setting up a NextJS with Typescript [here](https://nextjs.org/docs/basic-features/typescript)
- NestJS used for backend

    read more about the setup [here](https://docs.nestjs.com/)
- Preference of language is TypeScript

## Project folder
The frontend project is in the frontend folder while the backend project is in the vackend folder

Ensure you clone the project and check the respective readme.md files onsetting up the project.
## Frontend
After cloning and running the installation dependency files, ensure you create duplicate the `sample.env.local` and rename the duplicate to `.env.local`. When running the local server, the application reads fromn the env file.

The default localhost server used is http://localhost:3000/

# Backend
After cloning and running the installation dependency files, ensure you create duplicate the `sample.env` and rename the duplicate to `.env` When running the local server, the application reads fromn the env file.
The default localhost server used is http://localhost:3100/to prevent tports from clashing.

*Ensure that you have `lunch.geojson.json` and `popeye-village-balluta.geojson.json`* located in your public folder because the application reads data from those two files.

# Docker
I containerized the application with Docker, in the root folder you will find a `docker-compose.yml` file where  I wrote the docker manifests for the applications. Each platform has is respective dockerfile represented and a correcponding dockerignore file too.