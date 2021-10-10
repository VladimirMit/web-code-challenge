import React from 'react';
import { Switch, Route } from 'react-router-dom'
import './App.css';
import ButtonAppBar from './ButtonAppBar';
import routes from './app-routes'

function App() {
  return (
    <div className="App">
      <ButtonAppBar />
      <Switch>
        {routes.map(r => (
          <Route
            exact
            key={r.path}
            path={r.path}
            component={r.component} />
        ))}
      </Switch>
    </div>
  );
}

export default App;
