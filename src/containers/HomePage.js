import React  from "react";
import { Link, useHistory } from "react-router-dom";

import { SERVER_URL } from "../constants.json";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";


import PlayArrowTwoToneIcon from "@material-ui/icons/PlayArrowTwoTone";
import PlaylistPlayTwoToneIcon from "@material-ui/icons/PlaylistPlayTwoTone";
import PlaylistAddTwoToneIcon from "@material-ui/icons/PlaylistAddTwoTone";

import {
  useButtonStyles,
  useTypoStyles,
  useBackgroundStyles,
} from "../styles";

function randint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function HomePage() {
  const buttonClasses = useButtonStyles();
  const typoClasses = useTypoStyles();
  const backgroundClasses = useBackgroundStyles();

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
    <>
      <Box
        position="relative"
        height="95vh"
        display="flex"
        flexDirection="column"
        className={backgroundClasses.main}
      >
        <div>
          <h1 className={typoClasses.header}>Million $inger</h1>
          <Button
            className={buttonClasses.blue}
            variant="contained"
            color="primary"
            onClick={startNow}
          >
            <PlayArrowTwoToneIcon fontSize={"large"} />
            Start Now
          </Button>
          <Button
            className={buttonClasses.blue}
            variant="contained"
            color="primary"
            component={Link}
            to="/TourSelect"
          >
            <PlaylistPlayTwoToneIcon fontSize={"large"} />
            Select Tournament
          </Button>
          <Button
            className={buttonClasses.blue}
            variant="contained"
            color="primary"
            component={Link}
            to="/Edit"
          >
            <PlaylistAddTwoToneIcon fontSize={"large"} />
            Edit Your Game
          </Button>
        </div>
      </Box>
    </>
  );
}
