import React, { useState, useEffect } from "react";

import { SERVER_URL } from "../../constants.json";
import { Link } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";

import MusicIcon from "@material-ui/icons/AlbumTwoTone";

import {
  useButtonStyles,
  useBarStyles,
  useTypoStyles,
  useBackgroundStyles,
} from "../../styles";

export default function Tournament({ tourID, updatePlayCollect }) {
  //menu and style
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const buttonClasses = useButtonStyles();
  const typoClasses = useTypoStyles();
  const barClasses = useBarStyles();
  const backgroundClasses = useBackgroundStyles();

  const [collects, setCollects] = useState([]);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/game/tours/${tourID}`)
      .then((res) => res.json())
      .then((json) => {
        setCollects(json.data.collects);
      })
      .catch((e) => console.error(e));
  }, [tourID]);

  const fetchCollectSongs = (collectID) => {
    fetch(`${SERVER_URL}/api/game/collects/${collectID}`)
      .then((res) => res.json())
      .then((json) => {
        updatePlayCollect(json.data);
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
        className={backgroundClasses.dark}
      >
        <div>
          <h2 className={typoClasses.subheader}>Tournament #{tourID}</h2>
          {collects.map((collect) => (
            <Button
              onClick={() => fetchCollectSongs(collect.id)}
              key={collect.id}
              variant="contained"
              color="primary"
            >
              <MusicIcon fontSize={"large"} />
              {collect.title}
            </Button>
          ))}
        </div>
      </Box>
      <Box>
        <div className={barClasses.above}>
          <AppBar position="static" style={{ background: "#460625" }}>
            <Toolbar variant="dense">
              <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MenuIcon className={barClasses.menubutton} />
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

              <b className={typoClasses.sign}>CNL gourp #7</b>

              <div className={barClasses.loginbutton}>
                <Button className={buttonClasses.white}>login</Button>
              </div>
            </Toolbar>
          </AppBar>
        </div>
      </Box>
    </>
  );
}
