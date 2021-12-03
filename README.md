# Kat's Games API

# Background

This API was created as part of the Northcoder's Backend project. The purpose of this was to access application data programmatically. This was to mimic the building of a real world backend service which will provide information to the frontend architecture. This database is PSQL and is interacted with using node-postgres.

# How to access this project

The link to the hosted version of this project is https://kats-games.herokuapp.com/api

This will provide a view of all implemented endpoints with descriptions of expected results.

# Minimum requirements

- node = v16.13.0
- postgres = v12.9

# How to access database code

## How do I clone to my local device?

You will need to clone the repository from my github using the command line. You will need to ensure that you are logged into your github in order to do this.

```
git clone https://github.com/khanson27/nc_games.git
```

---

## What dependencies do I need in order to run this code?

### Required dependencies are:

- dotenv
- express
- pg
- pg-format

In order to install these you will need to use

```
npm install
```

### Dev Dependencies used:

- jest
- jest-sorted
- supertest

---

## .ENV files

.Env files are essential for running the database locally. An example has been created .env.example

This format should be followed for a .env.test and a .env.development file respectively.

### .env.development

This should include `PGDATABASE=nc_games`

If you are on Ubuntu you will also need to include the `PGPASSWORD=your_password`

### .env.test

This should include `PGDATABASE=nc_games_test If you are on Ubuntu you will also need to include the `PGPASSWORD=your_password`

**The .env files have already been included in the gitignore file so these will not be uploaded to github.**

---

### Seeding the local database

In order to seed the local database with the development data you need to first run:

```
npm run setup-dbs
```

Which will set up the database locally, to seed the database you will need to run:

```
npm run seed
```

Your development database will be seeded with data, this can checked by accessing psql which will show the database nc_games seeded.

---

### To run tests

Please ensure you have jest, jest-sorted and supertest installed as dev dependencies. This can be found in the package.json.

If these are not installed you can install these by using the scripts:

```
npm install supertest -D
npm install jest -D
npm install jest-sorted -D
```

For jest-sorted, you will also need to include a script within your package.json for full functionality. This can be added under dependencies.

```
"jest": {
    "setupFilesAfterEnv": [
      "jest-sorted"
    ]
  }
```

To run the tests use the script:

```
npm test
```

---
