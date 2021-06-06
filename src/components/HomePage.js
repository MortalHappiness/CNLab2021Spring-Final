import React from "react";
import { Link, useHistory } from "react-router-dom";

import { SERVER_URL } from "../constants.json";

import Button from "@material-ui/core/Button";

function randint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function HomePage() {
  const history = useHistory();

  const startNow = () => {
    fetch(`${SERVER_URL}/api/game/tours`)
      .then((res) => res.json())
      .then((json) => {
        const tourID = randint(1, json.data);
        history.push(`/Tour/${tourID}`);
      })
      .catch((e) => console.error(e));
  };

  return (
    <div>
      <h1>Million $singer</h1>
      <Button variant="contained" color="primary" onClick={startNow}>
        Start Now
      </Button>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/TourSelect"
      >
        Select Tournament
      </Button>
      <Button variant="contained" color="primary" component={Link} to="/Edit">
        Edit Your Game
      </Button>
    </div>
  );
}
