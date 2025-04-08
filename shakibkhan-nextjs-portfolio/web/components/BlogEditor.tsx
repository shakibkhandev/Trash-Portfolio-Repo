'use client';

import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor, Editor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Image from '@tiptap/extension-image';
import { useGlobalContext } from '@/context/GlobalContextProvider';
import { useState } from 'react';
import ImageModal from './ImageModal';
import { ImageIcon } from 'lucide-react';

interface BlogEditorProps {
  onChange?: (editor: Editor) => void;
  content?: string;
  isDarkMode?: boolean;
}

export default function BlogEditor({ onChange, content = '', isDarkMode }: BlogEditorProps) {
  const { isDarkMode: globalIsDarkMode } = useGlobalContext();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-h-[500px] object-contain mx-auto'
        }
      }),
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor);
    },
  });

  const handleImageSubmit = (url: string) => {
    editor?.chain().focus().setImage({ src: url }).run();
    setIsImageModalOpen(false);
  };

  return (
    <div className="relative h-auto">
      <RichTextEditor editor={editor} className='min-h-80'>
        <RichTextEditor.Toolbar 
          sticky 
          stickyOffset={0}
          className={`${isDarkMode !== undefined ? (isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200') : (globalIsDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}`}
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
            <button
              onClick={() => setIsImageModalOpen(true)}
              className={`px-2 py-1 rounded hover:bg-gray-100 ${
                isDarkMode !== undefined ? (isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100') : (globalIsDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
              }`}
              title="Add image"
            >
              <ImageIcon size={16} />
            </button>
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content className={`${isDarkMode !== undefined ? (isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900') : (globalIsDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900')}`} />
      </RichTextEditor>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSubmit={handleImageSubmit}
        isDarkMode={isDarkMode !== undefined ? isDarkMode : globalIsDarkMode}
      />
    </div>
  );
}
