import React, { useMemo, useState, useRef, useEffect } from "react";

import { createEditor } from "slate";

import { Slate, Editable, withReact, useSlateStatic } from "slate-react";

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

const socket = io("https://pdocsbackend.herokuapp.com/");

// interface Props {
//   groupId?: string;
// }

const SyncingEditor = ({ groupId }) => {
  console.log(groupId);

  const editor = useRef(withReact(createEditor()));
  // Add the initial value when setting up our state.
  const [value, setValue] = useState([initialValue]);
  const [num, setNum] = useState(0);
  const [isColor, setColor] = useState(false);
  const [isSize, setSize] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [linkValue, setLinkValue] = useState({ link: "", text: "Hello" });
  const [currEditor, setcurrEditor] = useState(editor.current);

  const id = useRef(`${socket.id}`);
  const remote = useRef(false);
  const group = useRef(groupId);

  useEffect(() => {
    if (group.current) {
      socket.emit("initialize", group.current);
    } else {
      fetch("https://pdocsbackend.herokuapp.com/create")
        .then((x) => x.json())
        .then((data) => {
          //<Redirect to={`/${data.groupId}`} />
          socket.emit("initialize", data.groupId);
          group.current = data.groupId;
        })
        .catch((err) => console.log("error", err));
    }

    socket.on("new-remote-operations", ({ editorId, ops }) => {
      if (id.current !== editorId) {
        remote.current = true;
        JSON.parse(ops).forEach((op) => {
          if (op.type !== "merge_node" && op.type !== "insert_node") {
            editor.apply(op);
          }
        });
        remote.current = false;
      }
    });

    socket.io.on("reconnect", () => {
      socket.emit("initialize", group.current);
    });

    return () => {
      socket.off("new-remote-operations");
    };
  }, []);

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
      console.log(val[0].children[0].text);
      remote.current = true;
      setValue(val);
      remote.current = false;
    });
    socket.on("get-data", (id) => {
      if (socket.id !== id) {
        console.log("Sending", value);
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
        backgroundColor: "#F54748",
      }}
    >
      {isColor ? (
        <div
          style={{
            position: "absolute",
            top: "150px",
            left: "70%",
            width: "100px",
            height: "200px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "repeat(3, 20px)",
          }}
        >
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontColor(editor, "red");
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
              CustomEditor.changeFontColor(editor, "black");
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
              CustomEditor.changeFontColor(editor, "blue");
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
              CustomEditor.changeFontColor(editor, "cyan");
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
              CustomEditor.changeFontColor(editor, "green");
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
              CustomEditor.changeFontColor(editor, "orange");
            }}
            style={{
              height: "15px",
              width: "15px",
              borderRadius: "50%",
              backgroundColor: "orange",
            }}
          ></div>
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontColor(editor, "gray");
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
              CustomEditor.changeFontColor(editor, "pink");
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
              CustomEditor.changeFontColor(editor, "purple");
            }}
            style={{
              height: "15px",
              width: "15px",
              borderRadius: "50%",
              backgroundColor: "purple",
            }}
          ></div>
        </div>
      ) : null}

      {isSize ? (
        <div
          style={{
            position: "absolute",
            top: "150px",
            left: "72%",
            width: "50px",
            height: "150px",
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "repeat(4, 23px)",
          }}
        >
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontSize(editor, "8px");
            }}
            style={{ textAlign: "center" }}
          >
            8
          </div>
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontSize(editor, "11px");
            }}
            style={{ textAlign: "center" }}
          >
            11
          </div>
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontSize(editor, "15px");
            }}
            style={{ textAlign: "center" }}
          >
            15
          </div>
          <div
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.changeFontSize(editor, "18px");
            }}
            style={{ textAlign: "center" }}
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
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            height: "200px",
            width: "200px",
          },
        }}
      >
        <div style={{ marginTop: "10px" }}>
          Link
          <input
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
            width: "50px",
            height: "20px",
            backgroundColor: "lightgray",
            marginTop: "10px",
            cursor: "default",
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
        <h1>PDocs</h1>
        <h5 style={{ textDecoration: "underline", fontSize: "15px" }}>
          Current Session: {group.current}
        </h5>
        <h5>Number of Members: {num}</h5>
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
            color: "#ACFFAD",
            backgroundColor: "white",
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
            CustomEditor.toggleBoldMark(editor);
          }}
        >
          <FaBold size="20px" />
        </div>
        <div
          style={{
            color: "#ACFFAD",
            backgroundColor: "white",
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
            CustomEditor.toggleItalicMark(editor);
          }}
        >
          <FaItalic size="20px" />
        </div>
        <div
          style={{
            color: "#ACFFAD",
            backgroundColor: "white",
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
            CustomEditor.toggleCodeBlock(editor);
          }}
        >
          <BiCode size="25px" />
        </div>
        <div
          style={{
            color: "#ACFFAD",
            backgroundColor: "white",
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
            CustomEditor.toggleUnderLine(editor);
          }}
        >
          <FaUnderline size="20px" />
        </div>
        <div
          style={{
            color: "#ACFFAD",
            backgroundColor: "white",
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
            CustomEditor.toggleAlignment(editor, "left");
          }}
        >
          <BiAlignLeft size="25px" />
        </div>
        <div
          style={{
            color: "#ACFFAD",
            backgroundColor: "white",
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
            CustomEditor.toggleAlignment(editor, "center");
          }}
        >
          <FiAlignCenter size="25px" />
        </div>
        <div
          style={{
            color: "#ACFFAD",
            backgroundColor: "white",
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
            CustomEditor.toggleAlignment(editor, "right");
          }}
        >
          <BiAlignRight size="25px" />
        </div>
        <div
          style={{
            color: "#ACFFAD",
            backgroundColor: "white",
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
            console.log("Curr", editor.current);
            setcurrEditor(editor.current.selection);
            event.preventDefault();
            setModalOpen((preState) => !preState);
            console.log(isModalOpen);
            //CustomEditor.toggleBoldMark(editor);
          }}
        >
          <BiLinkAlt size="25px" />
        </div>
        <div
          style={{
            color: "#ACFFAD",
            backgroundColor: "white",
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
            color: "#ACFFAD",
            backgroundColor: "white",
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
          borderLeftColor: "black",
          borderLeftWidth: "5px",
          minHeight: "500px",
          backgroundColor: "white",
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
                CustomEditor.toggleBoldMark(editor);
              }
              if (event.key === "`" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.toggleCodeBlock(editor);
              }
              if (event.key === "i" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.toggleItalicMark(editor);
              }
              if (event.key === "l" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.toggleUnderLine(editor);
              }
              if (event.key === "o" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.toLink(editor);
              }
              if (event.key === "j" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.changeFontSize(editor);
              }
              if (event.key === "e" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.toggleBlock(editor, "numbered-list");
              }
              if (event.key === "p" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.toggleAlignment(editor, "right");
              }
              if (event.key === "h" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.changeFontColor(editor, "orange");
              }
              if (event.key === "f" && event.ctrlKey) {
                event.preventDefault();
                CustomEditor.changeFontColor(editor, "black");
              }
            }}
          />
        </Slate>
      </div>
    </div>
  );
};

export default SyncingEditor;
