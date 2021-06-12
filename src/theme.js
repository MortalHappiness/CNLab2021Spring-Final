import { createMuiTheme } from "@material-ui/core/styles";

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#977bf4",
      contrastText: "#ffffff",
    },
    //  secondary: {
    //    main: "#ffffff",
    //    contrastText: "#ffffff",
    //  },
    //  error: {
    //    main: "#ffffff",
    //  },
    //  background: {
    //    default:"#ffffff",
    //  },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

export default theme;
