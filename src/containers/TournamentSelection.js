import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { SERVER_URL } from "../constants.json";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import MusicIcon from "@material-ui/icons/MusicNoteTwoTone";

import { useTypoStyles, useBackgroundStyles } from "../styles";
import { makeStyles } from "@material-ui/core/styles";

const useTourLayoutStyles = makeStyles({
  root: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
  },
});

export default function TournamentSelection() {
  const typoClasses = useTypoStyles();
  const backgroundClasses = useBackgroundStyles();
  const tourLayoutClasses = useTourLayoutStyles();

  const [tours, setTours] = useState(0);
  useEffect(() => {
    fetch(`${SERVER_URL}/api/v2/game/tours`)
      .then((res) => res.json())
      .then((json) => setTours(json.data))
      .catch((e) => console.error(e));
  }, []);

  return (
    <Box
      position="relative"
      height="95vh"
      display="flex"
      flexDirection="column"
      className={backgroundClasses.dark}
    >
      <h2 className={typoClasses.subheader}>Tournament Selection</h2>
      <div className={tourLayoutClasses.root}>
        {tours &&
          tours.map((tour) => (
            <Box m={4} key={tour.id}>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/Tour/${tour.id}`}
              >
                <MusicIcon fontSize={"large"} />
                {tour.title}
              </Button>
            </Box>
          ))}
      </div>
    </Box>
  );
}
