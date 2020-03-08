import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import ErrorBoundary from './components/ErrorBoundary';
import Routes from './constants/Routes';
import useLinking from './navigation/useLinking';
import GamesScreen from './screens/GamesScreen';
import HomeScreen from './screens/HomeScreen';
import JoinGameScreen from './screens/JoinGameScreen';
import LobbyScreen from './screens/LobbyScreen';
import NewGameScreen from './screens/NewGameScreen';
import { StoreProvider } from './store';

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
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
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
            <NavigationContainer
              ref={containerRef}
              initialState={initialNavigationState}
            >
              <Stack.Navigator
                screenOptions={{
                  headerTitleAlign: 'center',
                }}
              >
                <Stack.Screen name={Routes.Home} component={HomeScreen} />
                <Stack.Screen name={Routes.NewGame} component={NewGameScreen} />
                <Stack.Screen name={Routes.Lobby} component={LobbyScreen} />
                <Stack.Screen name={Routes.Games} component={GamesScreen} />
                <Stack.Screen
                  name={Routes.JoinGame}
                  component={JoinGameScreen}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </StoreProvider>
      </ErrorBoundary>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
