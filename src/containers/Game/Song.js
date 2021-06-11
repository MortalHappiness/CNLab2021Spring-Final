import React, { useState, useRef } from "react";

import ButtonGroup from "@material-ui/core/ButtonGroup";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import IconButton from "@material-ui/core/IconButton";

import { useTypoStyles, useBackgroundStyles } from "../../styles";
import { useVideoStyles } from "../../components/VideoStyle.js"

const uselyricStyles = makeStyles({
  main: {
    color: "#FFFFFF",
    fontSize: "2em",
    fontFamily: "DejaVu Sans Mono, monospace",
    fontStyle: "normal",
  },
  front: {
    fontSize: "1.5em",
    fontFamily: "DejaVu Sans Mono, monospace",
    fontStyle: "normal",
    color: "#FF0000",
  },
  behind: {
    fontSize: "1.5em",
    fontFamily: "DejaVu Sans Mono, monospace",
    fontStyle: "normal",
    color: "#FF0000",
  },
});

const useBottonStyles = makeStyles({
  main: {
    display: "inline-block",
    color: "white",
  },
  other: {
    display: "inline-block",
    color: "white",
  },
});

// const videoStyles = {
  // main: {
    // width: "100%",
    // height: "100%",
	// marginLeft: "auto",
	// marginRight: "auto",
	// marginTop: "0%",
	// marginBottom: "0%",
  // },
// };

const useLyricsBoxStyles = makeStyles({
  root: {
    backgroundClasses: "white",
	marginTop: "2%",
    marginLeft: "5%",
    marginRight: "5%",
    boxShadow: "none",
	display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  transparent: {
    marginTop: "2%",
  },
});

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
  const typoClasses = useTypoStyles();
  const backgroundClasses = useBackgroundStyles();
  const VideoStyle = useVideoStyles();
  const lyricStyles = uselyricStyles();
  const BottonStyles = useBottonStyles();
  const lyricsBoxStyles = useLyricsBoxStyles();
  
  
  const YT = window.YT;
  const player = useRef(null);
  const interval = useRef(null);

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
    interval.current = setInterval(() => {
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
          clearInterval(interval.current);
          interval.current = null;
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
    <Box>
      <Box
        position="relative"
        height="140vh"
        display="flex"
        flexDirection="column"
        className={backgroundClasses.dark}
      >
        <div>
          {song && (
            <h2 className={typoClasses.songheader}>
              {song.name} - {song.singer}
            </h2>
          )}
          <div id="player" className={VideoStyle.main}/>
          {isNotStart && (
            <IconButton variant="secondary" onClick={playVideo}>
              <PlayCircleOutlineIcon fontSize={"large"} />
            </IconButton>
          )}

          
          <Box
            className={lyricsBoxStyles.root}
          >
            <Typography variant="subtitle1" className={lyricStyles.front}>
              {prevLine}
            </Typography>

            <Typography variant="subtitle1" className={lyricStyles.main}>
              {line}
            </Typography>

            <Typography variant="subtitle1" className={lyricStyles.behind}>
              {nextLine}
            </Typography>
          </Box>

          <ButtonGroup>
            {missLyrics && (
              <Button
                variant="contained"
                color="primary"
                className={BottonStyles.main}
                onClick={showMissLyrics}
              >
                Show Answer
              </Button>
            )}
            {showContinuePlay && (
              <Button
                variant="contained"
                color="primary"
                className={BottonStyles.other}
                onClick={continuePlaying}
              >
                Continue Playing
              </Button>
            )}
          </ButtonGroup>
        </div>
      </Box>
    </Box>
  );
}
