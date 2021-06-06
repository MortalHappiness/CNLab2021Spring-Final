import React, { useState, useRef } from "react";

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
    <div>
      {song && (
        <h2>
          {song.name} - {song.singer}
        </h2>
      )}
      <div id="player" />
      {isNotStart && <button onClick={playVideo}>play</button>}
      <h4>{prevLine}</h4>
      <h2>{line}</h2>
      <h4>{nextLine}</h4>
      {missLyrics && <button onClick={showMissLyrics}>Show Answer</button>}
      <br />
      {showContinuePlay && (
        <button onClick={continuePlaying}>Continue Playing</button>
      )}
    </div>
  );
}
