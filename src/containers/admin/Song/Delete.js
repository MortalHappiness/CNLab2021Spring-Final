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

export default function SongDelete() {
  const classes = useStyles();
  const [songs, setSongs] = useState(null);

  const fetchSongs = useCallback(async () => {
    fetch(`${SERVER_URL}/api/game/songs`)
      .then((res) => res.json())
      .then((json) => {
        const data = json.data;
        data.forEach((song) => {
          song.selected = false;
        });
        setSongs(data);
      })
      .catch((e) => console.error(e));
  }, []);

  // Fetch songs
  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  // ========================================
  // Handle input fields

  const [state, setState] = useState({
    songID: "",
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
          `${SERVER_URL}/api/game/songs/${state.songID}`,
          { method: "DELETE" }
        );
        if (res.ok) {
          setDialogIsOpen(true);
          setError(null);
        } else {
          const json = await res.json();
          setError(json.msg);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        await fetchSongs();
        if (isMounted.current) setIsSending(false);
      }
    },
    [isSending, state.songID, fetchSongs]
  );

  // ========================================

  return songs ? (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          Delete Song
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Songs</FormLabel>
            <RadioGroup
              aria-label="songID"
              name="songID"
              value={state.songID}
              onChange={handleChange}
            >
              {songs.map((song) => (
                <FormControlLabel
                  key={song.id}
                  value={`${song.id}`}
                  control={<Radio />}
                  label={song.name}
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
