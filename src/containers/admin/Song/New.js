import React, { useState, useEffect, useRef, useCallback } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import FormHelperText from "@material-ui/core/FormHelperText";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Divider from "@material-ui/core/Divider";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";

import Loading from "../../../components/Loading";

import { languageCodeMap } from "../../../utils";
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

const FORM_STATE_INIT = 0;
const FORM_STATE_CHECKED = 1;
const FORM_STATE_FINAL = 2;

// ========================================

function parseYoutubeURL(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : "";
}

// ========================================

function CheckSongForm({ setSubtitles, setTitle, setFormState }) {
  const classes = useStyles();

  // ========================================
  // Handle input fields

  const [songURL, setSongURL] = useState("");

  const handleChange = (e) => {
    setSongURL(e.target.value);
  };

  // ========================================
  // Helper functions

  const fetchCaption = useCallback(
    async (videoID) => {
      const res = await fetch(
        `${SERVER_URL}/api/game/captions/youtube?url=https://www.youtube.com/watch?v=${videoID}`
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.msg);
        return false;
      }
      const newSubtitles = Object.entries(json.data).map(
        ([langCode, baseURL]) => {
          return {
            langCode,
            baseURL,
            langTranslated: languageCodeMap.get(langCode),
          };
        }
      );
      setSubtitles(newSubtitles);
      return true;
    },
    [setSubtitles]
  );

  const fetchTitle = useCallback(
    async (videoID) => {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=AIzaSyAuBJUeyvZkZaXHFNSjamWMkJjhk27Ccb0&part=snippet&id=${videoID}`
      );
      const json = await res.json();
      if (!json.pageInfo.totalResults) {
        setError("No results");
        return false;
      }
      setTitle(json.items[0].snippet.title);
      return true;
    },
    [setTitle]
  );

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
        let ok;
        const videoID = parseYoutubeURL(songURL);
        ok = await fetchCaption(videoID);
        if (!ok) return;
        ok = await fetchTitle(videoID);
        if (!ok) return;
        setError(null);
        setFormState(FORM_STATE_CHECKED);
        setIsSending(false);
      } catch (err) {
        setError(err.message);
      } finally {
        if (isMounted.current) setIsSending(false);
      }
    },
    [fetchCaption, fetchTitle, isSending, songURL, setFormState]
  );

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <TextField
        error={Boolean(error)}
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="songURL"
        label="Song URL (Youtube only)"
        placeholder="https://www.youtube.com/watch?v=60ItHLz5WEA"
        name="songURL"
        value={songURL}
        onChange={handleChange}
      />
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
        Check
      </Button>
    </form>
  );
}

function SubtitleForm({ title, subtitles, setFormState }) {
  const classes = useStyles();

  // ========================================
  // Handle input fields

  const [subtitle, setSubtitle] = useState("");

  const handleSubtitleChange = (e) => {
    setSubtitle(e.target.value);
  };

  const [useYoutubeSubtitle, setUseYoutubeSubtitle] = useState(true);

  const handleSwitchChange = (e) => {
    setUseYoutubeSubtitle(e.target.checked);
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
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        if (isMounted.current) setIsSending(false);
      }
    },
    [isSending]
  );

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Typography
        component="h2"
        variant="h5"
        align="left"
        style={{ marginTop: "1em" }}
      >
        Title: {title}
      </Typography>
      <Typography
        component="h2"
        variant="h5"
        align="left"
        style={{ marginTop: "1em" }}
      >
        Subtitle:
      </Typography>
      <FormGroup>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Language</InputLabel>
          <Select
            id="subtitle"
            value={subtitle}
            onChange={handleSubtitleChange}
          >
            {subtitles.map((subtitle) => (
              <MenuItem key={subtitle.langCode} value={subtitle.langCode}>
                {subtitle.langTranslated}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={useYoutubeSubtitle}
              onChange={handleSwitchChange}
              name="useYoutubeSubtitle"
            />
          }
          label="Use Youtube cc subtitle"
        />
      </FormGroup>
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
  );
}

// ========================================

export default function SongNew() {
  const classes = useStyles();
  const [formState, setFormState] = useState(FORM_STATE_INIT);
  const [languages, setLanguages] = useState(null);
  const [genres, setGenres] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitles, setSubtitles] = useState([]);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/game/languages`)
      .then((res) => res.json())
      .then((json) => {
        setLanguages(json.data);
      })
      .catch((e) => console.error(e));
    fetch(`${SERVER_URL}/api/game/genres`)
      .then((res) => res.json())
      .then((json) => {
        setGenres(json.data);
      })
      .catch((e) => console.error(e));
  }, []);

  // ========================================
  // Handle input fields

  const [state, setState] = useState({
    songURL: "",
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
        //const res = await fetch(`${SERVER_URL}/api/game/tours/new`, {
        //  method: "POST",
        //  body: JSON.stringify({
        //    title: state.title,
        //    collects: collects
        //      .filter((collect) => collect.selected)
        //      .map((collect) => collect.id),
        //  }),
        //  headers: {
        //    "content-type": "application/json",
        //  },
        //});
        //if (res.ok) {
        //  setDialogIsOpen(true);
        //} else {
        //  throw new Error("Invalid format");
        //}
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        if (isMounted.current) setIsSending(false);
        setState({ ...state, songURL: "" });
      }
    },
    [isSending, state]
  );

  // ========================================

  return languages && genres ? (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          New Song
        </Typography>
        {formState === FORM_STATE_INIT && (
          <CheckSongForm
            setSubtitles={setSubtitles}
            setTitle={setTitle}
            setFormState={setFormState}
          />
        )}
        {formState === FORM_STATE_CHECKED && (
          <SubtitleForm title={title} subtitles={subtitles} />
        )}
        {formState === FORM_STATE_FINAL && <h1>Final</h1>}
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
