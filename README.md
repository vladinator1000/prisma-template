# Prisma, Postgres, TypeScript starter

A minimal template that enables delightful database development.

## Features

🌱 Seed your database with different test data differently depending on your environment (`development` or `production`)

🧪 Separate integration test command and mindset for deterministic database integration testing, along with an example github action for continuous integration

🧹 A nice local development experience with auto-reloading and linting, formatting, compiling on commit

Made with ♥ by me ([@vladinator1000](https://github.com/vladinator1000/)) and my dad ([@savovsa](https://github.com/savovsa))

## Instructions for use

1. Copy `.env.dev` and rename it to `.env`
1. In your terminal, start the database `docker-compose up`
1. In another terminal, `npm start`

We'll use [Prisma](https://www.prisma.io/docs/) to talk to the database.
If you'd like to understand how it works, please read the [Prisma concepts](https://www.prisma.io/docs/concepts).

This will reset the database, run migrations, seeds and generate the TypeScript Prisma client.

### Migrations (structural changes)

To add tables, change columns or any other structural changes, create a migration:

1. Edit the [schema.prisma](src/db/schema.prisma) file
1. Create a new migration by running `npm run prisma-migrate-dev -- --name shortExplanationOfYourChange`
1. For more details, read the [migration collaboration docs](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/team-development)

### Seeding (adding data to the database)

To programatically add data to the database we use a custom "seed" system. It works a lot like the migrations system, but lets us use the prisma client to safely read/write to the database with TypeScript.

1. Create a seed file by running `npm run prisma-create-seed fileName`. This will create a file in _src/db/seeds/development_. (note that this seed will _only_ run in development, not when `process.NODE_ENV` is equal to `production`.)
2. Filling in the `apply` function of your newly created file with code

Here's an example

```ts
export async function apply(prisma: PrismaClient) {
  await prisma.user.create({
    data: {
      name: 'Jeff',
    },
  })
}
```

3. If you'd like to create a seed for production, use this command. Your seed will be created in this folder _src/db/prisma/seeds/production_. Seeds get applied by number in the following order: production, then development.

```sh
npm run prisma-create-seed --production fileName
```

To visually interact with the database, run Prisma Studio

```sh
npm run prisma-studio
```

## Testing philosophy

The tests are separated into unit and integration, because we can avoid running the integration tests if the unit tests fail.

To run the unit tests:
`npm run test`

To run the integration tests:
`npm run itest`

Integration tests should be able to run in any order and should not depend on existing data in the database. Every integration test should set up its own prerequisites and clean up after itself so that the next integration test can have a clean environment to run in.
