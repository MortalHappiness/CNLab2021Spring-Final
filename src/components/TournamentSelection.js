import React, { useState, useEffect, useMemo } from "react";

import { Link } from "react-router-dom";

import { SERVER_URL } from "../constants.json";

import Button from "@material-ui/core/Button";

export default function TournamentSelection() {
  const [NTours, setNTours] = useState(0);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/game/tours`)
      .then((res) => res.json())
      .then((json) => setNTours(json.data))
      .catch((e) => console.error(e));
  }, []);

  const tournaments = useMemo(() => {
    const array = [];
    for (let i = 1; i <= NTours; ++i) {
      array.push(
        <Button
          key={i}
          variant="contained"
          color="primary"
          component={Link}
          to={`/Tour/${i}`}
        >
          Tournament {i}
        </Button>
      );
    }
    return array;
  }, [NTours]);

  return (
    <div>
      <h2>Tournament Selection</h2>
      {tournaments}
    </div>
  );
}
