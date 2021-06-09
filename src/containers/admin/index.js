import React from "react";
import { Link } from "react-router-dom";

import Button from "@material-ui/core/Button";

export default function Admin() {
  return (
    <div style={{ marginTop: 50 }}>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/Edit/Song"
      >
        Edit Song
      </Button>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/Edit/Collect"
      >
        Edit Collect
      </Button>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/Edit/Tournament"
      >
        Edit Tournament
      </Button>
    </div>
  );
}
