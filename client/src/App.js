import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router,Switch, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar'

import Home from './pages/Home';
import './App.css';


// const UnauthenticatedRoutes = () => {
//   <Switch>
//     <Route exact path="/">
//       <Home />
//     </Route>
//     <Route path="/auth/login">     
//     </Route>
//     <Route path="/auth/signup">     
//     </Route>
//   </Switch>
// }

function App() {
  const [auth, isAuth] = useState(false);

  return (
    <Router>
      <Navbar />
        <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route path="/auth/login">     
    </Route>
    <Route path="/auth/signup">     
    </Route>
  </Switch>
      {/* <UnauthenticatedRoutes /> */}
    </Router>
  );
}

export default App;
