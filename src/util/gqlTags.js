import {
  pageInfoFragment,
  rateLimitFragment,
  userOverviewFragment,
  shortUserOverviewFragment,
  pullRequestFragment,
  issueFragment,
} from "./gqlFragments.js";

import { sanitizeKey } from "./gh-gql";

function externalContributors(q, cursor) {
  return `
query {
  rateLimit {
    ...rateLimitFragment
  }
  search(type: ISSUE, query: "${q}", first: 100, after: ${cursor}) {
    pageInfo {
      ...pageInfoFragment
    }
    issueCount
    nodes {
      type: __typename
      ... on PullRequest {
          id
          title
          url
          createdAt
          updatedAt
          resourcePath
          state
          isDraft
          mergeable
          author {
            login
            avatarUrl
          }
      }
      ... on Issue {
          id
          title
          url
          createdAt
          updatedAt
          resourcePath
          state
          author {
            login
            avatarUrl
          }
      }
    }
  }
}
${pageInfoFragment}
${rateLimitFragment}
`;
}

function initData(orgs) {
  return `
  query {
    rateLimit {
      ...rateLimitFragment
    }
    viewer {
      ...userOverviewFragment
    }
    ${orgs
      .map(
        (organization) => `
    ${sanitizeKey(organization)}: organization(login: "${organization}") {
      id
      name
      login
      avatarUrl
      url
      membersWithRole {
        totalCount
      }
      repositories {
        totalCount
      }
    }
    `
      )
      .join("\n")}
    
  }
  ${userOverviewFragment}
  ${rateLimitFragment}
  `;
}

function targetOrgMembers(orgs) {
  return `
  query {
    rateLimit {
      ...rateLimitFragment
    }
    ${Object.keys(orgs)
      .map(
        (org) => `
    ${sanitizeKey(org)}: organization(login: "${org}" ) {
      id
      login
      membersWithRole(first: ${
        orgs[org].membersWithRole.totalCount > 100
          ? 100
          : orgs[org].membersWithRole.totalCount
      } ${
          orgs[org].membersWithRole.pageInfo &&
          orgs[org].membersWithRole.pageInfo.hasNextPage
            ? `after: "${orgs[org].membersWithRole.pageInfo.endCursor}"`
            : ""
        }) {
        totalCount
        pageInfo {
          ...pageInfoFragment
        }
        members: nodes {
          ...userOverviewFragment
        }
      }
    }
    `
      )
      .join("\n")}
    
  }
  ${pageInfoFragment}
  ${userOverviewFragment}
  ${rateLimitFragment}
  `;
}

function reposOverview(orgs) {
  return `
  query {
    rateLimit {
      ...rateLimitFragment
    }
    ${Object.keys(orgs)
      .map(
        (org) => `
    ${sanitizeKey(org)}: organization(login: "${org}" ) {
      id
      login
      repositories(first: ${orgs[org].repositories.totalCount}) {
        totalCount
        pageInfo {
          ...pageInfoFragment
        }
        repos:nodes {
          id
          name
          stargazerCount
          openPullRequests: pullRequests(states: OPEN) {
            totalCount
          }
          openIsues: issues(states: OPEN) {
            totalCount
          }        
        }
      }
    }
    `
      )
      .join("\n")}
    
  }
  ${pageInfoFragment}
  ${rateLimitFragment}
  `;
}

// function pullRequests(ids) {
//   return `
//   query {
//     nodes(ids: [${ids.map(el => `"${el}"`).join(',')}]) {
//       ... on PullRequest {
//         ...pullRequestFragment
//       }
//     }
//   }
//   ${userOverviewFragment}
//   ${pullRequestFragment}
//   `
// } ;

function openPullRequests(reposWithPrs) {
  const reposQuery = [];
  reposWithPrs.map((repo) => {
    const first =
      repo.openPullRequests.totalCount > 100
        ? 100
        : repo.openPullRequests.totalCount;

    const hasNextPage =
      repo.openPullRequests.pageInfo &&
      repo.openPullRequests.pageInfo.hasNextPage;

    const after = hasNextPage ? `after: "${repo.openPullRequests.pageInfo.endCursor}"` : "";
    reposQuery.push(`
      ${sanitizeKey(repo.name)}: node(id: "${repo.id}") {
        ... on Repository {
            id
            name
            createdAt
            openPullRequests: pullRequests(states:OPEN, first: ${first} ${after}) {
              pullRequests: nodes {
                ...pullRequestFragment
              }
            }        
        }
      }
      `);
    return reposQuery.join("\n");
  })  
  return `
  query {
    ${reposQuery}
  }
  ${shortUserOverviewFragment}
  ${pullRequestFragment}
  `;
}

function openIsues(reposWithPrs) {
  const reposQuery = [];
  reposWithPrs.map((repo) => {
    const first =
      repo.openIsues.totalCount > 100
        ? 100
        : repo.openIsues.totalCount;

    const hasNextPage =
      repo.openIsues.pageInfo &&
      repo.openIsues.pageInfo.hasNextPage;

    const after = hasNextPage ? `after: "${repo.openIsues.pageInfo.endCursor}"` : "";
    reposQuery.push(`
      ${sanitizeKey(repo.name)}: node(id: "${repo.id}") {
        ... on Repository {
            id
            name
            createdAt
            openIsues: issues(states:OPEN, first: ${first} ${after}) {
              issues: nodes {
                ...issueFragment
              }
            }        
        }
      }
      `);
    return reposQuery.join("\n");
  })    
  return `
  query {
    ${reposQuery}
  }
  ${shortUserOverviewFragment}
  ${issueFragment}
  `;
}
export {
  externalContributors,
  targetOrgMembers,
  reposOverview,
  openPullRequests,
  openIsues,
  initData,
};
