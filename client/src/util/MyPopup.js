import React from "react";
import { Popup } from "semantic-ui-react";

export default function ({ content, children }) {
  return <Popup content={content} inverted trigger={children}></Popup>;
}
