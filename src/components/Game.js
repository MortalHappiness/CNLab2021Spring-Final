import React from "react";
import { useParams } from "react-router-dom";

export default function Game() {
  const { TourID } = useParams();
  return <h1>game {TourID}</h1>;
}
