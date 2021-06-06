import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import TournamentSelection from "./components/TournamentSelection";
import Game from "./components/Game";
import Admin from "./components/admin";
import Song from "./components/admin/Song";
import Collect from "./components/admin/Collect";
import Tournament from "./components/admin/Tournament";

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
