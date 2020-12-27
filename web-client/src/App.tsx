import { Route, Switch } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import RootProvider from './RootProvider';

function App() {
  return (
    <RootProvider>
      <Switch>
        <Route>
          <MainMenu />
        </Route>
      </Switch>
    </RootProvider>
  );
}

export default App;
