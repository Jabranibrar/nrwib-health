import { renderToString } from 'react-dom/server';
import { getServerState } from 'react-instantsearch';
import TeamsListing from '../sections/TeamsListing';
import SuccessStoriesListing from '../sections/SuccessStoriesListing';

export async function getServerStateResponse(blocks) {
  return Promise.all(
    blocks?.map(async (node) => {
      const { name, attributes = {}, id = '' } = node || {};
      const { data = {} } = attributes || {};
      let Component;

      // Check the block name and assign the corresponding component
      if (name === 'acf/teamslisting') {
        Component = TeamsListing;
      } else if (name === 'acf/successstorieslisting') {
        Component = SuccessStoriesListing;
      }

      if (Component) {
        const serverState = await getServerState(
          <Component block={node} {...node?.attributes?.data} />,
          {
            renderToString
          }
        );

        return {
          name,
          attributes: {
            ...attributes,
            data: {
              ...data,
              serverState
            }
          },
          id
        };
      }

      // If the block name doesn't match any, return the node as-is
      return node;
    })
  );
}
