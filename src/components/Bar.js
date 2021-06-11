import React from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";

import { useButtonStyles, useTypoStyles } from "../styles";

export const useStyles = makeStyles({
  above: {
    flexGrow: 1,
    color: "#283747",
  },
  loginbutton: {
    marginLeft: "auto",
  },
});

export default function Bar() {
  //menu and style
  const buttonClasses = useButtonStyles();
  const typoClasses = useTypoStyles();
  const barClasses = useStyles();
  return (
    <Box>
      <div className={barClasses.above}>
        <AppBar position="static" style={{ background: "#0c032b" }}>
          <Toolbar variant="dense">
            <IconButton style={{ color: "white" }} component={Link} to="/">
              <HomeIcon />
            </IconButton>
            <b className={typoClasses.sign}>CNL Group #7</b>

            <div className={barClasses.loginbutton}>
              <Button
                className={buttonClasses.white}
                component={Link}
                to="/TourSelect"
              >
                Tournament
              </Button>
              <Button
                className={buttonClasses.white}
                component={Link}
                to="/admin"
              >
                Edit
              </Button>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    </Box>
  );
}
