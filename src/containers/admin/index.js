import React from "react";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import img_dark from "../../images/bg_dark.jpg";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(0),
    paddingTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    margin: theme.spacing(3, 0, 2),
  },
  BackGround: {
    backgroundImage: `url(${img_dark})`,
    Width: "100%",
    height: "95vh",
    paddingTop: "0%",
    marginTop: "0%",
  },
  title: {
    padding: theme.spacing(1),
    color: "#FFFFFF",
    fontSize: "5em",
    fontFamily: "DejaVu Sans Mono, monospace",
    fontStyle: "normal",
  },
}));

export default function Admin() {
  const classes = useStyles();

  return (
    <Box className={classes.BackGround}>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography component="h1" variant="h4" className={classes.title}>
            Edit Game
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            fullWidth
            component={Link}
            to="/admin/Song/New"
          >
            New Song
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            fullWidth
            component={Link}
            to="/admin/Collect/New"
          >
            New Collect
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            fullWidth
            component={Link}
            to="/admin/Tournament/New"
          >
            New Tournament
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            fullWidth
            component={Link}
            to="/admin/Song/Delete"
          >
            Delete Song
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            fullWidth
            component={Link}
            to="/admin/Collect/Delete"
          >
            Delete Collect
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            fullWidth
            component={Link}
            to="/admin/Tournament/Delete"
          >
            Delete Tournament
          </Button>
        </div>
      </Container>
    </Box>
  );
}
