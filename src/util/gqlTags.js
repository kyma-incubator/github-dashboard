import {
  pageInfoFragment,
  rateLimitFragment,
  userOverviewFragment,
  pullRequestFragment,
  issueFragment,
} from './gqlFragments.js';

import { sanitizeKey } from "./gh-gql";

function externalContributors(q, cursor) {
  return `
query {
  rateLimit {
    ...rateLimitFragment
  }
  search(type: ISSUE, query: "${q}", first: 100, after: ${cursor}) {
    nodes {
      __typename
      ... on PullRequest {
        ...pullRequestFragment
      }
      ... on Issue {
        ...issueFragment
      }
    }
    issueCount
    pageInfo {
      ...pageInfoFragment
    }
  }
}
${userOverviewFragment}
${pullRequestFragment}
${issueFragment}
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
    ${orgs.map(organization => `
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
    `).join('\n')}
    
  }
  ${userOverviewFragment}
  ${rateLimitFragment}
  `
} ;

function targetOrgMembers(orgs) {
  return `
  query {
    rateLimit {
      ...rateLimitFragment
    }
    ${Object.keys(orgs).map(org => `
    ${sanitizeKey(org)}: organization(login: "${org}" ) {
      id
      login
      membersWithRole(first: ${orgs[org].membersWithRole.totalCount > 100 ? 100: orgs[org].membersWithRole.totalCount} ${orgs[org].membersWithRole.pageInfo && orgs[org].membersWithRole.pageInfo.hasNextPage ? `after: "${orgs[org].membersWithRole.pageInfo.endCursor}"` : ''}) {
        totalCount
        pageInfo {
          ...pageInfoFragment
        }
        members: nodes {
          ...userOverviewFragment
        }
      }
    }
    `).join('\n')}
    
  }
  ${pageInfoFragment}
  ${userOverviewFragment}
  ${rateLimitFragment}
  `
} ;

function reposOverview(orgs) {
  return `
  query {
    rateLimit {
      ...rateLimitFragment
    }
    ${Object.keys(orgs).map(org => `
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
    `).join('\n')}
    
  }
  ${pageInfoFragment}
  ${rateLimitFragment}
  `
} ;
export { externalContributors, targetOrgMembers, reposOverview, initData };
