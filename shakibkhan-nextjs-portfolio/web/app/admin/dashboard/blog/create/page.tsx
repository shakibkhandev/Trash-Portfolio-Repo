'use client'

import { useState, useEffect } from 'react';
import { useGlobalContext } from '@/context/GlobalContextProvider';
import { X, Tag as TagIcon, Upload, Link2 } from 'lucide-react';
import TagModal from '@/components/TagModal';
import BlogEditor from '@/components/BlogEditor';
import { Editor } from '@tiptap/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import axios from 'axios';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';

const tagOptions = []; // Remove hardcoded tags

export default function CreateBlogPage() {
  const router = useRouter();
  const { isDarkMode } = useGlobalContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<{ id: string; label: string; }[]>([]);
  const [coverImage, setCoverImage] = useState<{ url: string; publicId: string } | null>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState('');

  // Fetch tags on component mount
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/tags`,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('access_token')}`
          }
        }
      );
      if (response.data.success) {
        setAllTags(response.data.data);
      } else {
        toast.error('Failed to fetch tags');
      }
    } catch (error) {
      toast.error('Failed to fetch tags');
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Please enter a tag name');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/tags`,
        { label: newTagName.trim() },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('access_token')}`
          }
        }
      );

      if (response.data.success) {
        const newTag = response.data.data;
        setAllTags([...allTags, newTag]);
        setSelectedTagIds([...selectedTagIds, newTag.id]);
        setNewTagName('');
        setIsTagModalOpen(false);
        toast.success(response.data.message || 'Tag created successfully');
      } else {
        toast.error('Failed to create tag');
      }
    } catch (error: any) {
      toast.error('Failed to create tag', {
        description: error?.response?.data?.message || 'An unexpected error occurred'
      });
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs/tags/${tagId}`,
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get('access_token')}`
          }
        }
      );
      
      setAllTags(allTags.filter(tag => tag.id !== tagId));
      setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
      toast.success('Tag deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete tag', {
        description: error?.response?.data?.message || 'An unexpected error occurred'
      });
    }
  };

  const handleEditorChange = (editor: Editor) => {
    setContent(editor.getHTML());
  };

  const handleImagePreview = async () => {
    if (!imageUrl) {
      setImageError('Please enter an image URL');
      return;
    }

    try {
      setCoverImage({ url: imageUrl, publicId: '' });
      setImageError('');
    } catch (error) {
      setImageError('Failed to set image');
    }
  };

  return (
    <div className={`min-h-screen w-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="h-full">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Create New Blog Post
              </h1>
              <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Fill in the details below to create your blog post
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className={`px-6 py-2.5 rounded-lg flex items-center gap-2 ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              } border border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md`}
            >
              <X size={18} />
              Cancel
            </button>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title Input */}
                <div className={`p-8 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow duration-200`}>
                  <label htmlFor="title" className="block text-sm font-medium mb-3">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-5 py-4 rounded-xl border text-xl font-medium ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter a descriptive title"
                  />
                </div>

                {/* Content Editor */}
                <div className={`p-8 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow duration-200`}>
                  <label className="block text-sm font-medium mb-4">Content</label>
                  <BlogEditor onChange={handleEditorChange} isDarkMode={isDarkMode} />
                </div>
              </div>

              {/* Right Column - Meta Information */}
              <div className="space-y-6">
                {/* Description Input */}
                <div className={`p-8 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow duration-200`}>
                  <label htmlFor="description" className="block text-sm font-medium mb-3">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full px-5 py-4 rounded-xl border ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-auto min-h-[120px] resize-y`}
                    placeholder="Write a brief description of your blog post"
                  />
                </div>

                {/* Cover Image Upload */}
                <div className={`p-8 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow duration-200`}>
                  <label className="block text-sm font-medium mb-3">
                    Cover Image
                  </label>
                  <div className={`rounded-xl overflow-hidden ${!coverImage && 'border-2 border-dashed'} ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    {coverImage ? (
                      <div className="relative group">
                        <Image
                          src={coverImage.url}
                          alt="Cover"
                          width={800}
                          height={400}
                          className="w-full aspect-video object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setCoverImage(null);
                              setImageUrl('');
                              setImageError('');
                            }}
                            className="p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 p-6">
                        {/* URL Input */}
                        <div className="space-y-4">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Link2 className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} h-5 w-5`} />
                            </div>
                            <input
                              type="url"
                              value={imageUrl}
                              placeholder="Enter image URL"
                              className={`block w-full pl-12 pr-24 py-3 rounded-xl border ${
                                isDarkMode
                                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                imageError ? 'border-red-500' : ''
                              }`}
                              onChange={(e) => {
                                setImageUrl(e.target.value);
                                setImageError('');
                              }}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                              <button
                                type="button"
                                onClick={handleImagePreview}
                                disabled={!imageUrl}
                                className={`h-full px-4 text-white rounded-r-xl transition-colors duration-200 flex items-center gap-2 ${
                                  imageUrl 
                                    ? 'bg-blue-500 hover:bg-blue-600' 
                                    : 'bg-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <Upload size={16} />
                                Preview
                              </button>
                            </div>
                          </div>
                          {imageError && (
                            <p className="text-sm text-red-500">{imageError}</p>
                          )}
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200"></span>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className={`px-3 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                              OR
                            </span>
                          </div>
                        </div>

                        {/* Cloudinary Upload Widget */}
                        <CldUploadWidget
                          uploadPreset="images_preset"
                          onSuccess={(result: any) => {
                            if (result.info) {
                              setCoverImage({
                                url: result.info.secure_url,
                                publicId: result.info.public_id,
                              });
                              setImageError('');
                            }
                          }}
                        >
                          {({ open }) => (
                            <div
                              onClick={() => open()}
                              className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center hover:border-blue-500 transition-all duration-200 ${
                                isDarkMode 
                                  ? 'border-gray-700 hover:border-blue-400' 
                                  : 'border-gray-200'
                              }`}
                            >
                              <Upload className={`mx-auto h-12 w-12 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`} />
                              <p className={`mt-3 text-sm font-medium ${
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
                  </div>
                </div>

                {/* Tags Section */}
                <div className={`p-8 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow duration-200`}>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium">Tags</label>
                    <button
                      type="button"
                      onClick={() => setIsTagModalOpen(true)}
                      className="text-blue-500 hover:text-blue-600 text-sm flex items-center gap-1.5 transition-colors duration-200"
                    >
                      <TagIcon size={14} />
                      Add Tag
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <div
                        key={tag.id}
                        onClick={() => {
                          const isSelected = selectedTagIds.includes(tag.id);
                          if (isSelected) {
                            setSelectedTagIds(selectedTagIds.filter(id => id !== tag.id));
                          } else {
                            setSelectedTagIds([...selectedTagIds, tag.id]);
                          }
                        }}
                        className={`
                          inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                          cursor-pointer transition-all duration-200 select-none
                          ${selectedTagIds.includes(tag.id)
                            ? isDarkMode
                              ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : isDarkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }
                        `}
                      >
                        {tag.label}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTag(tag.id);
                          }}
                          className={`
                            ml-1 rounded-full p-1 hover:bg-opacity-80 transition-colors duration-200
                            ${selectedTagIds.includes(tag.id)
                              ? isDarkMode
                                ? 'hover:bg-blue-500/30'
                                : 'hover:bg-blue-200'
                              : isDarkMode
                              ? 'hover:bg-gray-600'
                              : 'hover:bg-gray-200'
                            }
                          `}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {allTags.length === 0 && (
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No tags available. Create one to get started.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={async () => {
                  if (!title || !description || !content || selectedTagIds.length === 0 || !coverImage) {
                    toast.error('Please fill in all required fields', {
                      description: 'Make sure to include title, description, content, tags, and cover image'
                    });
                    return;
                  }

                  try {
                    setIsSubmitting(true);
                    const { data } = await axios.post(
                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs`,
                      {
                        title,
                        description,
                        content,
                        tags: selectedTagIds,
                        coverImage: coverImage.url,
                        publicId: coverImage.publicId
                      },
                      {
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${Cookies.get('access_token')}`
                        }
                      }
                    );

                    toast.success('Blog post created successfully!', {
                      description: 'Redirecting to dashboard...'
                    });
                    router.push('/admin/dashboard');
                  } catch (error: any) {
                    console.error('Error creating blog post:', error);
                    toast.error('Failed to create blog post', {
                      description: error?.response?.data?.message || 'An unexpected error occurred'
                    });
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
                className={`
                  px-8 py-3.5 rounded-xl font-medium flex items-center gap-2 text-base
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
                  ${isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'}
                  transition-all duration-200 shadow-sm hover:shadow-md
                `}
              >
                {isSubmitting ? 'Creating...' : 'Create Blog Post'}
              </button>
            </div>
          </div>

          {/* Tag Creation Modal */}
          {isTagModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl w-full max-w-md shadow-xl`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-medium">Create New Tag</h3>
                  <button
                    type="button"
                    onClick={() => setIsTagModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <X size={24} />
                  </button>
                </div>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className={`w-full px-5 py-3 rounded-xl border mb-6 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  placeholder="Enter tag name"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTagModalOpen(false)}
                    className={`px-6 py-2.5 rounded-xl ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    } transition-all duration-200`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateTag}
                    className="px-6 py-2.5 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
