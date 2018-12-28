# Self-driving rides

Available at https://rides.jjdev.eu

Janar Juusu (@juusujanar), Andreas Baum (@Monkey911)

Given a set of requested rides, the application will eventually show cars driving and taking commuters from their origins to their destinations.

For Algorithmics course in University of Tartu.

Original task: https://storage.googleapis.com/coding-competitions-staging.appspot.com/HC/2018/hashcode2018_qualification_task.pdf

## How to run

#### If you have Docker & docker-compose
- Clone the repo
- ```docker-compose up```
- Open browser at http://localhost:4000

#### If you do not have
- `yarn` or `npm install`
- `yarn start` or `npm run start`
- Open browser at http://localhost:4000

## Build production
Project is automatically build and deployed to Netlify.  
If you want to do it yourself, use `yarn build`.

## Tools
- JavaScript (compiled to ES2015) & Webpack
- Teeny tiny bit of HTML5
- PixiJs - https://pixijs.io/
