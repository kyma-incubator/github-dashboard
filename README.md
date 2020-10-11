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


## Usage of BigQuery

For trying out Big Query with your data, we recommend creating a copy first. In the example bellow we use `_TABLE_SUFFIX` to iterate over the dates that start with `20*` + `180804` - the day of our first commit.

```sql
CREATE TABLE `sap-kyma-vvcloud-dev.kyma_github_stats.all` AS
SELECT
  *
FROM
  `githubarchive.day.20*`
WHERE
  _TABLE_SUFFIX BETWEEN '180704'AND '180710'
  AND org.login IN ('kyma-project',
    'kyma-incubator')

```

After this we can trty our Queries in a smaller subset:

```sql
SELECT
  FORMAT_TIMESTAMP('%F', created_at) AS date,
  org.login AS organization,
  repo.name AS repository,
  actor.login AS actor,
  type,
  JSON_EXTRACT_SCALAR(payload,
    '$.action') AS action,
  COUNT(*) AS count
FROM
  `sap-kyma-vvcloud-dev.kyma_github_stats.all`
WHERE
  type IN ('IssuesEvent','PullRequestEvent', 'WatchEvent')
  AND org.login IN ('kyma-project',
    'kyma-incubator')
GROUP BY
  1,
  2,
  3,
  4,
  5,
  6
ORDER BY
  1 ASC

```

You can use the same query as above on fresh data by replacing `FROM` with:
```SQL
FROM
  `githubarchive.day.20*`
WHERE
  _TABLE_SUFFIX BETWEEN '180704'AND '180705'
```



SELECT
  FORMAT_TIMESTAMP('%F', created_at) AS date,
  org.login AS organization,
  repo.name AS repository,
  actor.login AS actor,
  type,
  JSON_EXTRACT_SCALAR(payload,
    '$.action') AS action,
  COUNT(*) AS count
FROM
  `githubarchive.day.20*`
WHERE
  _TABLE_SUFFIX BETWEEN '180704'AND '180705'
  AND type IN ('IssuesEvent',
    'WatchEvent',
    'PullRequestEvent')
  AND org.login IN ('kyma-project',
    'kyma-incubator')
GROUP BY
  1,
  2,
  3,
  4,
  5,
  6
ORDER BY
  1 ASC