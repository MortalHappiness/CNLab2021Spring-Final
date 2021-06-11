import React, { useState, useEffect, useMemo } from "react";

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
    return (
	<div className={tourLayoutClasses.root}	>
		{array}
	</div>);
  }, [NTours]);

  return (
    <>
      <Box
        position="relative"
        display="flex"
		height="95vh"
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
