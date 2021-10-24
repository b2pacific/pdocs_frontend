import { Editor, Transforms, Text, Path, Range } from "slate";
import { ReactEditor } from "slate-react";

const LIST_TYPES = ["numbered-list", "bulleted-list"];

const CustomEditor = {
  isBlockActive(editor, format) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === format,
    });
    return !!match;
  },

  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.bold === true,
      universal: true,
    });

    return !!match;
  },

  isItalicMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.italic === true,
      universal: true,
    });

    return !!match;
  },

  isUnderLineActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.underline === true,
      universal: true,
    });

    return !!match;
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === "code",
    });

    return !!match;
  },

  isQuoteBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === "quote",
    });

    return !!match;
  },

  Link(editor, link, text, editorSelection) {
    if (!link) return;

    //console.log(editor);

    const node = {
      type: "link",
      url: link,
      children: [{ text: text }],
    };

    const selection = editorSelection;
    editor.selection = selection;

    //console.log("selection", editorSelection);

    ReactEditor.focus(editor);

    // for (const point of Editor.positions(editor)) {
    //   console.log(point);
    // }

    // const values = Object.values(editor);

    // for (let i of values) {
    //   console.log(i);
    // }

    if (!!selection) {
      const [parentNode, parentPath] = Editor.parent(
        editor,
        selection.focus?.path
      );

      //console.log("ParentNode", parentNode);

      if (editor.isVoid(parentNode)) {
        Transforms.insertNodes(editor, node, {
          at: Path.next(parentPath),
          select: true,
        });
      } else if (Range.isCollapsed(selection)) {
        //console.log("Collapsed");
        Transforms.insertNodes(editor, node, { select: true });
      } else {
        Transforms.wrapNodes(editor, node, { split: true });
        Transforms.collapse(editor, { edge: "end" });
      }
    } else {
      Transforms.insertNodes(editor, node);
    }
  },

  changeFontColor(editor, color) {
    // console.log("Color", color);
    Transforms.setNodes(
      editor,
      { color: color },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleAlignment(editor, align) {
    // console.log("Alignment");
    Transforms.setNodes(
      editor,
      { alignment: align },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },

  toggleBlock(editor, format) {
    const isActive = CustomEditor.isBlockActive(editor, format);
    const isList = LIST_TYPES.includes(format);

    Transforms.unwrapNodes(editor, {
      match: (n) => LIST_TYPES.includes(n.type),
      split: true,
    });

    Transforms.setNodes(editor, {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    });

    if (!isActive && isList) {
      const block = { type: format, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  },

  toggleQuoteBlock(editor) {
    const isActive = CustomEditor.isQuoteBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : "quote" },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },

  changeFontSize(editor, size) {
    Transforms.setNodes(
      editor,
      { fontSize: size },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleItalicMark(editor) {
    const isActive = CustomEditor.isItalicMarkActive(editor);
    Transforms.setNodes(
      editor,
      { italic: isActive ? false : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleUnderLine(editor) {
    const isActive = CustomEditor.isUnderLineActive(editor);
    Transforms.setNodes(
      editor,
      { underline: isActive ? false : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    console.log(isActive);
    Transforms.setNodes(
      editor,
      { bold: isActive ? false : true },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : "code" },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },
};

export default CustomEditor;
