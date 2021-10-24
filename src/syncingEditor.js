import React, { useState, useRef, useEffect } from "react";

import { createEditor, Editor } from "slate";

import { Slate, Editable, withReact } from "slate-react";

import initialValue from "./slateInitialValue";
import {
  CodeElement,
  Leaf,
  LinkElement,
  NumberedList,
  BulletedList,
  ListItem,
  QuoteElement,
} from "./blocks";

import CustomEditor from "./customEditor";

import { FaBold, FaItalic, FaUnderline } from "react-icons/fa";
import {
  BiAlignLeft,
  BiCode,
  BiAlignRight,
  BiLinkAlt,
  BiFontColor,
  BiFontSize,
} from "react-icons/bi";
import { FiAlignCenter } from "react-icons/fi";

import Modal from "react-modal";

import io from "socket.io-client";
import { BACKEND_URL, PROD_BACKEND_URL } from "./url";

const backendURL = PROD_BACKEND_URL;

const socket = io(backendURL);

// interface Props {
//   groupId?: string;
// }

const SyncingEditor = ({ groupId }) => {
  // console.log(groupId);

  const editor = useRef(withReact(createEditor()));
  // Add the initial value when setting up our state.
  const [value, setValue] = useState([initialValue]);
  const [num, setNum] = useState(0);
  const [isColor, setColor] = useState(false);
  const [isSize, setSize] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [linkValue, setLinkValue] = useState({ link: "", text: "Hello" });
  const [currEditor, setcurrEditor] = useState(editor.current);

  const id = useRef(socket.id);
  const remote = useRef(false);
  const group = useRef(groupId);

  useEffect(() => {
    // console.log(socket.id);
    // id.current = socket.id;
    if (group.current) {
      socket.emit("initialize", group.current);
    } else {
      fetch(`${backendURL}create`)
        .then((x) => x.json())
        .then((data) => {
          //<Redirect to={`/${data.groupId}`} />
          socket.emit("initialize", data.groupId);
          group.current = data.groupId;
        })
        .catch((err) => console.log("error", err));
    }

    socket.on("new-remote-operations", ({ editorId, ops }) => {
      // console.log(ops);
      // console.log(id.current);
      if (id.current !== editorId) {
        remote.current = true;
        //console.log(ops);
        JSON.parse(ops).forEach((op) => {
          if (op.type !== "merge_node" && op.type !== "insert_node") {
            editor.current.apply(op);
          }
        });
        remote.current = false;
      }
    });

    // socket.io.on("open", () => {
    //   console.log(socket.id);
    //   id.current = socket.id;
    // })

    socket.io.on("reconnect", () => {
      socket.emit("initialize", group.current);
    });

    return () => {
      socket.off("new-remote-operations");
    };
  }, []);

  useEffect(() => {
    // console.log(socket.id);
    id.current = socket.id;
  }, [socket.id]);

  useEffect(() => {
    socket.on("update-members", (mem) => {
      setNum(mem);
    });

    return () => {
      socket.off("update-members");
    };
  }, [num]);

  useEffect(() => {
    socket.on("send-data", (val) => {
      // console.log(val[0].children[0].text);
      remote.current = true;
      setValue(val);
      remote.current = false;
    });
    socket.on("get-data", (id) => {
      if (socket.id !== id) {
        // console.log("Sending", value);
        socket.emit("send-data", { value: value, id: group.current });
      }
    });

    return () => {
      socket.off("send-data");
      socket.off("get-data");
    };
  }, [value]);

  const renderElement = React.useCallback((props) => {
    switch (props.element.type) {
      case "quote":
        return <QuoteElement {...props} />;
      case "code":
        return <CodeElement {...props} />;
      case "link":
        return <LinkElement {...props} />;
      case "numbered-list":
        return <NumberedList {...props} />;
      case "ordered-list":
        return <BulletedList {...props} />;
      case "list-item":
        return <ListItem {...props} />;
      default:
        return (
          <p
            {...props.attributes}
            style={{ textAlign: props.element.alignment }}
          >
            {props.children}
          </p>
        );
    }
  }, []);

  const renderLeaf = React.useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <div
      style={{
        minHeight: "1000px",
        paddingBottom: "30px",
        backgroundColor: "white",
      }}
      // onMouseDown={(event) => {
      //   event.preventDefault();
      //   if (isColor) {
      //     setColor(false);
      //   }

      //   if (isSize) {
      //     setSize(false);
      //   }
      // }}
    >
      {isColor ? (
        <div
          style={{
            backgroundColor: "lightgray",
            position: "absolute",
            top: "180px",
            left: "66%",
            width: "90px",
            height: "auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "repeat(3, 20px)",
            paddingLeft: "10px",
            paddingTop: "10px",
            paddingBottom: "10px",
            borderRadius: "10px",
          }}
        >
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontColor(editor.current, "red");
            }}
            style={{
              height: "15px",
              width: "15px",
              borderRadius: "50%",
              backgroundColor: "red",
            }}
          ></div>
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontColor(editor.current, "black");
            }}
            style={{
              height: "15px",
              width: "15px",
              borderRadius: "50%",
              backgroundColor: "black",
            }}
          ></div>
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontColor(editor.current, "blue");
            }}
            style={{
              height: "15px",
              width: "15px",
              borderRadius: "50%",
              backgroundColor: "blue",
            }}
          ></div>
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontColor(editor.current, "cyan");
            }}
            style={{
              height: "15px",
              width: "15px",
              borderRadius: "50%",
              backgroundColor: "cyan",
            }}
          ></div>
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontColor(editor.current, "green");
            }}
            style={{
              height: "15px",
              width: "15px",
              borderRadius: "50%",
              backgroundColor: "green",
            }}
          ></div>
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontColor(editor.current, "orange");
            }}
            style={{
              height: "15px",
              width: "15px",
              borderRadius: "50%",
              backgroundColor: "orange",
              cursor: "default",
            }}
          ></div>
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontColor(editor.current, "gray");
            }}
            style={{
              height: "15px",
              width: "15px",
              borderRadius: "50%",
              backgroundColor: "gray",
            }}
          ></div>
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontColor(editor.current, "pink");
            }}
            style={{
              height: "15px",
              width: "15px",
              borderRadius: "50%",
              backgroundColor: "pink",
            }}
          ></div>
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontColor(editor.current, "purple");
            }}
            style={{
              height: "15px",
              width: "15px",
              borderRadius: "50%",
              backgroundColor: "purple",
              cursor: "default",
            }}
          ></div>
        </div>
      ) : null}

      {isSize ? (
        <div
          style={{
            backgroundColor: "lightgray",
            position: "absolute",
            top: "180px",
            left: "73%",
            width: "50px",
            height: "auto",
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "repeat(4, 23px)",
            paddingBottom: "10px",
            paddingTop: "10px",
            borderRadius: "10px",
          }}
        >
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontSize(editor.current, "8px");
            }}
            style={{ textAlign: "center", cursor: "default" }}
          >
            8
          </div>
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontSize(editor.current, "11px");
            }}
            style={{ textAlign: "center", cursor: "default" }}
          >
            11
          </div>
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontSize(editor.current, "15px");
            }}
            style={{ textAlign: "center", cursor: "default" }}
          >
            15
          </div>
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontSize(editor.current, "18px");
            }}
            style={{ textAlign: "center", cursor: "default" }}
          >
            18
          </div>
        </div>
      ) : null}

      <Modal
        isOpen={isModalOpen}
        contentLabel="Example Modal"
        onRequestClose={() => setModalOpen(false)}
        ariaHideApp={false}
        style={{
          content: {
            top: "40%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            height: "100px",
            width: "300px",
            backgroundColor: "#50CB93",
            color: "white",
          },
        }}
      >
        <div style={{ marginTop: "5px" }}>
          Link
          <input
            style={{ marginLeft: "10px" }}
            value={linkValue.link}
            onChange={(event) =>
              setLinkValue((prevState) => ({
                ...prevState,
                link: event.target.value,
              }))
            }
          ></input>
        </div>
        <div style={{ marginTop: "10px" }}>
          Text
          <input
            style={{ marginLeft: "10px" }}
            value={linkValue.text}
            onChange={(event) =>
              setLinkValue((prevState) => ({
                ...prevState,
                text: event.target.value,
              }))
            }
          ></input>
        </div>
        <div
          style={{
            width: "55px",
            height: "25px",
            backgroundColor: "#ACFFAD",
            marginTop: "10px",
            cursor: "default",
            color: "white",
            borderRadius: "5px",
            textAlign: "center",
            fontWeight: "bold",
            paddingTop: "5px",
          }}
          onMouseDown={(event) => {
            event.preventDefault();
            console.log("Insert Link", linkValue);
            console.log("ysc", currEditor);
            CustomEditor.Link(
              editor.current,
              linkValue.link,
              linkValue.text,
              currEditor
            );
            setModalOpen(false);
          }}
          role="button"
          tabIndex={0}
        >
          Insert
        </div>
      </Modal>

      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100px",
          backgroundColor: "#50CB93",
          paddingLeft: "20px",
          paddingTop: "10px",
          color: "white",
          display: "grid",
          gridTemplateColumns: "1fr 3fr 1fr",
          gridTemplateRows: "100px",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 1,
        }}
      >
        <a href="/" style={{ color: "white", textDecoration: "none" }}>
          <h1>PDocs</h1>
        </a>
        <h5 style={{ textDecoration: "underline", fontSize: "15px" }}>
          Current Session: {group.current}
        </h5>
        <h4>Number of Members: {num}</h4>
      </div>
      <div
        style={{
          display: "grid",
          marginLeft: "20%",
          width: "60%",
          gridTemplateColumns: "repeat(10, 1fr)",
          gridTemplateRows: "60px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            color: "white",
            backgroundColor: "#54436B",
            cursor: "pointer",
            width: "30px",
            height: "24px",
            borderRadius: "5px",
            textAlign: "center",
            paddingTop: "6px",
          }}
          role="button"
          tabIndex="0"
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleBoldMark(editor.current);
          }}
        >
          <FaBold size="20px" />
        </div>
        <div
          style={{
            color: "white",
            backgroundColor: "#54436B",
            cursor: "pointer",
            borderRadius: "5px",
            width: "30px",
            height: "24px",
            textAlign: "center",
            paddingTop: "6px",
          }}
          role="button"
          tabIndex="0"
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleItalicMark(editor.current);
          }}
        >
          <FaItalic size="20px" />
        </div>
        <div
          style={{
            color: "white",
            backgroundColor: "#54436B",
            cursor: "pointer",
            borderRadius: "5px",
            width: "30px",
            height: "26px",
            textAlign: "center",
            paddingTop: "4px",
          }}
          role="button"
          tabIndex="0"
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleCodeBlock(editor.current);
          }}
        >
          <BiCode size="25px" />
        </div>
        <div
          style={{
            color: "white",
            backgroundColor: "#54436B",
            cursor: "pointer",
            borderRadius: "5px",
            width: "30px",
            height: "24px",
            textAlign: "center",
            paddingTop: "6px",
          }}
          role="button"
          tabIndex="0"
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleUnderLine(editor.current);
          }}
        >
          <FaUnderline size="20px" />
        </div>
        <div
          style={{
            color: "white",
            backgroundColor: "#54436B",
            cursor: "pointer",
            borderRadius: "5px",
            width: "30px",
            height: "26px",
            textAlign: "center",
            paddingTop: "4px",
          }}
          role="button"
          tabIndex="0"
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleAlignment(editor.current, "left");
          }}
        >
          <BiAlignLeft size="25px" />
        </div>
        <div
          style={{
            color: "white",
            backgroundColor: "#54436B",
            cursor: "pointer",
            borderRadius: "5px",
            width: "30px",
            height: "26px",
            textAlign: "center",
            paddingTop: "4px",
          }}
          role="button"
          tabIndex="0"
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleAlignment(editor.current, "center");
          }}
        >
          <FiAlignCenter size="25px" />
        </div>
        <div
          style={{
            color: "white",
            backgroundColor: "#54436B",
            cursor: "pointer",
            borderRadius: "5px",
            width: "30px",
            height: "26px",
            textAlign: "center",
            paddingTop: "4px",
          }}
          role="button"
          tabIndex="0"
          onMouseDown={(event) => {
            event.preventDefault();
            CustomEditor.toggleAlignment(editor.current, "right");
          }}
        >
          <BiAlignRight size="25px" />
        </div>
        <div
          style={{
            color: "white",
            backgroundColor: "#54436B",
            cursor: "pointer",
            borderRadius: "5px",
            width: "30px",
            height: "24px",
            textAlign: "center",
            paddingTop: "6px",
          }}
          role="button"
          tabIndex="0"
          onMouseDown={(event) => {
            // console.log("Curr", editor.current);
            setcurrEditor(editor.current.selection);
            event.preventDefault();
            setModalOpen((preState) => !preState);
            // console.log(isModalOpen);
            //CustomEditor.toggleBoldMark(editor);
          }}
        >
          <BiLinkAlt size="25px" />
        </div>
        <div
          style={{
            color: "white",
            backgroundColor: "#54436B",
            cursor: "pointer",
            borderRadius: "5px",
            width: "30px",
            height: "28px",
            textAlign: "center",
            paddingTop: "3px",
          }}
          role="button"
          tabIndex="0"
          onMouseDown={(event) => {
            event.preventDefault();
            setColor((isColor) => !isColor);
          }}
        >
          <BiFontColor size="25px" />
        </div>
        <div
          style={{
            color: "white",
            backgroundColor: "#54436B",
            cursor: "pointer",
            borderRadius: "5px",
            width: "30px",
            height: "26px",
            textAlign: "center",
            paddingTop: "4px",
          }}
          role="button"
          tabIndex="0"
          onMouseDown={(event) => {
            event.preventDefault();
            setSize((isSize) => !isSize);
          }}
        >
          <BiFontSize size="25px" />
        </div>
      </div>
      <div
        style={{
          marginLeft: "10%",
          marginRight: "10%",
          marginTop: 0,
          marginBottom: "30px",
          width: "80%",
          // borderLeftColor: "black",
          // borderLeftWidth: "5px",
          minHeight: "600px",
          backgroundColor: "white",
          borderStyle: "solid",
          borderColor: "black",
          borderWidth: "3px",
          borderRadius: "5px",
          paddingLeft: "5px",
          paddingTop: "3px",
        }}
      >
        <Slate
          editor={editor.current}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            const ops = editor.current.operations
              .filter((o) => {
                if (o) {
                  return (
                    o.type !== "set_selection" &&
                    o.type !== "set_value" &&
                    (!o.data || Object.values(o.data).includes("source"))
                  );
                }
                return false;
              })
              .map((o) => ({ ...o, data: { source: "one" } }));
            if (ops.length && !remote.current)
              socket.emit("new-operations", {
                id: group.current,
                editorId: id.current,
                ops: JSON.stringify(ops),
                value,
              });
          }}
        >
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event) => {
              //console.log(event);
              if (event.key === "b" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.toggleBoldMark(editor.current);
              }
              if (event.key === "`" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.toggleCodeBlock(editor.current);
              }
              if (event.key === "i" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.toggleItalicMark(editor.current);
              }
              if (event.key === "l" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.toggleUnderLine(editor.current);
              }
              if (event.key === "o" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.toLink(editor.current);
              }
              if (event.key === "j" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.changeFontSize(editor.current);
              }
              if (event.key === "e" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.toggleBlock(editor.current, "numbered-list");
              }
              if (event.key === "p" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.toggleAlignment(editor.current, "right");
              }
              if (event.key === "h" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.changeFontColor(editor.current, "orange");
              }
              if (event.key === "f" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.changeFontColor(editor.current, "black");
              }
            }}
          />
        </Slate>
      </div>
    </div>
  );
};

export default SyncingEditor;
