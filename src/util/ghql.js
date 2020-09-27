function ghql(query, AuthorizationToken) {
  return new Promise((resolve, reject) => {
    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AuthorizationToken}`,
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then(({ data }) => {
        resolve(data);
      })
      .catch((error) => reject(error));
  });
}
export { ghql };
