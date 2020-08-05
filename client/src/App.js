import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Home from './pages/Home';
import './App.css';


const UnauthenticatedRoutes = () => {
  <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route path="/auth/login">     
    </Route>
    <Route path="/auth/signup">     
    </Route>
  </Switch>
}

function App() {
  [auth, isAuth] = useState(false);

  return (
    <Router>
      <UnauthenticatedRoutes />
    </Router>
  );
}

export default App;
