import React, { useState, useRef } from "react";

import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import IconButton from '@material-ui/core/IconButton'

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from "@material-ui/core/Button";
import Typography from '@material-ui/core/Typography';

import { button_styles, bar_styles, typo_styles, background_styles } from "../utils.js";

const lyric_styles = {
  main: {
    color: "#F00",
    fontSize: 25,
    fontFamily: 'DejaVu Sans Mono, monospace',
    fontStyle: 'normal',
  },
  front: {
    fontSize: 20,
    fontFamily: 'DejaVu Sans Mono, monospace',
    fontStyle: 'normal',
  },
  behind: {
    fontSize: 20,
    fontFamily: 'DejaVu Sans Mono, monospace',
    fontStyle: 'normal',
  },
};

const botton_styles = {
  main: {
    display: "inline-block",
  },
};

function renderHiddenAnswerLine(cur_line) {
  let line = "";
  for (let i = 0; i < cur_line.length; i++) {
    if (cur_line[i] !== " ") {
      line += "\u2B50";
    } else {
      line += " ";
    }
  }
  return line;
}

export default function Song({ song }) {
  //menu and style
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
  const button = button_styles();
  const typo = typo_styles();
  const bar = bar_styles();
  const background = background_styles();
  //

  const YT = window.YT;
  const player = useRef(null);

  const [prevLine, setPrevLine] = useState("");
  const [line, setLine] = useState("");
  const [nextLine, setNextLine] = useState("");
  const answerLine = useRef("");
  const afterMissLyrics = useRef(false);
  const [showContinuePlay, setShowContinuePlay] = useState(false);
  const [missLyrics, setMissLyrics] = useState(false);
  const [isNotStart, setIsNotStart] = useState(true);

  const isPaused = () =>
    player.current.getPlayerState() === YT.PlayerState.PAUSED;

  const showTime = () => {
    let currentLineIndex = 0;
    setInterval(() => {
      if (!isPaused()) {
        const currentTime = player.current.getCurrentTime() * 1000;
        let idx = -1;
        if (currentTime > song.lyrics[currentLineIndex].end_time) {
          currentLineIndex += 1;
        }
        idx = currentLineIndex;
        if (currentTime < song.lyrics[0].start_time) {
          idx = -1;
        }
        if (idx >= 0) {
          if (idx > 0) {
            setPrevLine(song.lyrics[idx - 1].line);
          }
          if (idx + 1 < song.lyrics.length) {
            setNextLine(song.lyrics[idx + 1].line);
          }
          setLine(song.lyrics[idx].line);
          if (idx + 1 === song.miss_lyric_id) {
            setNextLine(answerLine.current);
          }
        }
        if (!afterMissLyrics.current && idx === song.miss_lyric_id) {
          setMissLyrics(true);
          setShowContinuePlay(true);
          setLine(answerLine.current);
          player.current.pauseVideo();
        }
      }
    }, 10);
  };

  const onPlayerReady = () => {
    player.current.playVideo();
    setLine("♪♪ Music ♪♪");
    setNextLine(song.lyrics[0].line);
    answerLine.current = renderHiddenAnswerLine(
      song.lyrics[song.miss_lyric_id].line
    );
    showTime();
  };

  const initYoutube = () => {
    player.current = new YT.Player("player", {
      width: 600,
      height: 400,
      videoId: song.video_id,
      playerVars: {
        cc_load_policy: 0,
      },
      events: {
        onReady: onPlayerReady,
      },
    });
  };

  const playVideo = () => {
    initYoutube();
    setIsNotStart(false);
  };

  const showMissLyrics = () => {
    setLine(song.lyrics[song.miss_lyric_id].line);
    setMissLyrics(false);
  };
  const continuePlaying = () => {
    setShowContinuePlay(false);
    player.current.playVideo();
    showTime();
    afterMissLyrics.current = true;
  };

  return (
    <Box position="relative"
      height="95vh"
      display="flex"
      flexDirection="column"
      className={background.main}>
      <div>
        {song && (
          <Typography variant="h2" color="primary" fontSize={150} fontFamily='DejaVu Sans Mono, monospace' fontStyle='normal'>
            {song.name} - {song.singer}
          </Typography>
        )}
        <div id="player" />
        {isNotStart && <IconButton
          variant="contained"
          color="secondary"
          onClick={playVideo}>
          <PlayCircleOutlineIcon fontSize={'large'} color='primary' />

        </IconButton>}
        <h4>{prevLine}</h4>
        <Typography variant="h1" style={lyric_styles.main}>{line}</Typography>
        <h4>{nextLine}</h4>
        {missLyrics && <Button
          variant="contained"
          color="secondary"
          style={botton_styles.main}
          onClick={showMissLyrics}>Show Answer
		  </Button>}
        <br />
        {showContinuePlay && (
          <Button
            variant="contained"
            color="secondary"
            style={botton_styles.main}
            onClick={continuePlaying}>Continue Playing
          </Button>
        )}
      </div>
    </Box>
  );
}
