const userProfile = `
id
name
createdAt
email
twitterUsername
organizations {
  totalCount
}
repositories {
  totalCount
}
followers {
  totalCount
}
following {
  totalCount
}
company
avatarUrl(size: 100)
`;
const rateLimit = `
rateLimit {
  cost
  nodeCount
  remaining
}
`;
export { userProfile, rateLimit };
