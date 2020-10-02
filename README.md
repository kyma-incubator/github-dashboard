[![Netlify Status](https://api.netlify.com/api/v1/badges/abaccdf7-03ab-41a7-98ed-cf8c378a67fc/deploy-status)](https://app.netlify.com/sites/kyma-gh-dashboard/deploys)

# Github Dashboard - [gh-dashboard.kyma.dev](https://gh-dashboard.kyma.dev/login)

This dashboard is used to visualize the status of our Kyma Projects, and it's focused on tracking external contributions.

This is a Vuejs porjects using Github login to retrieve a working token and avoid using a common shared token to avoid hitting the Girthub API limits.

## Developer Guild

First you have to install dependencies. You can use `yarn` or `npm`

```sh
yarn 
```

to run on local

```sh
yarn run dev

```


## Build project

```sh
yarn build
```

## Preview project

```sh
yarn dev
```

## Configure Project

This website is using the Netlify Oauth2 integration. You can adapt this project to fit your needs, by creating your own Netlify Website and provide this via a `.env` variable to your app.

```
VITE_NETLIFY_APP_ID=xxxx-your-netlify-site-id
```

You will need to modify the inital organizations that are checked, by modifying the `store.js` targetOrgs to fit your organization structure `targetOrgs: { 'kyma-project': null, 'kyma-incubator': null }`