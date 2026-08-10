import { useEffect } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write something...",
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          autolink: true,
          openOnClick: false,
          linkOnPaste: true,
          defaultProtocol: "https",
          HTMLAttributes: {
            class: "text-blue-600 underline",
            target: "_blank",
            rel: "noopener noreferrer",
          },
        },
      }),

      Placeholder.configure({
        placeholder,
      }),
    ],

    content: value,

    editorProps: {
      attributes: {
        class: "min-h-52 px-4 py-3 outline-none " + "prose prose-sm max-w-none",
      },
    },

    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
      <div className="flex flex-wrap gap-1 border-b bg-gray-50 p-2">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          H1
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </ToolbarButton>

        <ToolbarButton
          onClick={() => {
            if (editor.isActive("link")) {
              editor.commands.toggleLink();
              return;
            }

            const url = window.prompt(
              "Enter URL (example: https://example.com)",
            );

            if (!url) return;

            const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;

            const { to } = editor.state.selection;

            editor.commands.toggleLink({
              href,
              target: "_blank",
            });

            editor.commands.setTextSelection(to);

            editor.view.dispatch(editor.state.tr.setStoredMarks([]));
          }}
        >
          Link
        </ToolbarButton>

        <ToolbarButton
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↶
        </ToolbarButton>

        <ToolbarButton
          disabled={!editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↷
        </ToolbarButton>
      </div>

      <EditorContent
        editor={editor}
        onClick={(event) => {
          if (!event.ctrlKey) return;

          const link = event.target.closest("a");

          if (!link) return;

          window.open(link.href, "_blank", "noopener,noreferrer");
        }}
      />
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active = false,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded px-3 py-1 text-sm font-medium transition ${
        active ? "bg-gray-300 text-black" : "text-gray-700 hover:bg-gray-200"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      {children}
    </button>
  );
}
