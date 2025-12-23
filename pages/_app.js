import '@/styles/globals.scss';
import '@/styles/accessibility.scss';
import 'animate.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AuthProvider } from '@/src/hooks/useAuth';
import WordPressProvider from '@/src/context/WordPressProvider';
import { ApolloProvider } from '@apollo/client';
import client from '@/src/lib/apollo/client';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      const id = router.asPath.split('#')[1];
      const hash = router.asPath.split('?')[1]?.replace('=', '');

      setTimeout(() => {
        if (hash) {
          const section = document.getElementById(hash);
          if (section) {
            // section.scrollIntoView({ behavior: "smooth" });
            const sectionRect = section.getBoundingClientRect();
            const offset = sectionRect.top - 200;

            window.scrollTo({
              top: window.pageYOffset + offset
            });
          }
        }

        if (id) {
          const element = document.getElementById(id);

          if (element) {
            const sectionRect = element.getBoundingClientRect();
            const offset = sectionRect.top - 200;

            window.scrollTo({
              top: window.pageYOffset + offset
            });
          }
        }
      }, 300);
    };

    handleRouteChange();

    const isExternalLink = (url) => {
      try {
        const linkUrl = new URL(url, window.location.href);
        return linkUrl.host !== window.location.host;
      } catch (e) {
        console.error('Invalid URL:', url);
        return false;
      }
    };

    // Get all link elements
    const links = document.querySelectorAll('a');

    // Iterate over each link and modify it if it's external and not the same host
    if (links) {
      links.forEach((link) => {
        if (isExternalLink(link.href)) {
          link.target = '_blank'; // Open in new tab
          link.rel = 'noopener noreferrer'; // Security measure
        }
      });
    }

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);
  // useEffect(() => {
  //   const handleRouteChange = () => {
  //     const id = router.asPath.split('#')[1];
  //     const hash = router.asPath.split('?')[1]?.replace('=', '');

  //     setTimeout(() => {
  //       if (hash) {
  //         const section = document.getElementById(hash);
  //         if (section) {
  //           // section.scrollIntoView({ behavior: "smooth" });
  //           const sectionRect = section.getBoundingClientRect();
  //           const offset = sectionRect.top - 200;

  //           window.scrollTo({
  //             top: window.pageYOffset + offset
  //           });
  //         }
  //       }

  //       if (id) {
  //         const element = document.getElementById(id);

  //         if (element) {
  //           const sectionRect = element.getBoundingClientRect();
  //           const offset = sectionRect.top - 200;

  //           window.scrollTo({
  //             top: window.pageYOffset + offset
  //           });
  //         }
  //       }
  //     }, 300);
  //   };

  //   handleRouteChange();

  //   const isExternalLink = (url) => {
  //     try {
  //       const linkUrl = new URL(url, window.location.href);
  //       return linkUrl.host !== window.location.host;
  //     } catch (e) {
  //       console.error('Invalid URL:', url);
  //       return false;
  //     }
  //   };

  //   // Get all link elements
  //   const links = document.querySelectorAll('a');

  //   // Iterate over each link and modify it if it's external and not the same host
  //   if (links) {
  //     links.forEach((link) => {
  //       if (isExternalLink(link.href)) {
  //         link.target = '_blank'; // Open in new tab
  //         link.rel = 'noopener noreferrer'; // Security measure
  //       }
  //     });
  //   }

  //   router.events.on('routeChangeComplete', handleRouteChange);

  //   return () => {
  //     router.events.off('routeChangeComplete', handleRouteChange);
  //   };
  // }, [router]);
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <WordPressProvider>
          <Component {...pageProps} key={router.asPath} />
        </WordPressProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default MyApp;
