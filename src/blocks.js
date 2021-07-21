import React from "react";

export const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

export const QuoteElement = (props) => {
  return <quote {...props.attributes}>{props.children}</quote>;
};

export const BulletedList = (props) => {
  return <ul {...props.attributes}>{props.children}</ul>;
};

export const ListItem = (props) => {
  return <li {...props.attributes}>{props.children}</li>;
};

export const NumberedList = (props) => {
  return <ol {...props.attributes}>{props.children}</ol>;
};

export const LinkElement = (props) => {
  return (
    <a href={props.element.url} {...props.attributes}>
      {props.children}
    </a>
  );
};

export const Leaf = (props) => {
  let fontWeight = "normal",
    fontStyle = "normal",
    textDecoration = "none",
    fontSize = "20px",
    color = "black";

  if (props.leaf.bold) {
    fontWeight = "bold";
  }

  if (props.leaf.italic) {
    fontStyle = "italic";
  }

  if (props.leaf.underline) {
    textDecoration = "underline";
  }

  if (props.leaf.fontSize) {
    fontSize = props.leaf.fontSize;
  }

  if (props.leaf.color) {
    color = props.leaf.color;
  }

  return (
    <span
      {...props.attributes}
      style={{
        color: color,
        fontSize: fontSize,
        fontWeight: fontWeight,
        fontStyle: fontStyle,
        textDecoration: textDecoration,
      }}
    >
      {props.children}
    </span>
  );
};
