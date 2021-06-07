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
    color: 'black',
    height: 48,
    padding: '0 30px',
	margin: 32,
	fontSize: 30,
	fontFamily: 'monospace',
  },
});

const bar_styles = makeStyles((theme) => ({
  above: {
    flexGrow: 1,
	color: "#283747",
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
      <Button className={button.blue} variant="contained" color="primary" onClick={startNow}>
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
      <Button className={button.blue} variant="contained" color="primary" component={Link} to="/Edit">
        Edit Your Game
      </Button>
    </div>
  </Box>
  <Box>
	<div className={bar.above}>
      <AppBar position="static" style={{ background:'#17202A'}}>
        <Toolbar variant="dense">	
	      <b className={typo.sign}>		  
			CNL gourp#7
		  </b>
        </Toolbar>
      </AppBar>
    </div>
  </Box>
  </>
  );
}
