import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MainMenu from './pages/MainMenu';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route>
          <MainMenu />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
