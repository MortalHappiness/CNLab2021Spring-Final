import { makeStyles } from "@material-ui/core/styles";
import img from "../images/bg.jpg";
import img_light from "../images/bg_light.jpg";
import img_dark from "../images/bg_dark.jpg";

export const button_styles = makeStyles({
  blue: {
    background: "#a994f0",
    border: 0,
    borderRadius: 6,
    color: "#white",
    height: 48,
    padding: "0 30px",
    margin: 32,
    fontSize: 30,
    fontFamily: "monospace",
  },
  white: {
    fontFamily: "monospace",
    fontSize: 20,
    color: "white",
  },
});

export const bar_styles = makeStyles((theme) => ({
  above: {
    flexGrow: 1,
    color: "#283747",
  },
  loginbutton: {
    marginLeft: "auto",
  },
  menubutton: {
    color: "white",
  },
}));

export const typo_styles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(1),

    color: "white",
    fontSize: 150,
    fontFamily: "DejaVu Sans Mono, monospace",
    fontStyle: "normal",
  },
  sign: {
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: 20,
    fontFamily: "DejaVu Sans Mono, monospace",
    fontStyle: "normal",
  },
  subheader: {
    padding: theme.spacing(1),

    color: "white",
    fontSize: 60,
    fontFamily: "DejaVu Sans Mono, monospace",
    fontStyle: "normal",
  },
  songheader: {
    padding: theme.spacing(1),

    color: "white",
    fontSize: 50,
    fontFamily: "DejaVu Sans Mono, monospace",
    fontStyle: "normal",
  },
}));

export const background_styles = makeStyles((theme) => ({
  main: {
    backgroundImage: `url(${img})`,
    width: "100%",
  },
  light: {
    backgroundImage: `url(${img_light})`,
    width: "100%",
  },
  dark: {
    backgroundImage: `url(${img_dark})`,
    width: "100%",
  },
}));
