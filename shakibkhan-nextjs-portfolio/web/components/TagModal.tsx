"use client";

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useGlobalContext } from '@/context/GlobalContextProvider';
import { Tag, Plus, X } from 'lucide-react';

interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: { value: string; label: string; }[];
  selectedTags: { value: string; label: string; }[];
  onSelect: (tags: { value: string; label: string; }[]) => void;
  isDarkMode: boolean;
}

const defaultTags = [
  { value: 'technology', label: 'Technology' },
  { value: 'programming', label: 'Programming' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },
];

export default function TagModal({ isOpen, onClose, options, selectedTags, onSelect, isDarkMode }: TagModalProps) {
  const [isCreateTagModalOpen, setIsCreateTagModalOpen] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState('');
  const [availableTags, setAvailableTags] = useState(defaultTags);

  const handleCreateTag = () => {
    if (newTagLabel.trim()) {
      const newTag = {
        value: newTagLabel.toLowerCase().replace(/\s+/g, '-'),
        label: newTagLabel.trim()
      };
      setAvailableTags([...availableTags, newTag]);
      setNewTagLabel('');
      setIsCreateTagModalOpen(false);
    }
  };

  const toggleTag = (tag: { value: string; label: string }) => {
    const isSelected = selectedTags.some(t => t.value === tag.value);
    const newTags = isSelected
      ? selectedTags.filter(t => t.value !== tag.value)
      : [...selectedTags, tag];
    onSelect(newTags);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={onClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <Dialog.Title as="div" className="flex justify-between items-center">
                    <h3 className={`text-lg font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Select Tags
                    </h3>
                    <button
                      onClick={onClose}
                      className={`rounded-full p-1 hover:bg-opacity-20 ${
                        isDarkMode ? 'hover:bg-gray-300' : 'hover:bg-gray-100'
                      }`}
                    >
                      <X className={isDarkMode ? 'text-white' : 'text-gray-500'} size={20} />
                    </button>
                  </Dialog.Title>

                  <div className="mt-4 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <button
                          key={tag.value}
                          onClick={() => toggleTag(tag)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                            selectedTags.some(t => t.value === tag.value)
                              ? isDarkMode
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-500 text-white'
                              : isDarkMode
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Tag size={14} className="mr-1" />
                          {tag.label}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setIsCreateTagModalOpen(true)}
                      className={`mt-4 inline-flex items-center px-4 py-2 rounded-md ${
                        isDarkMode
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Plus size={16} className="mr-2" />
                      Create New Tag
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Create Tag Modal */}
      <Transition appear show={isCreateTagModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsCreateTagModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <Dialog.Title as="div" className="flex justify-between items-center">
                    <h3 className={`text-lg font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Create New Tag
                    </h3>
                    <button
                      onClick={() => setIsCreateTagModalOpen(false)}
                      className={`rounded-full p-1 hover:bg-opacity-20 ${
                        isDarkMode ? 'hover:bg-gray-300' : 'hover:bg-gray-100'
                      }`}
                    >
                      <X className={isDarkMode ? 'text-white' : 'text-gray-500'} size={20} />
                    </button>
                  </Dialog.Title>

                  <div className="mt-4">
                    <input
                      type="text"
                      value={newTagLabel}
                      onChange={(e) => setNewTagLabel(e.target.value)}
                      placeholder="Enter tag name"
                      className={`w-full px-4 py-2 rounded-md border ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      onClick={() => setIsCreateTagModalOpen(false)}
                      className={`px-4 py-2 rounded-md ${
                        isDarkMode
                          ? 'bg-gray-700 text-white hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateTag}
                      className={`px-4 py-2 rounded-md ${
                        isDarkMode
                          ? 'bg-blue-600 text-white hover:bg-blue-500'
                          : 'bg-blue-500 text-white hover:bg-blue-400'
                      }`}
                    >
                      Create Tag
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
