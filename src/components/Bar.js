import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles.js";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";

import { useButtonStyles, useBarStyles, useTypoStyles } from "../styles";

export default function Bar() {
  //menu and style
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const buttonClasses = useButtonStyles();
  const typoClasses = useTypoStyles();
  const barClasses = useBarStyles();
  return (
    <Box>
      <div className={barClasses.above}>
        <AppBar position="static" style={{ background: "#0c032b" }}>
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
  );
}
