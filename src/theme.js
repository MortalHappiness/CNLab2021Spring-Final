import { createMuiTheme } from "@material-ui/core/styles";

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#48abe4",
      contrastText: "#ffffff",
    },
    //secondary: {
    //  main: "#f50057",
    //},
    //error: {
    //  main: "#f44366",
    //},
    //background: {
    //  default: "#fafafa",
    //},
  },
});

export default theme;
