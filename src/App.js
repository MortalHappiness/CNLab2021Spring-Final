import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import HomePage from "./containers/HomePage";
import TournamentSelection from "./containers/TournamentSelection";
import Game from "./containers/Game";
import Admin from "./containers/admin";
import SongNew from "./containers/admin/Song/New";
import SongDelete from "./containers/admin/Song/Delete";
import CollectNew from "./containers/admin/Collect/New";
import CollectDelete from "./containers/admin/Collect/Delete";
import TournamentNew from "./containers/admin/Tournament/New";
import TournamentDelete from "./containers/admin/Tournament/Delete";
import Bar from "./components/Bar.js";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Bar />
        <Switch>
          <Route path="/TourSelect">
            <TournamentSelection />
          </Route>
          <Route path="/Tour/:TourID">
            <Game />
          </Route>
          <Route path="/admin/Song/New">
            <SongNew />
          </Route>
          <Route path="/admin/Song/Delete">
            <SongDelete />
          </Route>
          <Route path="/admin/Collect/New">
            <CollectNew />
          </Route>
          <Route path="/admin/Collect/Delete">
            <CollectDelete />
          </Route>
          <Route path="/admin/Tournament/New">
            <TournamentNew />
          </Route>
          <Route path="/admin/Tournament/Delete">
            <TournamentDelete />
          </Route>
          <Route path="/admin">
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
