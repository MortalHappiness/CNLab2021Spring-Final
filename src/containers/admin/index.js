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
        to="/admin/Song/New"
      >
        Edit Song
      </Button>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/admin/Collect/New"
      >
        Edit Collect
      </Button>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/admin/Tournament/New"
      >
        Edit Tournament
      </Button>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/admin/Tournament/Delete"
      >
        Delete Tournament
      </Button>
    </div>
  );
}
