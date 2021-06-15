import React, { useState, useEffect } from "react";

import { SERVER_URL } from "../../constants.json";

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import MusicIcon from "@material-ui/icons/AlbumTwoTone";

import { useTypoStyles, useBackgroundStyles } from "../../styles";

export default function Tournament({
  tourID,
  updatePlayCollect,
  playedCollectIDs,
}) {
  const typoClasses = useTypoStyles();
  const backgroundClasses = useBackgroundStyles();

  const [title, setTitle] = useState("");
  const [collects, setCollects] = useState([]);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/game/tours/${tourID}`)
      .then((res) => res.json())
      .then((json) => {
        setTitle(json.data.title);
        setCollects(json.data.collects);
      })
      .catch((e) => console.error(e));
  }, [tourID]);

  const fetchCollectSongs = (collectID) => {
    fetch(`${SERVER_URL}/api/game/collects/${collectID}`)
      .then((res) => res.json())
      .then((json) => {
        updatePlayCollect(json.data);
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
        flexWrap="wrap"
        className={backgroundClasses.main}
      >
        <div>
          <h2 className={typoClasses.subheader}>{title}</h2>
          {collects.map((collect) => (
            <Button
              onClick={() => fetchCollectSongs(collect.id)}
              key={collect.id}
              variant="contained"
              color="primary"
              disabled={playedCollectIDs.includes(collect.id)}
            >
              <MusicIcon fontSize={"large"} />
              {collect.title}
            </Button>
          ))}
        </div>
      </Box>
    </>
  );
}
