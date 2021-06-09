import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HomePage from "./containers/HomePage";
import TournamentSelection from "./containers/TournamentSelection";
import Game from "./containers/Game";
import Admin from "./containers/admin";
import Song from "./containers/admin/Song";
import Collect from "./containers/admin/Collect";
import Tournament from "./containers/admin/Tournament";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/TourSelect">
            <TournamentSelection />
          </Route>
          <Route path="/Tour/:TourID">
            <Game />
          </Route>
          <Route path="/Edit/Song">
            <Song />
          </Route>
          <Route path="/Edit/Collect">
            <Collect />
          </Route>
          <Route path="/Edit/Tournament">
            <Tournament />
          </Route>
          <Route path="/Edit">
            <Admin />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
