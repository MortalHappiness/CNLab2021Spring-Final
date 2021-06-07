import React from "react";

import { SERVER_URL } from "../../constants.json";
import Button from "@material-ui/core/Button";

export default function Collect({ updatePlaySong, collect }) {
  const fetchSong = (songID) => {
    fetch(`${SERVER_URL}/api/game/songs/${songID}`)
      .then((res) => res.json())
      .then((json) => {
        updatePlaySong(json.data);
      })
      .catch((e) => console.error(e));
  };

  return (
    <div>
      <ul>
        {collect &&
          collect.songs.map((song) => (
            <Button
              variant="contained"
              color="primary"
              onClick={() => fetchSong(song.id)}>
              {song.singer} {song.name}
            </Button>
          ))}
      </ul>
    </div>
  );
}
