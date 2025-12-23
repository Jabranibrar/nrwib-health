// // import { mapMainMenuItems } from './mapMainMenuItems'

export const getSitewideSettings = async () => {
  const params = {
    query: `query MenuQuery {
      sitewideSettings {
        sitewideSetting {
          fieldGroupName
          
          footer {
            footer {
              newsletterHeading
              footerLogo {
                node {
                  title
                  sourceUrl
                }
              }
              taglineText
              primaryButton {
                anchor {
                  url
                  title
                  target
                }
                variant {
                  nodes {
                    databaseId
                  }
                }
              }
              secondaryButton {
                anchor {
                  url
                  title
                  target
                }
                variant {
                  nodes {
                    databaseId
                  }
                }
              }
              partnerHeading
              partnersPrimaryUrl
              partnersSecondaryUrl
              partnersPrimaryImage {
                node {
                  title
                  sourceUrl
                }
              }
              partnersSecondaryImage {
                node {
                  title
                  sourceUrl
                }
              }
              slogan
            }
            footerBottom {
              copyright
              siteBy {
                url
                title
                target
              }
            }
          }
          
                allMenus {
                  menuItems {
                    menuTitles {
                      parentTitle {
                        title
                        url
                      }
                      showSubmenu
                      image {
                        node {
                          mediaItemUrl
                        }
                      }
                      submenuCategory {
                        category {
                          title
                          url
                        }
                        allSubLinks {
                          link {
                            title
                            url
                          }
                        }
                      }
                    }
                  }
                }
             
            


          pageNotFound {
            image {
              node {
                altText
                title
                sourceUrl
              }
            }
            text
            title
            returnToHomepage {
              target
              title
              url
            }
          }

          
          
          headerMenuButton {
            target
            title
            url
          }

          button {
            target
            title
            url
          }

          logos {
            logo {
              node {
                altText
                title
                sourceUrl
              }
            }
          }
          
          account {
            fieldGroupName
            menuTitles {
              fieldGroupName
              showSubmenu
              parentTitle {
                target
                title
                url
              }
              submenuCategory {
                allSubLinks {
                  link {
                    target
                    title
                    url
                  }
                }
                category {
                  target
                  title
                  url
                }
              }
            }
          }

        }
      }
    }
  `
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_WP_GRAPHQL_URL}`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const { data } = await response.json();

  return {
    sitewideSettings: data?.sitewideSettings?.sitewideSetting
  };
};
