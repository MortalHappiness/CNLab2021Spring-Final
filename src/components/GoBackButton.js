import React from "react";
import { useHistory } from "react-router-dom";

import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

export default function GoBackButton() {
  const history = useHistory();

  const handleClick = () => {
    history.goBack();
  };

  return (
    <IconButton onClick={handleClick}>
      <ArrowBackIcon />
    </IconButton>
  );
}
