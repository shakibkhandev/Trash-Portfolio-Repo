'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Image as ImageIcon, Link2, X, Upload } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
  isDarkMode?: boolean;
}

export default function ImageModal({ isOpen, onClose, onSubmit, isDarkMode }: ImageModalProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [uploadType, setUploadType] = useState<'url' | 'upload'>('upload');

  const validateImage = (url: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => reject(false);
      img.src = url;
    });
  };

  const handlePreview = async () => {
    if (!imageUrl) {
      setError('Please enter an image URL');
      setPreview('');
      return;
    }

    try {
      await validateImage(imageUrl);
      setPreview(imageUrl);
      setError('');
    } catch {
      setError('Invalid image URL');
      setPreview('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadType === 'url') {
      if (!imageUrl) {
        setError('Please enter an image URL');
        return;
      }
      if (!preview) {
        handlePreview();
        return;
      }
    }
    onSubmit(imageUrl);
    onClose();
    setImageUrl('');
    setPreview('');
    setError('');
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
              <Dialog.Panel 
                className={`w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    Add Image
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className={`p-1 rounded-full hover:bg-opacity-80 ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Toggle between URL and Upload */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setUploadType('upload')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      uploadType === 'upload'
                        ? isDarkMode
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-blue-100 text-blue-700'
                        : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Upload Image
                  </button>
                  <button
                    onClick={() => setUploadType('url')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      uploadType === 'url'
                        ? isDarkMode
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-blue-100 text-blue-700'
                        : isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Image URL
                  </button>
                </div>

                {uploadType === 'url' ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="Enter image URL"
                          className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                            isDarkMode
                              ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                              : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
                          } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <button
                          type="button"
                          onClick={handlePreview}
                          className={`px-3 py-2 rounded-lg text-sm font-medium ${
                            isDarkMode
                              ? 'bg-gray-700 text-white hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Preview
                        </button>
                      </div>
                      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                    </div>

                    {preview && (
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className={`px-4 py-2 rounded-lg text-sm ${
                          isDarkMode
                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          isDarkMode
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        Add Image
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <CldUploadWidget
                      uploadPreset="blog_uploads"
                      onSuccess={(result: any) => {
                        if (result.info && result.info.secure_url) {
                          setImageUrl(result.info.secure_url);
                          onSubmit(result.info.secure_url);
                          onClose();
                        }
                      }}
                    >
                      {({ open }) => (
                        <div
                          onClick={() => open()}
                          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center hover:border-blue-500 transition-colors ${
                            isDarkMode 
                              ? 'border-gray-700 hover:border-blue-400' 
                              : 'border-gray-300'
                          }`}
                        >
                          <Upload className={`mx-auto h-12 w-12 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                          <p className={`mt-2 text-sm font-medium ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-900'
                          }`}>
                            Click to upload
                          </p>
                          <p className={`mt-1 text-xs ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            SVG, PNG, JPG or GIF (max. 4MB)
                          </p>
                        </div>
                      )}
                    </CldUploadWidget>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
