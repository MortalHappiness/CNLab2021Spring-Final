import React, { useState, useEffect } from "react";

import { SERVER_URL } from "../../constants.json";
import Button from "@material-ui/core/Button";

export default function Tournament({ tourID, updatePlayCollect }) {
  const [collects, setCollects] = useState([]);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/game/tours/${tourID}`)
      .then((res) => res.json())
      .then((json) => {
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
    <div>
      <h2>Tournament #{tourID}</h2>
      {collects.map((collect) => (
        <Button
          onClick={() => fetchCollectSongs(collect.id)}
          variant="contained"
          color="primary"
        >
          {collect.title}
        </Button>
      ))}
    </div>
  );
}
