import React, { useState } from "react";
import { useParams } from "react-router-dom";

import Collect from "./Collect";
import Song from "./Song";
import Tournament from "./Tournament";

export default function Game() {
  const { TourID } = useParams();

  const STATE_INIT = 0;
  const STATE_COLLECT = 1;
  const STATE_SONG = 2;
  const [state, setState] = useState(STATE_INIT);

  const [collect, setCollect] = useState(null);
  const [song, setSong] = useState(null);
  const [playedCollectIDs, setPlayedCollectIDs] = useState([]);

  const updatePlayCollect = (collect) => {
    setState(STATE_COLLECT);
    setCollect(collect);
  };

  const updatePlaySong = (song) => {
    setState(STATE_SONG);
    setSong(song);
  };

  const handleFinished = () => {
    if (playedCollectIDs.includes(collect.id)) return;
    setPlayedCollectIDs([...playedCollectIDs, collect.id]);
  };

  return (
    <div>
      {state === STATE_INIT && (
        <Tournament
          tourID={TourID}
          updatePlayCollect={updatePlayCollect}
          playedCollectIDs={playedCollectIDs}
        />
      )}
      {state === STATE_COLLECT && (
        <Collect updatePlaySong={updatePlaySong} collect={collect} />
      )}
      {state === STATE_SONG && (
        <Song song={song} setState={setState} handleFinished={handleFinished} />
      )}
    </div>
  );
}
