import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import * as React from 'react';
import { Platform, StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import ErrorBoundary from './components/ErrorBoundary';
import Routes from './constants/Routes';
import useLinking from './navigation/useLinking';
import GameLobbyScreen from './screens/GameScreen';
import HomeScreen from './screens/HomeScreen';
import JoinGameScreen from './screens/JoinGameScreen';
import MyGamesScreen from './screens/MyGamesScreen';
import NewGameScreen from './screens/NewGameScreen';
import { StoreProvider } from './store';

const Stack = createStackNavigator();

export default function App(props: any) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  // const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  // const { getInitialState } = useLinking(containerRef);
  useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        // setInitialNavigationState((await getInitialState()) as any);

        // Load fonts
        await Font.loadAsync({
          ...AntDesign.font,
          ...MaterialCommunityIcons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
          'Fugaz-One': require('./assets/fonts/FugazOne-Regular.ttf'),
          'Work-Sans': require('./assets/fonts/WorkSans-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <ErrorBoundary>
        <StoreProvider>
          {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
          <NavigationContainer
            ref={containerRef}
            // initialState={initialNavigationState}
          >
            <Stack.Navigator
              screenOptions={{
                headerTintColor: '#F38BA6',
                headerStyle: {
                  elevation: 0,
                  borderBottomWidth: 0,
                },
                title: '',
              }}
            >
              <Stack.Screen
                name={Routes.Home}
                component={HomeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen name={Routes.NewGame} component={NewGameScreen} />
              <Stack.Screen name={Routes.Lobby} component={GameLobbyScreen} />
              <Stack.Screen name={Routes.Games} component={MyGamesScreen} />
              <Stack.Screen name={Routes.JoinGame} component={JoinGameScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </StoreProvider>
      </ErrorBoundary>
    );
  }
}
