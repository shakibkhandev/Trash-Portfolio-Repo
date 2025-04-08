"use client";

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useGlobalContext } from '@/context/GlobalContextProvider';
import { X, Tag as TagIcon } from 'lucide-react';
import TagModal from './TagModal';
import BlogEditor from './BlogEditor';
import { Editor } from '@tiptap/react';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const tagOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'programming', label: 'Programming' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },
];

export default function BlogModal({ isOpen, onClose }: BlogModalProps) {
  const { isDarkMode } = useGlobalContext();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<{ value: string; label: string; }[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditorChange = (editor: Editor) => {
    setContent(editor.getHTML());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your submit logic here
    console.log({
      title,
      content,
      tags,
      coverImage,
    });
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full max-w-4xl transform rounded-2xl p-6 text-left align-middle shadow-xl transition-all ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className={`text-lg font-medium leading-6 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Create New Blog Post
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className={`rounded-full p-2 transition-colors ${
                      isDarkMode
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="title" className={`block text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`mt-1 block w-full rounded-md px-3 py-2 text-sm ${
                        isDarkMode
                          ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-500'
                          : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
                      } border focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      placeholder="Enter blog title"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Cover Image
                    </label>
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-4 text-center ${
                        isDragging
                          ? 'border-blue-500'
                          : isDarkMode
                            ? 'border-gray-600'
                            : 'border-gray-300'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {coverImage ? (
                        <div className="relative">
                          <img
                            src={coverImage}
                            alt="Cover"
                            className="mx-auto max-h-48 rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setCoverImage(null)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                          <p>Drag and drop an image here, or click to select</p>
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setCoverImage(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex-grow">
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag.value}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isDarkMode
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {tag.label}
                            <button
                              type="button"
                              onClick={() => setTags(tags.filter(t => t.value !== tag.value))}
                              className={`ml-1 inline-flex items-center justify-center h-4 w-4 rounded-full ${
                                isDarkMode
                                  ? 'hover:bg-gray-600'
                                  : 'hover:bg-gray-200'
                              }`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsTagModalOpen(true)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <TagIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Content
                    </label>
                    <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
                      <BlogEditor onChange={handleEditorChange} />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className={`px-4 py-2 text-sm font-medium rounded-lg ${
                        isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Create Post
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>

      <TagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onSelect={(selectedTags) => {
          setTags(selectedTags);
          setIsTagModalOpen(false);
        }}
        selectedTags={tags}
        options={tagOptions}
        isDarkMode={isDarkMode}
      />
    </Transition>
  );
}
