const pageInfoFragment = `
fragment pageInfoFragment on PageInfo {
  startCursor
  endCursor
  hasNextPage
  hasPreviousPage
}
`;
const rateLimitFragment = `
fragment rateLimitFragment on RateLimit {
  cost
  nodeCount
  remaining
}
`;

const userOverviewFragment = `
fragment userOverviewFragment on User {
  id
  name
  createdAt
  email
  login
  url
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
}
`;

const shortUserOverviewFragment = `
fragment shortUserOverviewFragment on User {
  id
  login
}
`;
const pullRequestFragment = `
fragment pullRequestFragment on PullRequest {
  id
  PullRequestState: state
  createdAt
  title
  url
  author {
    login
    ... on User {
      ...shortUserOverviewFragment
    }
  }
  repository {
    name
  }
}
`;
const issueFragment = `
fragment issueFragment on Issue {
  id
  IssueState: state
  createdAt
  title
  url
  author {
    login
    ... on User {
      ...shortUserOverviewFragment
    }
  }
  repository {
    name
  }
}
`;

export {
  pageInfoFragment,
  rateLimitFragment,
  userOverviewFragment,
  shortUserOverviewFragment,
  pullRequestFragment,
  issueFragment
};
