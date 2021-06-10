import React, { useState, useEffect, useMemo } from "react";

import { Link } from "react-router-dom";
import { SERVER_URL } from "../constants.json";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import MusicIcon from "@material-ui/icons/MusicNoteTwoTone";

import {
  useTypoStyles,
  useBackgroundStyles,
} from "../styles";

export default function TournamentSelection() {
  const typoClasses = useTypoStyles();
  const backgroundClasses = useBackgroundStyles();

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
        <Box m={4} key={i}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/Tour/${i}`}
          >
            <MusicIcon fontSize={"large"} />
            Tournament {i}
          </Button>
        </Box>
      );
    }
    return array;
  }, [NTours]);

  return (
    <>
      <Box
        position="relative"
        height="95vh"
        display="flex"
        flexDirection="column"
        className={backgroundClasses.dark}
      >
        <div>
          <h2 className={typoClasses.subheader}>Tournament Selection</h2>
          {tournaments}
        </div>
      </Box>

    </>
  );
}
