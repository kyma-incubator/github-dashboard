const pageInfo = `
pageInfo {
  startCursor
  endCursor
  hasNextPage
}`;
const rateLimit = `
rateLimit {
  cost
  nodeCount
  remaining
}
`;
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
const pullRequestFields = `
id
PullRequestState:state
createdAt
repository {
  owner {
    id
    login
  }
}
author {
  login
  ... on User {
    ${userProfile}
  }
}
title
url
`;
const issueFields = `
id
IssueState: state
createdAt
repository {
  owner {
    id
    login
  }
}
author {
  login
  ... on User {
    ${userProfile}
  }
}
title
url
`;
function externalContributors(q, cursor) {
  return `
{
  search(type: ISSUE, query: "${q}", first: 100, after: ${cursor}) {
    nodes {
      __typename
      ... on PullRequest {
        ${pullRequestFields}
      }
      ... on Issue {
        ${issueFields}
      }
    }
    issueCount
    ${pageInfo}
  }
  ${rateLimit}
}
`;
}
const currentUser = `
{
  viewer {
    ${userProfile}
  }
  ${rateLimit}
}
`;

export {
  rateLimit,
  pageInfo,
  userProfile,
  pullRequestFields,
  issueFields,
  externalContributors,
  currentUser,
};
