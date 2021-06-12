import React, { useState, useEffect, useRef, useCallback } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Divider from "@material-ui/core/Divider";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";
import Input from "@material-ui/core/Input";

import xml2js from "xml2js";
import { promisify } from "util";
import { encode as b64encode } from "js-base64";

import Loading from "../../../components/Loading";

import { languageCodeMap } from "../../../utils";
import { SERVER_URL } from "../../../constants.json";

// ========================================

const parseXMLString = promisify(xml2js.parseString);

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
// Helper functions

function parseYoutubeURL(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : "";
}

// Reference:
// https://stackoverflow.com/questions/34495796/javascript-promises-with-filereader
function readFile(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.onerror = reject;
    fr.readAsText(file, "UTF-8");
  });
}

// ========================================

function CheckSongForm({
  songURL,
  setSongURL,
  setSubtitles,
  setTitle,
  setFormState,
}) {
  const classes = useStyles();

  // ========================================
  // Handle input fields

  const handleChange = (e) => {
    setSongURL(e.target.value);
  };

  // ========================================
  // Helper functions

  const fetchTitle = useCallback(
    async (videoID) => {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?key=AIzaSyAuBJUeyvZkZaXHFNSjamWMkJjhk27Ccb0&part=snippet&id=${videoID}`
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.error.message);
        return false;
      }
      if (!json.pageInfo.totalResults) {
        setError("No results");
        return false;
      }
      setTitle(json.items[0].snippet.title);
      return true;
    },
    [setTitle]
  );

  const fetchCaption = useCallback(
    async (videoID) => {
      const res = await fetch(
        `${SERVER_URL}/api/game/captions/youtube?url=https://www.youtube.com/watch?v=${videoID}`
      );
      const json = await res.json();
      if (!res.ok) return;
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
    },
    [setSubtitles]
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
        const videoID = parseYoutubeURL(songURL);
        const ok = await fetchTitle(videoID);
        if (!ok) return;
        await fetchCaption(videoID);
        setError(null);
        setFormState(FORM_STATE_CHECKED);
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

function SubtitleForm({
  title,
  setFileContent,
  setFiletype,
  language,
  setLanguage,
  subtitles,
  languages,
  setFormState,
  setLines,
}) {
  const classes = useStyles();

  // ========================================
  // Handle input fields

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const switchDisabled = !Boolean(subtitles.length);
  const [useCustomSubtitle, setUseCustomSubtitle] = useState(switchDisabled);

  const handleSwitchChange = (e) => {
    setLanguage("");
    setUseCustomSubtitle(e.target.checked);
  };

  const [file, setFile] = useState("");
  const handleFileChange = (e) => {
    setFile(e.target.value);
  };

  const fileRef = useRef();

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

  const handleSubmit = async (e) => {
    console.log("hello world");
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    try {
      if (!useCustomSubtitle) {
        // Download subtitle from youtube
        let api;
        subtitles.forEach((x) => {
          if (x.langCode === language) api = x.baseURL;
        });
        const res = await fetch(api);
        const text = await res.text();
        const data = await parseXMLString(text);
        if (data.transcript.text) {
          const newLines = {};
          data.transcript.text
            .map((l) => l._.replace(/&#39;/g, "'"))
            .forEach((l, idx) => {
              newLines[idx] = { text: l, selected: false };
            });
          setLines(newLines);
        }
        setFiletype("youtube");
      } else {
        // Convert subtitle file to lines
        const f = fileRef.current.files[0];
        const fileContent = await readFile(f);
        const filetype = file.split(".").pop();
        const b64FileContent = b64encode(fileContent);
        const res = await fetch(`${SERVER_URL}/api/game/subtitles/convert`, {
          method: "POST",
          body: JSON.stringify({
            file_type: filetype,
            file: b64FileContent,
          }),
          headers: {
            "content-type": "application/json",
          },
        });
        const json = await res.json();
        const newLines = {};
        json.data
          .map((l) => l.line)
          .forEach((l, idx) => {
            newLines[idx] = { text: l, selected: false };
          });
        setLines(newLines);
        setFiletype(filetype);
        setFileContent(b64FileContent);
      }
      setError(null);
      setFormState(FORM_STATE_FINAL);
    } catch (err) {
      setError(err.message);
    } finally {
      if (isMounted.current) setIsSending(false);
    }
  };

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
          <InputLabel id="language-label">Language</InputLabel>
          <Select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            required
          >
            {!useCustomSubtitle
              ? subtitles.map((subtitle) => (
                  <MenuItem key={subtitle.langCode} value={subtitle.langCode}>
                    {subtitle.langTranslated}
                  </MenuItem>
                ))
              : languages.map((language) => (
                  <MenuItem key={language} value={language}>
                    {languageCodeMap.get(language)}
                  </MenuItem>
                ))}
          </Select>
        </FormControl>
      </FormGroup>
      {useCustomSubtitle && (
        <>
          <Typography
            id="continuous-slider"
            align="left"
            style={{ marginTop: "1em" }}
          >
            LRC/SRT file upload
          </Typography>
          <Input
            type="file"
            required
            fullWidth
            id="file"
            name="file"
            inputRef={fileRef}
            value={file}
            onChange={handleFileChange}
          />
        </>
      )}
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
        {useCustomSubtitle ? "Upload" : "Download cc subtitle from Youtube"}
      </Button>
      {!switchDisabled && (
        <FormControlLabel
          control={
            <Switch
              checked={useCustomSubtitle}
              onChange={handleSwitchChange}
              name="useCustomSubtitle"
            />
          }
          label="Use custom cc subtitle instead of Youtube"
        />
      )}
      <FormHelperText className={classes.errorMsg} error>
        {switchDisabled &&
          "There are no cc subtitles in this youtube url. Please upload your custom cc subtitle file."}
      </FormHelperText>
    </form>
  );
}

// ========================================

export default function SongNew() {
  const classes = useStyles();
  const [formState, setFormState] = useState(FORM_STATE_INIT);
  const [languages, setLanguages] = useState(null);
  const [genres, setGenres] = useState(null);
  const [songURL, setSongURL] = useState("");
  const [title, setTitle] = useState("");
  const [subtitles, setSubtitles] = useState([]);
  const [lines, setLines] = useState([]);
  const [language, setLanguage] = useState("");
  const [filetype, setFiletype] = useState("");
  const [fileContent, setFileContent] = useState("");

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
        const newGenres = {};
        json.data.forEach((genre) => {
          newGenres[genre] = false;
        });
        setGenres(newGenres);
      })
      .catch((e) => console.error(e));
  }, []);

  // ========================================
  // Handle input fields

  const [state, setState] = useState({
    artistName: "",
    songName: "",
  });

  const handleChange = (e) => {
    const name = e.target.name;
    setState({
      ...state,
      [name]: e.target.value,
    });
  };

  const handleGenreCheckboxChange = (key) => (e) => {
    setGenres({
      ...genres,
      [key]: e.target.checked,
    });
  };

  const handleLineCheckboxChange = (key) => (e) => {
    const newLines = { ...lines };
    newLines[key].selected = e.target.checked;
    setLines(newLines);
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
  const [songid, setSongid] = useState(null);
  const isMounted = useRef(true);

  // set isMounted to false when we unmount the component
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    try {
      const genresArray = [];
      Object.keys(genres).forEach((genre) => {
        if (genres[genre]) genresArray.push(genre);
      });
      const genresStr = genresArray.join();
      if (!genresStr) {
        setError("Please select genres");
        return;
      }

      const missLyricsArray = [];
      Object.keys(lines).forEach((key) => {
        if (lines[key].selected) missLyricsArray.push(parseInt(key));
      });
      if (!missLyricsArray.length) {
        setError("Please select lines");
        return;
      }

      const body = {
        url: songURL,
        singer: state.artistName,
        genre: genresStr,
        name: state.songName,
        language,
        file_type: filetype,
        miss_lyrics: missLyricsArray,
      };
      if (filetype !== "youtube") {
        body.file = fileContent;
      }

      const res = await fetch(`${SERVER_URL}/api/game/songs/new`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
        },
      });
      if (res.ok) {
        const json = await res.json();
        setSongid(json.data);
        setDialogIsOpen(true);
        setError(null);
      } else {
        const json = await res.json();
        setError(json.msg);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      if (isMounted.current) setIsSending(false);
    }
  };
  // ========================================

  return languages && genres ? (
    <Container component="main" maxWidth="sm">
      <div className={classes.paper}>
        <Typography component="h1" variant="h4">
          New Song
        </Typography>
        {formState === FORM_STATE_INIT && (
          <CheckSongForm
            songURL={songURL}
            setSongURL={setSongURL}
            setSubtitles={setSubtitles}
            setTitle={setTitle}
            setFormState={setFormState}
          />
        )}
        {formState === FORM_STATE_CHECKED && (
          <SubtitleForm
            setFileContent={setFileContent}
            setFiletype={setFiletype}
            language={language}
            setLanguage={setLanguage}
            title={title}
            subtitles={subtitles}
            languages={languages}
            setLines={setLines}
            setFormState={setFormState}
          />
        )}
        {formState === FORM_STATE_FINAL && (
          <form className={classes.form} onSubmit={handleSubmit}>
            <Typography
              component="h2"
              variant="h5"
              align="left"
              style={{ marginTop: "1em" }}
            >
              Title: {title}
            </Typography>
            <TextField
              error={Boolean(error)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="artistName"
              label="Artist Name"
              name="artistName"
              value={state.artistName}
              onChange={handleChange}
            />
            <TextField
              error={Boolean(error)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="artistName"
              label="Song Name"
              name="songName"
              value={state.songName}
              onChange={handleChange}
            />
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Genres</FormLabel>
              <FormGroup row>
                {Object.keys(genres).map((genre) => (
                  <FormControlLabel
                    key={genre}
                    control={
                      <Checkbox
                        checked={genres[genre]}
                        onChange={handleGenreCheckboxChange(genre)}
                        name={genre}
                      />
                    }
                    label={`${genre}`}
                  />
                ))}
              </FormGroup>
            </FormControl>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Lines</FormLabel>
              <FormGroup>
                {Object.keys(lines).map((key) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Checkbox
                        checked={lines[key].selected}
                        onChange={handleLineCheckboxChange(key)}
                        name={lines[key].text}
                      />
                    }
                    label={`[${key}] ${lines[key].text}`}
                  />
                ))}
              </FormGroup>
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
        )}
      </div>
      <Dialog
        aria-label="dialog"
        open={dialogIsOpen}
        fullWidth
        maxWidth="xs"
        onClose={handleDialogClose}
      >
        <DialogTitle className={classes.dialogTitle} songid={songid}>
          <b>Success! Song ID: {songid}</b>
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
