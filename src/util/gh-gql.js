let cache = JSON.parse(window.sessionStorage.getItem('graphqlCache')) || {};
function hash(str) {
  // https://logaretm.com/blog/2020-02-24-caching-graphql-requests/
  // http://www.cse.yorku.ca/~oz/hash.html
  let h, i, l;
  for (h = 5381 | 0, i = 0, l = str.length | 0; i < l; i++) {
    h = (h << 5) + h + str.charCodeAt(i);
  }

  return h >>> 0;
}
function setCache(queryHash, payload) {
  cache[queryHash] = payload;
  window.sessionStorage.setItem('graphqlCache', JSON.stringify(cache));
}
function gqlFetch(query, AuthorizationToken, cacheCall = true) {
  const body = JSON.stringify({ query });
  const queryHash = hash(body);
  if (cacheCall && cache[queryHash]) {
    return Promise.resolve(cache[queryHash]);
  } else {
    return new Promise((resolve, reject) => {
      fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AuthorizationToken}`,
        },
        body,
      })
        .then((res) => res.json())
        .then(({ data, errors }) => {
          if (errors) {
            reject(errors);
          } else {
            setCache(queryHash, data);
            console.log(cache);
            resolve(data);
          }
        })
        .catch((error) => reject(error));
    });
  }
}

function sanitizeKey(key) {
  return  key.replace('-', '_');
}
export { gqlFetch, sanitizeKey };
