import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { SERVER_URL } from "../constants.json";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";

import PlayArrowTwoToneIcon from "@material-ui/icons/PlayArrowTwoTone";
import PlaylistPlayTwoToneIcon from "@material-ui/icons/PlaylistPlayTwoTone";
import PlaylistAddTwoToneIcon from "@material-ui/icons/PlaylistAddTwoTone";

import {
  button_styles,
  bar_styles,
  typo_styles,
  background_styles,
} from "../utils.js";

function randint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function HomePage() {
  //menu and style
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const button = button_styles();
  const typo = typo_styles();
  const bar = bar_styles();
  const background = background_styles();
  //

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
        className={background.main}
      >
        <div>
          <h1 className={typo.header}>Million $inger</h1>
          <Button
            className={button.blue}
            variant="contained"
            color="primary"
            onClick={startNow}
          >
            <PlayArrowTwoToneIcon fontSize={"large"} />
            Start Now
          </Button>
          <Button
            className={button.blue}
            variant="contained"
            color="primary"
            component={Link}
            to="/TourSelect"
          >
            <PlaylistPlayTwoToneIcon fontSize={"large"} />
            Select Tournament
          </Button>
          <Button
            className={button.blue}
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

      <Box>
        <div className={bar.above}>
          <AppBar position="static" style={{ background: "#0c032b" }}>
            <Toolbar variant="dense">
              <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MenuIcon className={bar.menubutton} />
              </IconButton>

              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/">
                  Home
                </MenuItem>
                <MenuItem component={Link} to="/TourSelect">
                  Select Tournament
                </MenuItem>
                <MenuItem component={Link} to="/Edit">
                  Edit Your Game
                </MenuItem>
              </Menu>

              <b className={typo.sign}>CNL gourp #7</b>

              <div className={bar.loginbutton}>
                <Button className={button.white}>login</Button>
              </div>
            </Toolbar>
          </AppBar>
        </div>
      </Box>
    </>
  );
}
