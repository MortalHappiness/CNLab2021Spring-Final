import React from "react";
import { Link, useHistory } from "react-router-dom";

import { SERVER_URL } from "../constants.json";

import Button from "@material-ui/core/Button";

//
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { positions } from '@material-ui/system';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from '@material-ui/core/Typography';
import img from "./bg.jpg";
import { Container } from "@material-ui/core";

import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const typo_styles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(1),

    color: 'white',
    fontSize: 150,
    fontFamily: 'DejaVu Sans Mono, monospace',
    fontStyle: 'normal',
  },
  sign: {
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 20,
    fontFamily: 'DejaVu Sans Mono, monospace',
    fontStyle: 'normal',
  }
}));

const background_styles = {
  main: {
    backgroundImage: `url(${img})`,
    width: '100%',
  }
};

const button_styles = makeStyles({
  blue: {
    background: '#76D7C4',
    border: 0,
    borderRadius: 3,
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: 32,
    fontSize: 30,
    fontFamily: 'monospace',
  },
  white: {
    fontFamily: 'monospace',
    fontSize: 20,
    color: 'white',
  }
});

const bar_styles = makeStyles((theme) => ({
  above: {
    flexGrow: 1,
    color: "#283747",
  },
  loginbutton: {
    marginLeft: 'auto',
  },
  menubutton: {
    color: 'white'
  }
}));

//

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

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const tourselect = () => {
    setAnchorEl(null);
  };

  //
  const button = button_styles();
  const typo = typo_styles();
  const bar = bar_styles();
  //
  return (
    <>
      <Box position="relative" height="95vh" display="flex" flexDirection="column" style={background_styles.main}>
        <div>
          <h1 className={typo.header}>Million $inger</h1>
          <Button
            className={button.blue}
            variant="contained"
            color="primary"
            onClick={startNow}>
            Start Now
          </Button>
          <Button className={button.blue}
            variant="contained"
            color="primary"
            component={Link}
            to="/TourSelect"
          >
            Select Tournament
          </Button>
          <Button
            className={button.blue}
            variant="contained"
            color="primary"
            component={Link}
            to="/Edit">
            Edit Your Game
          </Button>
        </div>
      </Box>

      <Box>
        <div className={bar.above}>
          <AppBar
            position="static"
            style={{ background: '#17202A' }}>
            <Toolbar variant="dense">
              <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                className>
                <MenuIcon className={bar.menubutton} />
              </IconButton>

              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  component={Link}
                  to="/">
                  Home
                </MenuItem>
                <MenuItem onClick={startNow}>Start Now</MenuItem>
                <MenuItem
                  component={Link}
                  to="/TourSelect">
                  Select Tournament
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/Edit">
                  Edit Your Game
                  </MenuItem>
              </Menu>

              <b className={typo.sign}>
                CNL gourp#7
		          </b>

              <div className={bar.loginbutton}>
                <Button className={button.white}>
                  login
              </Button>
              </div>
            </Toolbar>
          </AppBar>
        </div>
      </Box>
    </>

  );
}
