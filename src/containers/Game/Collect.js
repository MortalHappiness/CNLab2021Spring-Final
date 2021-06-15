import React from "react";

import { SERVER_URL } from "../../constants.json";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import { useTypoStyles, useBackgroundStyles } from "../../styles";

export default function Collect({ updatePlaySong, collect }) {
  const typoClasses = useTypoStyles();
  const backgroundClasses = useBackgroundStyles();

  const fetchSong = (songID) => {
    fetch(`${SERVER_URL}/api/game/songs/${songID}`)
      .then((res) => res.json())
      .then((json) => {
        updatePlaySong(json.data);
      })
      .catch((e) => console.error(e));
  };

  return (
    <>
      <Box
        position="relative"
        height="95vh"
        display="flex"
        flexDirection="column"
        className={backgroundClasses.main}
      >
        <div>
          <h2 className={typoClasses.subheader}>Song Selection</h2>
        </div>

        <div>
          <ul>
            {collect &&
              collect.songs.map((song) => (
                <Box key={song.id} m={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => fetchSong(song.id)}
                  >
                    {song.singer} {song.name}
                  </Button>
                </Box>
              ))}
          </ul>
        </div>
      </Box>
    </>
  );
}
