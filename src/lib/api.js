import { gql } from '@apollo/client';
import client from './apollo/client';
import { ALL_MEMBERS } from '../queries/all-members/all-members';
import { AllSpeakers } from '../queries/all-speaker/all-speakers';
import { allEvents } from '../queries/all-events/all-events';
import { allNews } from '../queries/all-news/all-news';
import { allPastEvents } from '../queries/all-events/all-past-events';
import { allEventsHero } from '../queries/all-events/all-event-hero';
import { allSuccessStories } from '../queries/all-success-stories/all-success-stories';
import { ALL_KNOWLEDGEBASE } from '../queries/all-knowledgebase/all-knowledgebase';
import { allActionTeam } from '../queries/all-action-teams/all-action-teams';
import { allSpeakersList } from '../queries/all-speakersList/all-speakersList';

export async function getAllDepartments(params) {
  const promise = client.query({
    query: gql`
      query GET_ALL_DEPARTMENTS {
        departments(where: { order: ASC, orderby: TERM_ORDER, hideEmpty: true }) {
          nodes {
            id
            name
            slug
            description
            actionGroups {
              hideFromFrontend
            }
          }
        }
      }
    `,
    fetchPolicy: 'no-cache'
  });

  const { data, errors } = await promise;

  if (errors) {
    return null;
  }

  return data?.departments?.nodes;
}

export async function getAllTeamSortOrders(params) {
  const promise = client.query({
    query: gql`
      query GET_ALL_TEAM_MEMBER_ORDERS {
        sortTeamMembers {
          sort {
            buildingAwarenessOrder {
              nodes {
                ... on TeamMember {
                  id
                  title
                }
              }
            }
            educationPipelineOrder {
              nodes {
                ... on TeamMember {
                  id
                  title
                }
              }
            }
            creatingExperiencesOrder {
              nodes {
                ... on TeamMember {
                  id
                  title
                }
              }
            }
            leadershipTeamOrder {
              nodes {
                ... on TeamMember {
                  id
                  title
                }
              }
            }
          }
        }
      }
    `,
    fetchPolicy: 'no-cache'
  });

  const { data, errors } = await promise;

  if (errors) {
    return null;
  }

  return data?.sortTeamMembers?.sort;
}

export async function getAllMembers() {
  const promise = client.query({
    query: ALL_MEMBERS,
    fetchPolicy: 'no-cache'
  });

  const { data, errors } = await promise;

  if (errors) {
    return null;
  }
  return data?.members?.edges;
}

export async function getKnowledgeBaseData() {
  const promise = client.query({
    query: ALL_KNOWLEDGEBASE,
    fetchPolicy: 'no-cache'
  });

  const { data, errors } = await promise;

  if (errors) {
    return null;
  }
  return data;
}

export async function getAllActionTeams() {
  const promise = client.query({
    query: allActionTeam,
    fetchPolicy: 'no-cache'
  });

  const { data, errors } = await promise;

  if (errors) {
    return null;
  }
  return data?.departments?.nodes;
}
export async function getAllSpeakersList() {
  const promise = client.query({
    query: allSpeakersList,
    fetchPolicy: 'no-cache'
  });

  const { data, errors } = await promise;

  if (errors) {
    return null;
  }
  return data?.speakers?.nodes;
}

export async function getAllSpeaker(id) {
  const promise = client.query({
    query: AllSpeakers,
    fetchPolicy: 'no-cache',
    variables: {
      ids: id
    }
  });

  const { data, errors } = await promise;

  if (errors) {
    return null;
  }
  return data?.speakers?.edges;
}
export async function getAllResources(params) {
  const promise = client.query({
    query: gql`
      query GET_ALL_RESOURCES {
        topics(
          first: 1000
          where: { parent: 0, order: ASC, orderby: TERM_ORDER, hideEmpty: true }
        ) {
          nodes {
            id
            name
            slug
            description
            children(first: 1000) {
              nodes {
                id
                name
                description
                resources(first: 1000) {
                  nodes {
                    id
                    title
                    resourcesFieldGroup {
                      url
                      uploadFile {
                        node {
                          sourceUrl
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    fetchPolicy: 'no-cache'
  });

  const { data, errors } = await promise;
  if (errors) {
    return null;
  }
  return data?.topics?.nodes;
}

export async function getAllEvents() {
  const promise = client.query({
    query: allEvents,
    fetchPolicy: 'no-cache'
  });
  const { data, errors } = await promise;
  if (errors) {
    return null;
  }
  return data?.events?.edges;
}

export async function getAllNews() {
  const promise = client.query({
    query: allNews,
    fetchPolicy: 'no-cache'
  });
  const { data, errors } = await promise;
  if (errors) {
    return null;
  }
  return data?.news?.edges;
}

export async function getAllPastEvents(id) {
  const promise = client.query({
    query: allPastEvents,
    fetchPolicy: 'no-cache',
    variables: {
      ids: id
    }
  });
  const { data, errors } = await promise;
  if (errors) {
    return null;
  }
  return data?.events?.edges;
}

export async function getAllEventHero(id) {
  const promise = client.query({
    query: allEventsHero,
    fetchPolicy: 'no-cache',
    variables: {
      ids: id
    }
  });
  const { data, errors } = await promise;
  if (errors) {
    return null;
  }
  return data?.events?.edges;
}

export async function getAllSuccessStories() {
  const promise = client.query({
    query: allSuccessStories,
    fetchPolicy: 'no-cache'
  });
  const { data, errors } = await promise;
  if (errors) {
    return null;
  }
  return data?.successStories?.edges;
}
