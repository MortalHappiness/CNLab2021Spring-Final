import React from "react";

import { Button } from "@material-ui/core";

export default function HomePage() {
  return (
    <div>
      <h1>Million $singer</h1>
      <Button variant="contained" color="primary">
        Start Now
      </Button>
      <Button variant="contained" color="primary">
        Select Tournament
      </Button>
      <Button variant="contained" color="primary">
        Edit Your Game
      </Button>
    </div>
  );
}
