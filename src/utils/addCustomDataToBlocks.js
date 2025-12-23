import {
  getKnowledgeBaseData,
  getAllDepartments,
  getAllEventHero,
  getAllEvents,
  getAllMembers,
  getAllNews,
  getAllPastEvents,
  getAllResources,
  getAllSpeaker,
  getAllSuccessStories,
  getAllActionTeams,
  getAllSpeakersList, getAllTeamSortOrders
} from '../lib/api';

export const addCustomDataToBlocks = async (blocks, locale) => {
  try {
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      switch (block.name) {
        case 'acf/teamslisting':
          block.attributes.data.departments = await getAllDepartments();
          block.attributes.data.sortOrders = await getAllTeamSortOrders();
          break;
        case 'acf/sectionmembercards':
          block.attributes.data.all_members_cards = await getAllMembers();
        case 'acf/sectionspeakercalls':
          block.attributes.data.choose_speakers = await getAllSpeaker(
            block.attributes.data.choose_speakers
          );
          break;
        case 'acf/resourceslisting':
          block.attributes.data.topics = await getAllResources();
          break;
        case 'acf/eventsslider':
          block.attributes.data.events = await getAllEvents();
        case 'acf/newsslider':
          block.attributes.data.news = await getAllNews();
        case 'acf/sectioneventscards':
          block.attributes.data.choose_events = await getAllPastEvents(
            block.attributes.data.choose_events
          );
        case 'acf/eventsherobanner':
          block.attributes.data.choose_events_banner = await getAllEventHero(
            block.attributes.data.choose_events_banner
          );
          break;
        case 'acf/successstoriesslider':
          block.attributes.data.success_stories_slider = await getAllSuccessStories();
          break;
        case 'acf/browseknowledgelisting':
          block.attributes.data = await getKnowledgeBaseData();
          break;

        case 'acf/contactusform':
          block.attributes.data.departments = await getAllActionTeams();
          break;

        case 'acf/joinactionteamcta':
          block.attributes.data.departments = await getAllActionTeams();
          break;

        case 'acf/joinanactionteamform':
          block.attributes.data.departments = await getAllActionTeams();
          break;

        case 'acf/expressinterestform':
          block.attributes.data.speakers = await getAllSpeakersList();
          break;
        case 'acf/successslider':
          block.attributes.data.slider = await getAllSuccessStories();
          break;

        case 'acf/accountnav':
          block.attributes = await getAllDepartments();
          break;
        default:
          break;
      }

      blocks[i] = block;
    }
  } catch (error) {
    console.error('An error occurred while processing blocks:', error);
  }

  return blocks;
};
