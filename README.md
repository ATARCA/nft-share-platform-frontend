# nft-share-platform-frontend

TODO: specify license before publishing this repo

# How to

## Start developing

### Project structure

Clone this repository using git. If you will be using also other repositories from atarca, place them all ine one directory. Example structure:
```
.
├── my dev folder
│   ├── nft-share-platform-frontend
│   └── nft-share-platform-backend
│   └── nft-share-platform-contracts
│   └── nft-share-platform-subgraph
...
```

Some workspace scripts rely on this structure and may not work properly with all projects are not placed in the same directory.

### Initial installation

Run `npm install` in the project directory.

### Run frontend server locally

Run `npm start` in the root of the folder.

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Update backend GraphQL schema

GraphQL is used for API between backend and frontend. Update schema file in backend repository first and then and start the backend. On frontend run `npm run backend:schema:download` and then `npm run backend:schema:codegen`.

## Update subgraph GraphQL schema

GraphQL is used for API between subgraph blockchain indexing service and frontend. Update schema in subgraph repository and deploy it to a subgraph. On frontend run `npm run thegraph:schema:download` and then `npm run thegraph:schema:codegen`. Make sure that the download command points to the same instance of subgraph where the new schema was deployed (see `package.json` file).

## Create new GraphQL queries / modify existing queries

For backend queries see `src\queries-backend\queries.ts` file. 
For subgraph queries see `src\queries-thegraph\queries.ts` file.

Add or modify queries as needed. After that run `npm run backend:schema:codegen` for backend queries or `npm run thegraph:schema:codegen` for subgraph queries. This command will generate query types needed for typed queries.

### Update smart contracts from the nft-share-platform-contract repo

Required setup: the `nft-share-platform-frontend` and `nft-share-platform-contrats` repos has to be in the same directory next to each other.

Then run `npm run contracts:update` to generate new Typescript files from the solidity contracts and copy them over to the `nft-share-platform-frontend` folder.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Other available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

This project has received funding from the European Union's Horizon 2020 Research and Innovation Programme under Grant Agreement Nº 964678.