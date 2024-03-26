<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p style="text-align: center;">
## TASK MANAGER API REST
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

This is an example of a REST API created with  [Nest](https://github.com/nestjs/nest) framework TypeScript and [TypeORM]([Nest](https://github.com/nestjs/nest)), using a MySQL database.

It is a Task Manager where Users register and using the token provided at Login, they can only Consult, Create, Update, and Delete their tasks. Additionally, the actions they perform with their Tasks are stored in the database to keep track of possible errors.
## Install packages

```bash
$ npm install
```
## Use .env file
This file was sent to the email, all you need to do is copy its content and create a .env file in the project root directory, at the same level as the docker-compose.yml.

## Running the app

```bash
# docker for mysql db
$ docker-compose up -d

# development
$ npm run start

# watch mode
$ npm run start:dev

```
## API REST prefix endpoints
`http://localhost:3000/api/v1`

## Swagger docs
 `http://localhost:3000/docs`

## How to use

1.  Register in DB with endpoint User Register: `/api/v1/auth/register` providing *username* and *password*.
2. Login with *username* and *password* to get ***token***
3. Use that token in the **tasks** endpoints.

Note: Keep in mind that to use the **Update** endpoint of a ***Task***, it is necessary to use *Multipart Form* (in the client testing the app) to ensure the file upload to the AWS S3 bucket.

> More information in *Swagger docs*

## Contact
<a href="https://www.linkedin.com/in/ariel-alvarez-gasca-4338812aa/" target="_blank"><img  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/2048px-LinkedIn_icon.svg.png?style=social&label=LinkedIn" width="20" height="20">LinkedIn</a>
