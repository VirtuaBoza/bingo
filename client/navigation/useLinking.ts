import { NavigationContainerRef } from '@react-navigation/native';
import { Linking } from 'expo';
import { useEffect } from 'react';
import Routes from '../constants/Routes';

export default function (
  containerRef: React.RefObject<NavigationContainerRef>
) {
  function navigate(url: string | null) {
    if (url && containerRef.current) {
      const rootUrl = Linking.makeUrl('/').replace(/:\d+/, '').toLowerCase();
      if (url.toLowerCase().startsWith(rootUrl)) {
        const [path, query] = url
          .replace(new RegExp(rootUrl, 'i'), '')
          .split('?');

        let params: { [key: string]: string } = {};
        if (query) {
          params = query.split('&').reduce((acc, cur, i) => {
            const [key, value] = cur.split('=');
            acc[key] = value;
            return acc;
          }, params);
        }

        if (Object.values(Routes).includes(path)) {
          containerRef.current.navigate(path, params);
        } else {
          console.log('no such route', path);
        }
      }
    } else {
      console.log('No navigator');
    }
  }

  useEffect(() => {
    Linking.getInitialURL().then(navigate);
  }, []);

  useEffect(() => {
    function handleLinkingEvent(e: { url: string }) {
      navigate(e.url);
    }
    Linking.addEventListener('url', handleLinkingEvent);

    return () => {
      Linking.removeEventListener('url', handleLinkingEvent);
    };
  });
  // return useLinking(containerRef, {
  //   prefixes: [Linking.makeUrl()],
  //   config: {
  //     [Routes.Home]: Routes.Home,
  //     [Routes.NewGame]: Routes.NewGame,
  //     [Routes.Games]: Routes.Games,
  //     [Routes.JoinGame]: `${Routes.JoinGame}/:gameId`,
  //     [Routes.Lobby]: `${Routes.Lobby}/:gameId`,
  //   },
  // });
}
