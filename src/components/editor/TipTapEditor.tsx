// src/components/editor/TiptapEditor.tsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { EditorToolbar } from "./EditorToolbar";
import { useEffect } from "react";

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Start writing your K-Dom content...",
  editable = true,
  className = "",
}: TiptapEditorProps) {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const blockquoteBorderColor = useColorModeValue("gray.300", "gray.600");
  const codeBg = useColorModeValue("gray.100", "gray.700");
  const codeColor = useColorModeValue("red.600", "green.300");
  const preCodeBg = useColorModeValue("gray.100", "gray.700");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.700");
  const tableBg = useColorModeValue("white", "gray.800");
  const linkHoverBg = useColorModeValue("gray.100", "gray.800");
  const mentionBg = useColorModeValue("gray.100", "gray.800");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "editor-link",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "editor-image",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList.configure({
        HTMLAttributes: {
          class: "task-list",
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "task-item",
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <Box
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      bg={bgColor}
      overflow="hidden"
      className={className}
    >
      {editable && <EditorToolbar editor={editor} />}

      <Box
        className="tiptap-editor-wrapper"
        sx={{
          ".tiptap-editor-content": {
            outline: "none",
            padding: "1rem",
            minHeight: editable ? "300px" : "auto",
            fontSize: "16px",
            lineHeight: "1.6",
            color: textColor,

            "h1, h2, h3, h4, h5, h6": {
              marginTop: "1.5em",
              marginBottom: "0.5em",
              fontWeight: "bold",
              lineHeight: "1.2",
            },
            h1: { fontSize: "2em" },
            h2: { fontSize: "1.75em" },
            h3: { fontSize: "1.5em" },
            h4: { fontSize: "1.25em" },
            h5: { fontSize: "1.1em" },
            h6: { fontSize: "1em" },

            p: {
              marginBottom: "1em",
            },

            "ul, ol": {
              paddingLeft: "1.5em",
              marginBottom: "1em",
            },

            li: {
              marginBottom: "0.25em",
            },

            blockquote: {
              borderLeft: `4px solid ${blockquoteBorderColor}`,
              paddingLeft: "1em",
              margin: "1em 0",
              fontStyle: "italic",
            },

            code: {
              backgroundColor: codeBg,
              color: codeColor,
              padding: "0.2em 0.4em",
              borderRadius: "4px",
              fontSize: "0.9em",
              fontFamily: "monospace",
            },

            pre: {
              backgroundColor: preCodeBg,
              padding: "1em",
              borderRadius: "8px",
              overflow: "auto",
              margin: "1em 0",

              code: {
                backgroundColor: "transparent",
                padding: 0,
              },
            },

            ".editor-link": {
              color: "blue.500",
              textDecoration: "underline",
              cursor: "pointer",
              _hover: {
                backgroundColor: linkHoverBg,
              },
            },

            ".editor-image": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: "8px",
              margin: "1em 0",
            },

            table: {
              borderCollapse: "collapse",
              width: "100%",
              margin: "1em 0",
              border: "1px solid",
              borderColor: borderColor,
              backgroundColor: tableBg,
            },

            "th, td": {
              border: "1px solid",
              borderColor: borderColor,
              padding: "0.5em",
              textAlign: "left",
            },

            th: {
              backgroundColor: tableHeaderBg,
              fontWeight: "bold",
            },

            ".task-list": {
              listStyle: "none",
              padding: 0,
            },

            ".task-item": {
              display: "flex",
              alignItems: "flex-start",
              marginBottom: "0.5em",

              'input[type="checkbox"]': {
                marginRight: "0.5em",
                marginTop: "0.2em",
              },
            },

            ".mention": {
              backgroundColor: mentionBg,
              borderRadius: "4px",
              padding: "0 0.25em",
            },

            // Placeholder styles
            ".ProseMirror-focused .is-empty::before": {
              content: "attr(data-placeholder)",
              float: "left",
              color: "gray.400",
              pointerEvents: "none",
              height: 0,
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
}
