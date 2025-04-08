"use client";

import { Link, RichTextEditor } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Editor, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ImageIcon } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useTheme } from "next-themes";
import { useState } from "react";

interface BlogEditorProps {
  onChange?: (editor: Editor) => void;
  content?: string;
}

export default function BlogEditor({
  onChange,
  content = "",
}: BlogEditorProps) {
  const { theme } = useTheme();
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");

  const validateImageUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-h-[500px] object-contain mx-auto",
        },
      }),
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor);
    },
  });

  const handleInsertImage = () => {
    if (!imageUrl) {
      setImageError("Please enter an image URL");
      return;
    }

    if (!validateImageUrl(imageUrl)) {
      setImageError("Please enter a valid URL");
      return;
    }

    if (editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setImageError("");
    }
  };

  return (
    <div className="relative h-auto">
      <RichTextEditor editor={editor} className="min-h-80">
        <RichTextEditor.Toolbar
          sticky
          stickyOffset={0}
          className={`${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <CldUploadWidget
              uploadPreset="images_preset"
              onSuccess={(result: any) => {
                if (result.info) {
                  editor
                    ?.chain()
                    .focus()
                    .setImage({ src: result.info.secure_url })
                    .run();
                  setImageError("");
                }
              }}
            >
              {({ open }) => (
                <button
                  onClick={() => open()}
                  className={`px-2 py-1 rounded hover:bg-gray-100 ${
                    theme === "dark"
                      ? "text-white hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title="Add image"
                  aria-label="Insert image"
                >
                  <ImageIcon size={16} />
                </button>
              )}
            </CldUploadWidget>
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content
          className={`grow-1 ${
            theme === "dark"
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-900"
          }`}
          style={{ marginTop: "0" }}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === "A") {
              e.preventDefault();
              const href = target.getAttribute("href");
              if (href) window.open(href, "_blank");
            }
          }}
        />
      </RichTextEditor>
      <style jsx global>{`
        .ProseMirror {
          color: ${theme === "dark" ? "#fff" : "#000"};
        }
        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
          cursor: pointer;
        }
        .ProseMirror a:hover {
          color: #2563eb;
        }
        .ProseMirror a:visited {
          color: #7c3aed;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        .ProseMirror ul > li {
          position: relative;
        }
        .ProseMirror ul > li::before {
          content: "•";
          position: absolute;
          left: -1.5rem;
          color: ${theme === "dark" ? "#fff" : "#000"};
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }
        .ProseMirror ol > li {
          position: relative;
        }
        .ProseMirror ol > li::marker {
          color: ${theme === "dark" ? "#fff" : "#000"};
        }
      `}</style>
    </div>
  );
}
