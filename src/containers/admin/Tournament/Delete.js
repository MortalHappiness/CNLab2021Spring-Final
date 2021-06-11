import React, { useState, useEffect, useRef, useCallback } from "react";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import FormHelperText from "@material-ui/core/FormHelperText";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Divider from "@material-ui/core/Divider";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import Loading from "../../../components/Loading";

import { SERVER_URL } from "../../../constants.json";

// ========================================

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  errorMsg: {
    textAlign: "center",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  dialogTitle: {
    textAlign: "center",
  },
}));

export default function TournamentDelete() {
  const classes = useStyles();
  const [tours, setTours] = useState(null);

  const fetchTours = useCallback(async () => {
    fetch(`${SERVER_URL}/api/v2/game/tours`)
      .then((res) => res.json())
      .then((json) => {
        const data = json.data;
        data.forEach((tour) => {
          tour.selected = false;
        });
        setTours(data);
      })
      .catch((e) => console.error(e));
  }, []);

  // Fetch tours
  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  // ========================================
  // Handle input fields

  const [state, setState] = useState({
    tourID: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    setState({
      ...state,
      [name]: e.target.value,
    });
  };

  // ========================================
  // Dialog control (Success dialog)
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const handleDialogClose = () => {
    setDialogIsOpen(false);
  };

  // ========================================

  // Handle submit
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  // set isMounted to false when we unmount the component
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (isSending) return;
      setIsSending(true);
      try {
        const res = await fetch(
          `${SERVER_URL}/api/game/tours/${state.tourID}`,
          { method: "DELETE" }
        );
        if (res.ok) {
          setDialogIsOpen(true);
        } else {
          throw new Error("Invalid format");
        }
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        await fetchTours();
        if (isMounted.current) setIsSending(false);
      }
    },
    [isSending, state.tourID, fetchTours]
  );

  // ========================================

  return tours ? (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          Delete Tournament
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Tournaments</FormLabel>
            <RadioGroup
              aria-label="tourID"
              name="tourID"
              value={state.tourID}
              onChange={handleChange}
            >
              {tours.map((tour) => (
                <FormControlLabel
                  key={tour.id}
                  value={`${tour.id}`}
                  control={<Radio />}
                  label={tour.title}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <FormHelperText error={Boolean(error)} className={classes.errorMsg}>
            {error}
          </FormHelperText>
          <Button
            type="submit"
            disabled={isSending}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      </div>
      <Dialog
        aria-label="dialog"
        open={dialogIsOpen}
        fullWidth
        maxWidth="xs"
        onClose={handleDialogClose}
      >
        <DialogTitle className={classes.dialogTitle}>
          <b>Success!</b>
        </DialogTitle>
        <Divider />
        <DialogActions>
          <Button
            autoFocus
            fullWidth
            onClick={handleDialogClose}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  ) : (
    <Loading />
  );
}
