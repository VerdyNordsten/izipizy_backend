<br />
<p align="center">
<div align="center">
<img height="150" src="./documentation/logo.png" alt="Mama-Recipe" border="0"/>
</div>
  <h3 align="center">Mama Recipe Backend</h3>
  <p align="center">
    <a href="https://github.com/VerdyNordsten/izipizy_backend"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://izipizybackend-production.up.railway.app/">View Demo</a>
    ·
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Setup .env](#setup-env)
- [Related Project](#related-project)
- [Meet Team](#team)
<!-- ABOUT THE PROJECT -->

## About The Project

Mama Recipe is a recipe food application designed to provide users with a wide variety of culinary inspirations and cooking ideas. The platform offers an extensive collection of recipes from diverse cuisines, allowing users to explore and prepare delicious meals in their own kitchens.

One of the standout features of Mama Recipe is its user-friendly interface, which makes it easy for users to search for specific recipes, browse by categories, or discover new dishes based on their preferences. From appetizers to desserts, Mama Recipe offers a diverse range of culinary delights to satisfy every taste.

Mama Recipe also provides detailed step-by-step instructions for each recipe, along with ingredient lists and cooking tips. This helps users follow along and recreate the dishes with confidence, even if they are new to cooking.

To use Mama Recipe, users can create an account or explore the app as a guest. The application also offers personalized recommendations based on users' cooking interests and dietary preferences, making it easier to find recipes that suit their individual needs.

With Mama Recipe, cooking becomes a delightful and rewarding experience, empowering users to create homemade meals that are both delicious and nourishing. Whether it's for everyday cooking or special occasions, Mama Recipe is a go-to app for culinary enthusiasts seeking inspiration in the kitchen.

### Built With

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [JSON Web Tokens](https://jwt.io/)
- and other

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- [nodejs](https://nodejs.org/en/download/)

| Third Party               | npm install                           |
| ------------------------- | ------------------------------------- |
| [bcrypt]                  | npm i bcrypt@5.1.0                     |
| [cloudinary]              | npm i cloudinary@1.34.0                |
| [cors]                    | npm i cors@2.8.5                       |
| [dotenv]                  | npm i dotenv@16.0.3                     |
| [express]                 | npm i express@4.18.2                    |
| [googleapis]              | npm i googleapis@111.0.0                |
| [helmet]                  | npm i helmet@6.0.1                      |
| [http-errors]             | npm i http-errors@2.0.0                 |
| [jsonwebtoken]            | npm i jsonwebtoken@9.0.0                |
| [moment]                  | npm i moment@2.29.4                     |
| [morgan]                  | npm i morgan@1.10.0                     |
| [multer]                  | npm i multer@1.4.5-lts.1                 |
| [multer-s3]               | npm i multer-s3@3.0.1                   |
| [nodemon]                 | npm i nodemon@2.0.20                    |
| [pg]                      | npm i pg@8.9.0                          |
| [uuid]                    | npm i uuid@9.0.0                        |
| [xss-clean]               | npm i xss-clean@0.1.1                   |

[bcrypt]: https://www.npmjs.com/package/bcrypt
[cloudinary]: https://www.npmjs.com/package/cloudinary
[cors]: https://www.npmjs.com/package/cors
[dotenv]: https://www.npmjs.com/package/dotenv
[express]: http://expressjs.com
[googleapis]: https://www.npmjs.com/package/googleapis
[helmet]: https://www.npmjs.com/package/helmet
[http-errors]: https://www.npmjs.com/package/http-errors
[jsonwebtoken]: https://www.npmjs.com/package/jsonwebtoken
[moment]: https://www.npmjs.com/package/moment
[morgan]: https://www.npmjs.com/package/morgan
[multer]: https://www.npmjs.com/package/multer
[multer-s3]: https://www.npmjs.com/package/multer-s3
[nodemon]: https://www.npmjs.com/package/nodemon
[pg]: https://node-postgres.com
[uuid]: https://www.npmjs.com/package/uuid
[xss-clean]: https://www.npmjs.com/package/xss-clean

### Requirements

Documentation files are provided in the [documentation](./documentation) folder

- [PostgreSQL database query](./query.sql)

API endpoint list are also available as published postman documentation

[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/24895506/2s93eR5bCp)

- [Node.js](https://nodejs.org/en/)
- [Postman](https://www.getpostman.com/) for testing

### Installation

- Clone This Back End Repo

```
git clone https://github.com/VerdyNordsten/izipizy_backend.git
```

- Go To Folder Repo

```
cd izipizy_backend
```

- Install Module

```
npm install
```

- <a href="#setup-env">Setup .env</a>
- Starting application

```
  <!-- Run App -->
  npm run dev
```

```
  <!-- Run Linter -->
  npm run lint
```

### Setup .env

Create .env file in your root project folder.

```
DB_HOST =
DB_USER =
DB_PASSWORD =
DB_NAME =
DB_PORT =

PORT =

SECRET_KEY_JWT =

CLOUDINARY_CLOUDNAME = 
CLOUDINARY_APIKEY =
CLOUDINARY_APISECRET =

GOOGLE_DRIVE_TYPE=
GOOGLE_DRIVE_PROJECT_ID=
GOOGLE_DRIVE_PRIVATE_KEY_ID=
GOOGLE_DRIVE_PRIVATE_KEY=
GOOGLE_DRIVE_CLIENT_EMAIL=
GOOGLE_DRIVE_CLIENT_ID=
GOOGLE_DRIVE_AUTH_URI=
GOOGLE_DRIVE_TOKEN_URI=
GOOGLE_DRIVE_AUTH_PROVIDER=
GOOGLE_DRIVE_CLIENT_URL=
GOOGLE_DRIVE_PARENT_FOLDER=
```

## Related Project

:rocket: [`Backend Mama Recipe`](https://github.com/VerdyNordsten/izipizy_backend)

:rocket: [`Frontend Mama Recipe`](https://github.com/VerdyNordsten/izipizy-FE)

:rocket: [`Demo Mama Recipe`](https://jobhub.digty.co.id/)

Project Link: [https://github.com/VerdyNordsten/izipizy_backend](https://github.com/VerdyNordsten/izipizy_backend)

## Meet Team

<center>
  <table align="center">
    <tr >
    <th >Frontend Developer / Product Manager</th>
      <th >Frontend Developer</th>
      <th >Frontend Developer</th>
      <th >Backend Developer</th>
      <th >Backend Developer</th>
    </tr>
    <tr >
      <td align="center">
        <a href="https://github.com/hosealeonardo18">
          <img width="200"  src="./documentation/hose.jpg" alt=""><br/>
          <b>Hose Leonardo</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/preedok">
          <img width="200"  src="./documentation/iqbal.jpg" alt=""><br/>
          <b>Muhamad Iqbal Aprido</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/Shaniara28">
          <img width="200"  src="./documentation/shania.jpg" alt=""><br/>
          <b>Shania Riski Agustin</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/RezaldhoArmadhani">
          <img width="200"  src="./documentation/aldho.jpg" alt=""><br/>
          <b>Rezaldho Armadani</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/VerdyNordsten">
          <img width="200"   src="./documentation/verdy.jpg" alt=""><br/>
          <b>Verdy Prido Lugara</b>
        </a>
      </td>
    </tr>
  </table>
</center>