## Description

Simple google drive api (google auth, file and folder structure, view/edit user access)

## Project setup

### Install dependences

```bash
$ npm install
```

### Update .env with .env.example

### Run database

```
cd test/docker
sudo docker-compose up
```

### Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Migration

```bash
$ npm migration:run
```

### GUI

[http://localhost:4000/graphql](http://localhost:4000/graphql)
