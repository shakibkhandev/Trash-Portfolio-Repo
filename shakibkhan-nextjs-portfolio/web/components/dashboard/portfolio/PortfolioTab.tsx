"use client";
import { Camera, Save, Github, Linkedin, Facebook, Twitter, X, Link2, Upload } from 'lucide-react';
import { useGlobalContext } from "@/context/GlobalContextProvider";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { Briefcase, Code, GraduationCap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css"; // Skeleton CSS
import { toast } from "sonner"; // Import Sonner
import PortInfoImage from "../../../assets/boy.png";
import { PenSquare, Plus, Trash2, Link, Calendar } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';


interface Portfolio {
  id: string;
  email: string;
  name: string;
  about: string;
  bio: string;
  image_url: string;
  x_url: string;
  github_url: string;
  linkedin_url: string;
  facebook_url: string;
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface WorkExperience {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  image_url: string;
  web_url: string;
  github_url?: string;
  technologies?: string;
}

interface Skill {
  id: string;
  label: string;
  url?: string;
  level?: number;
}

type PortfolioArrayKey = "education" | "workExperience" | "projects" | "skills";

export default function PortfolioTab() {
  const router = useRouter();
  const { isDarkMode } = useGlobalContext();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({
    isDeleteOpen: false,
    isAddOpen: false,
    isEditOpen: false,
    isProfileEditOpen: false,
    isCreatePortfolioOpen: false,
    isDeletePortfolioOpen: false,
    deleteItem: null as { id: string; type: string } | null,
    addType: "" as string,
    editItem: null as { id: string; type: string; data: any } | null,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/portfolio`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      if (response.data.data.length > 0) {
        setPortfolio(response.data.data[0]);
      } else {
        setPortfolio(null);
      }
    } catch (error) {
      toast.error("Failed to fetch portfolio data");
      console.error("Error fetching portfolio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!modalState.deleteItem) return;
    let endpoint;

    switch (modalState.deleteItem.type) {
      case "projects":
        endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/projects/${modalState.deleteItem.id}`;
        break;
      case "skills":
        endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/skills/${modalState.deleteItem.id}`;
        break;
      case "workExperience":
        endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/work-experiences/${modalState.deleteItem.id}`;
        break;
      case "education":
        endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/education/${modalState.deleteItem.id}`;
        break;
      default:
        throw new Error(`Invalid delete type: ${modalState.deleteItem.type}`);
    }
    try {
      await axios.delete(endpoint, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });
      if (portfolio) {
        const updatedPortfolio = { ...portfolio };
        const key = modalState.deleteItem.type as PortfolioArrayKey;
        if (Array.isArray(updatedPortfolio[key])) {
          const filteredArray = updatedPortfolio[key].filter(
            (item) => item.id !== modalState.deleteItem!.id
          );
          setPortfolio({
            ...updatedPortfolio,
            [key]: filteredArray as any,
          });
          toast.success(`${modalState.deleteItem.type} deleted successfully`);
        }
      }
    } catch (error) {
      toast.error(`Failed to delete ${modalState.deleteItem.type} item`);
      console.error("Error deleting item:", error);
    } finally {
      setModalState({ ...modalState, isDeleteOpen: false, deleteItem: null });
    }
  };

  const handleAdd = async (data: any) => {
    try {
      let endpoint;
      let formattedData = { ...data };

      // Format dates for Prisma
      if (data.startDate) {
        formattedData.startDate = new Date(data.startDate).toISOString();
      }
      if (data.endDate) {
        formattedData.endDate = new Date(data.endDate).toISOString();
      }

      switch (modalState.addType) {
        case "projects":
          endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/projects`;
          break;
        case "skills":
          endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/skills`;
          break;
        case "workExperience":
          endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/work-experiences`;
          break;
        case "education":
          endpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/education`;
          break;
        default:
          throw new Error(`Invalid add type: ${modalState.addType}`);
      }

      const response = await axios.post(endpoint, formattedData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("access_token")}`,
        },
      });

      if (portfolio) {
        setPortfolio({
          ...portfolio,
          [modalState.addType as keyof Portfolio]: [
            ...portfolio[modalState.addType as keyof Portfolio],
            response.data.data,
          ],
        });
        toast.success(`${modalState.addType} added successfully`);
      }
    } catch (error) {
      toast.error(`Failed to add ${modalState.addType} item`);
      console.error("Error adding item:", error);
    } finally {
      setModalState({ ...modalState, isAddOpen: false, addType: "" });
    }
  };

  const handleEdit = async (data: any) => {
    if (!modalState.editItem) return;
    let formattedData = { ...data };

    // Format dates for Prisma
    if (data.startDate) {
      formattedData.startDate = new Date(data.startDate).toISOString();
    }
    if (data.endDate) {
      formattedData.endDate = new Date(data.endDate).toISOString();
    }
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${modalState.editItem.type}/${modalState.editItem.id}`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      if (portfolio) {
        const updatedPortfolio = { ...portfolio };
        const key = modalState.editItem.type as PortfolioArrayKey;
        if (Array.isArray(updatedPortfolio[key])) {
          const mappedArray = updatedPortfolio[key].map((item) =>
            item.id === modalState.editItem!.id ? response.data.data : item
          );
          setPortfolio({
            ...updatedPortfolio,
            [key]: mappedArray as any,
          });
          toast.success(`${modalState.editItem.type} updated successfully`);
        }
      }
    } catch (error) {
      toast.error(`Failed to update ${modalState.editItem.type} item`);
      console.error("Error updating item:", error);
    } finally {
      setModalState({ ...modalState, isEditOpen: false, editItem: null });
    }
  };

  const handleProfileEdit = async (data: any) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/portfolio`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      if (portfolio) {
        const updatedData = response.data.data;
        setPortfolio({
          ...portfolio,
          email: updatedData.email || portfolio.email,
          x_url: updatedData.x_url || portfolio.x_url,
          github_url: updatedData.github_url || portfolio.github_url,
          linkedin_url: updatedData.linkedin_url || portfolio.linkedin_url,
          facebook_url: updatedData.facebook_url || portfolio.facebook_url,
          name: updatedData.name || portfolio.name,
          about: updatedData.about || portfolio.about,
          bio: updatedData.bio || portfolio.bio,
          image_url: updatedData.image_url || portfolio.image_url,
          createdAt: updatedData.createdAt || portfolio.createdAt,
          updatedAt: updatedData.updatedAt || portfolio.updatedAt
        });
      }
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile information");
      console.error("Error updating profile:", error);
    } finally {
      setModalState({ ...modalState, isProfileEditOpen: false });
    }
  };

  const handleCreatePortfolio = async (data: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/portfolio`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      setPortfolio(response.data.data);
      toast.success("Portfolio created successfully");
    } catch (error) {
      toast.error("Failed to create portfolio");
      console.error("Error creating portfolio:", error);
    } finally {
      setModalState({ ...modalState, isCreatePortfolioOpen: false });
    }
  };

  const handleDeletePortfolio = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/portfolio`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      setPortfolio(null);
      toast.success("Portfolio deleted successfully");
    } catch (error) {
      toast.error("Failed to delete portfolio");
      console.error("Error deleting portfolio:", error);
    } finally {
      setModalState({ ...modalState, isDeletePortfolioOpen: false });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className={`flex flex-col items-center ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <p className="mt-4 text-lg font-medium animate-pulse">
            Loading portfolio...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-8 text-center ${
          isDarkMode ? "bg-red-900/30 text-red-200" : "bg-red-100 text-red-600"
        }`}
      >
        <div className="text-2xl font-semibold mb-4">Error</div>
        <p className="mb-4">{error}</p>
        <button
          onClick={() => setError(null)}
          className={`px-6 py-2 rounded-lg font-medium ${
            isDarkMode
              ? "bg-red-600 hover:bg-red-700"
              : "bg-red-500 hover:bg-red-600"
          } text-white transition-colors`}
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  if (!portfolio) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-12 text-center ${
          isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
        }`}
      >
        <div className="text-2xl font-semibold mb-4">No Portfolio Found</div>
        <p className="mb-6">
          Your portfolio data is empty. Start by adding your information.
        </p>
        <button
          className={`px-6 py-3 rounded-lg font-medium ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all`}
          onClick={() =>
            setModalState({ ...modalState, isCreatePortfolioOpen: true })
          }
        >
          Create Portfolio
        </button>

        <CreatePortfolioModal
          isOpen={modalState.isCreatePortfolioOpen}
          onClose={() =>
            setModalState({ ...modalState, isCreatePortfolioOpen: false })
          }
          onSubmit={handleCreatePortfolio}
          isDarkMode={isDarkMode}
        />
      </motion.div>
    );
  }

  return (
    <div className="w-full space-y-6 lg:space-y-8 px-4 sm:px-6 lg:px-8">
      <SectionCard
        title="Profile Information"
        icon={
          <Image
            src={PortInfoImage}
            alt="Profile"
            width={44}
            height={44}
            className="opacity-80"
          />
        }
        isDarkMode={isDarkMode}
        content={
          <ProfileContent
            portfolio={portfolio}
            isDarkMode={isDarkMode}
            handleProfileEdit={handleProfileEdit}
            modalState={modalState}
            setModalState={setModalState}
          />
        }
      />

      <SectionCard
        title="Projects"
        icon={<Code className="w-5 h-5 opacity-80" />}
        isDarkMode={isDarkMode}
        content={
          <ItemList
            items={portfolio.projects ? portfolio.projects : []}
            type="projects"
            renderItem={(item) => (
              <ProjectItem project={item as Project} isDarkMode={isDarkMode} />
            )}
            onDelete={(id: string) =>
              setModalState({
                ...modalState,
                isDeleteOpen: true,
                deleteItem: { id, type: "projects" },
              })
            }
            onEdit={(id: string) => {
              const item = portfolio.projects.find((p) => p.id === id);
              setModalState({
                ...modalState,
                isEditOpen: true,
                editItem: { id, type: "projects", data: item },
              });
            }}
            isDarkMode={isDarkMode}
          />
        }
        onAdd={() =>
          setModalState({ ...modalState, isAddOpen: true, addType: "projects" })
        }
      />

      <SectionCard
        title="Education"
        icon={<GraduationCap className="w-5 h-5 opacity-80" />}
        isDarkMode={isDarkMode}
        content={
          <ItemList
            items={portfolio.education ? portfolio.education : []}
            type="education"
            renderItem={(edu) => (
              'institution' in edu ? <EducationItem education={edu} isDarkMode={isDarkMode} /> : null
            )}
            onDelete={(id: string) =>
              setModalState({
                ...modalState,
                isDeleteOpen: true,
                deleteItem: { id, type: "education" },
              })
            }
            onEdit={(id: string) => {
              const item = portfolio.education.find((e) => e.id === id);
              setModalState({
                ...modalState,
                isEditOpen: true,
                editItem: { id, type: "education", data: item },
              });
            }}
            isDarkMode={isDarkMode}
          />
        }
        onAdd={() =>
          setModalState({
            ...modalState,
            isAddOpen: true,
            addType: "education",
          })
        }
      />

      <SectionCard
        title="Work Experience"
        icon={<Briefcase className="w-5 h-5 opacity-80" />}
        isDarkMode={isDarkMode}
        content={
          <ItemList
            items={portfolio.workExperience ? portfolio.workExperience : []}
            type="workExperience"
            renderItem={(work) => (
              <WorkExperienceItem work={work as WorkExperience} isDarkMode={isDarkMode} />
            )}
            onDelete={(id: string) =>
              setModalState({
                ...modalState,
                isDeleteOpen: true,
                deleteItem: { id, type: "workExperience" },
              })
            }
            onEdit={(id: string) => {
              const item = portfolio.workExperience.find((w) => w.id === id);
              setModalState({
                ...modalState,
                isEditOpen: true,
                editItem: { id, type: "workExperience", data: item },
              });
            }}
            isDarkMode={isDarkMode}
          />
        }
        onAdd={() =>
          setModalState({
            ...modalState,
            isAddOpen: true,
            addType: "workExperience",
          })
        }
      />

      <SectionCard
        title="Skills"
        icon={<Code className="w-5 h-5 opacity-80" />}
        isDarkMode={isDarkMode}
        content={
          <ItemList
            items={portfolio.skills ? portfolio.skills : []}
            type="skills"
            renderItem={(skill) => (
              <SkillItem skill={skill as Skill} isDarkMode={isDarkMode} />
            )}
            onDelete={(id: string) =>
              setModalState({
                ...modalState,
                isDeleteOpen: true,
                deleteItem: { id, type: "skills" },
              })
            }
            onEdit={(id: string) => {
              const item = portfolio.skills.find((s) => s.id === id);
              setModalState({
                ...modalState,
                isEditOpen: true,
                editItem: { id, type: "skills", data: item },
              });
            }}
            isDarkMode={isDarkMode}
          />
        }
        onAdd={() =>
          setModalState({ ...modalState, isAddOpen: true, addType: "skills" })
        }
      />

      <AnimatePresence>
        {modalState.isDeleteOpen && (
          <DeleteModal
            isOpen={modalState.isDeleteOpen}
            onClose={() =>
              setModalState({ ...modalState, isDeleteOpen: false })
            }
            onConfirm={handleDelete}
            isDarkMode={isDarkMode}
          />
        )}

        {modalState.isAddOpen && (
          <AddModal
            type={modalState.addType}
            isOpen={modalState.isAddOpen}
            onClose={() => setModalState({ ...modalState, isAddOpen: false })}
            onSubmit={handleAdd}
            isDarkMode={isDarkMode}
            portfolio={portfolio}
            setPortfolio={setPortfolio}
          />
        )}

        {modalState.isEditOpen && modalState.editItem && (
          <EditModal
            type={modalState.editItem.type}
            isOpen={modalState.isEditOpen}
            onClose={() =>
              setModalState({
                ...modalState,
                isEditOpen: false,
                editItem: null,
              })
            }
            onSubmit={handleEdit}
            initialData={modalState.editItem.data}
            isDarkMode={isDarkMode}
          />
        )}

        {modalState.isProfileEditOpen && (
          <ProfileEditModal
            isOpen={modalState.isProfileEditOpen}
            onClose={() =>
              setModalState({ ...modalState, isProfileEditOpen: false })
            }
            onSubmit={handleProfileEdit}
            initialData={portfolio}
            isDarkMode={isDarkMode}
          />
        )}

        {modalState.isDeletePortfolioOpen && (
          <DeletePortfolioModal
            isOpen={modalState.isDeletePortfolioOpen}
            onClose={() => setModalState({ ...modalState, isDeletePortfolioOpen: false })}
            onConfirm={handleDeletePortfolio}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


const ProfileContent = ({ portfolio, isDarkMode, handleProfileEdit, modalState, setModalState } : any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
    name: portfolio.name,
    email: portfolio.email,
    bio: portfolio.bio,
    about: portfolio.about,
    x_url: portfolio.x_url,
    github_url: portfolio.github_url,
    linkedin_url: portfolio.linkedin_url,
    facebook_url: portfolio.facebook_url,
    image_url: portfolio.image_url
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    handleProfileEdit(formData);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleDiscard = () => {
    setFormData({
      name: portfolio.name,
      email: portfolio.email,
      bio: portfolio.bio,
      about: portfolio.about,
      x_url: portfolio.x_url,
      github_url: portfolio.github_url,
      linkedin_url: portfolio.linkedin_url,
      facebook_url: portfolio.facebook_url,
      image_url: portfolio.image_url
    });
    setHasChanges(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    handleDiscard();
  };

  const baseInputClass = `w-full p-3 rounded-xl transition-all duration-200 focus:ring-2 focus:outline-none ${
    isDarkMode
      ? "bg-gray-800/50 border-gray-700/50 text-white focus:ring-blue-500/50 backdrop-blur-sm"
      : "bg-white/50 border-gray-200/50 text-gray-900 focus:ring-blue-400/50 backdrop-blur-sm"
  } border`;

  const labelClass = `block text-sm font-medium mb-2 ${
    isDarkMode ? "text-gray-300" : "text-gray-700"
  }`;

  return (
    <div className="w-full space-y-8">
      {/* Profile Header - Modern Card Design */}
      <div className={`p-6 sm:p-8 rounded-2xl ${isDarkMode ? "bg-gray-800/30 backdrop-blur-md" : "bg-white/80 backdrop-blur-md"} shadow-lg border ${isDarkMode ? "border-gray-700/30" : "border-gray-200/30"}`}>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Profile Image Section */}
          <div className="relative group">
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden">
              <img
                src={formData.image_url || portfolio.image_url}
                alt={portfolio.name}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {isEditing && (
              <CldUploadWidget
                uploadPreset="images_preset"
                onSuccess={(result: any) => {
                  if (result.info) {
                    setFormData(prev => ({
                      ...prev,
                      image_url: result.info.secure_url
                    }));
                    setHasChanges(true);
                  }
                }}
              >
                {({ open }) => (
                  <div 
                    onClick={() => open()}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                  >
                    <Camera size={28} className="text-white/90" />
                  </div>
                )}
              </CldUploadWidget>
            )}
          </div>
          
          {/* Profile Info Section */}
          <div className="flex-1 space-y-6 w-full text-center lg:text-left">
            <div className="space-y-4">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`text-2xl sm:text-3xl font-bold ${baseInputClass} text-center lg:text-left`}
                />
              ) : (
                <h2 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {portfolio.name}
                </h2>
              )}
              
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${baseInputClass} text-center lg:text-left`}
                />
              ) : (
                <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {portfolio.email}
                </p>
              )}
            </div>

            {!isEditing && (
              <div className="flex gap-4 justify-center lg:justify-start">
                {portfolio.x_url && (
                  <a 
                    href={portfolio.x_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`p-2.5 rounded-xl ${isDarkMode ? "bg-gray-700/50 hover:bg-gray-600/50" : "bg-gray-100/50 hover:bg-gray-200/50"} transition-all duration-300 hover:scale-110 backdrop-blur-sm`}
                  >
                    <Twitter size={20} className={isDarkMode ? "text-white/90" : "text-gray-700/90"} />
                  </a>
                )}
                {portfolio.github_url && (
                  <a 
                    href={portfolio.github_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`p-2.5 rounded-xl ${isDarkMode ? "bg-gray-700/50 hover:bg-gray-600/50" : "bg-gray-100/50 hover:bg-gray-200/50"} transition-all duration-300 hover:scale-110 backdrop-blur-sm`}
                  >
                    <Github size={20} className={isDarkMode ? "text-white/90" : "text-gray-700/90"} />
                  </a>
                )}
                {portfolio.linkedin_url && (
                  <a 
                    href={portfolio.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`p-2.5 rounded-xl ${isDarkMode ? "bg-gray-700/50 hover:bg-gray-600/50" : "bg-gray-100/50 hover:bg-gray-200/50"} transition-all duration-300 hover:scale-110 backdrop-blur-sm`}
                  >
                    <Linkedin size={20} className={isDarkMode ? "text-white/90" : "text-gray-700/90"} />
                  </a>
                )}
                {portfolio.facebook_url && (
                  <a 
                    href={portfolio.facebook_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`p-2.5 rounded-xl ${isDarkMode ? "bg-gray-700/50 hover:bg-gray-600/50" : "bg-gray-100/50 hover:bg-gray-200/50"} transition-all duration-300 hover:scale-110 backdrop-blur-sm`}
                  >
                    <Facebook size={20} className={isDarkMode ? "text-white/90" : "text-gray-700/90"} />
                  </a>
                )}
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 w-full lg:w-auto justify-center lg:justify-end">
            {isEditing ? (
              hasChanges ? (
                <>
                  <button
                    onClick={handleDiscard}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                      isDarkMode
                        ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 backdrop-blur-sm"
                        : "bg-gray-200/50 hover:bg-gray-300/50 text-gray-700 backdrop-blur-sm"
                    }`}
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSave}
                    className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105 ${
                      isDarkMode
                        ? "bg-blue-600/80 hover:bg-blue-700/80 text-white backdrop-blur-sm"
                        : "bg-blue-500/80 hover:bg-blue-600/80 text-white backdrop-blur-sm"
                    }`}
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCancel}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 backdrop-blur-sm"
                      : "bg-gray-200/50 hover:bg-gray-300/50 text-gray-700 backdrop-blur-sm"
                  }`}
                >
                  Cancel
                </button>
              )
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? "bg-blue-600/80 hover:bg-blue-700/80 text-white backdrop-blur-sm"
                      : "bg-blue-500/80 hover:bg-blue-600/80 text-white backdrop-blur-sm"
                  }`}
                >
                  <PenSquare size={18} />
                  Edit Profile
                </button>
                <button
                  onClick={() => setModalState({ ...modalState, isDeletePortfolioOpen: true })}
                  className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? "bg-red-600/80 hover:bg-red-700/80 text-white backdrop-blur-sm"
                      : "bg-red-500/80 hover:bg-red-600/80 text-white backdrop-blur-sm"
                  }`}
                >
                  <Trash2 size={18} />
                  Delete Portfolio
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className={`p-6 sm:p-8 rounded-2xl ${isDarkMode ? "bg-gray-800/30 backdrop-blur-md" : "bg-white/80 backdrop-blur-md"} shadow-lg border ${isDarkMode ? "border-gray-700/30" : "border-gray-200/30"}`}>
        <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Bio
        </h3>
        {isEditing ? (
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className={`${baseInputClass} min-h-[120px] resize-none`}
            placeholder="Write a short bio about yourself..."
          />
        ) : (
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>
            {portfolio.bio}
          </p>
        )}
      </div>

      {/* About Section */}
      <div className={`p-6 sm:p-8 rounded-2xl ${isDarkMode ? "bg-gray-800/30 backdrop-blur-md" : "bg-white/80 backdrop-blur-md"} shadow-lg border ${isDarkMode ? "border-gray-700/30" : "border-gray-200/30"}`}>
        <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          About
        </h3>
        {isEditing ? (
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            className={`${baseInputClass} min-h-[200px] resize-none`}
            placeholder="Tell us more about yourself..."
          />
        ) : (
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>
            {portfolio.about}
          </p>
        )}
      </div>

      {/* Social Links Section */}
      {isEditing && (
        <div className={`p-6 sm:p-8 rounded-2xl ${isDarkMode ? "bg-gray-800/30 backdrop-blur-md" : "bg-white/80 backdrop-blur-md"} shadow-lg border ${isDarkMode ? "border-gray-700/30" : "border-gray-200/30"}`}>
          <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Social Links
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>
                X / Twitter
              </label>
              <div className="flex">
                <div className={`flex items-center justify-center px-3 rounded-l-xl ${isDarkMode ? "bg-gray-700/50 text-gray-300" : "bg-gray-100/50 text-gray-500"} backdrop-blur-sm`}>
                  <Twitter size={18} />
                </div>
                <input
                  type="url"
                  name="x_url"
                  value={formData.x_url}
                  onChange={handleChange}
                  className={`${baseInputClass} rounded-l-none`}
                  placeholder="https://twitter.com/yourusername"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className={labelClass}>
                GitHub
              </label>
              <div className="flex">
                <div className={`flex items-center justify-center px-3 rounded-l-xl ${isDarkMode ? "bg-gray-700/50 text-gray-300" : "bg-gray-100/50 text-gray-500"} backdrop-blur-sm`}>
                  <Github size={18} />
                </div>
                <input
                  type="url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  className={`${baseInputClass} rounded-l-none`}
                  placeholder="https://github.com/yourusername"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className={labelClass}>
                LinkedIn
              </label>
              <div className="flex">
                <div className={`flex items-center justify-center px-3 rounded-l-xl ${isDarkMode ? "bg-gray-700/50 text-gray-300" : "bg-gray-100/50 text-gray-500"} backdrop-blur-sm`}>
                  <Linkedin size={18} />
                </div>
                <input
                  type="url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  className={`${baseInputClass} rounded-l-none`}
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className={labelClass}>
                Facebook
              </label>
              <div className="flex">
                <div className={`flex items-center justify-center px-3 rounded-l-xl ${isDarkMode ? "bg-gray-700/50 text-gray-300" : "bg-gray-100/50 text-gray-500"} backdrop-blur-sm`}>
                  <Facebook size={18} />
                </div>
                <input
                  type="url"
                  name="facebook_url"
                  value={formData.facebook_url}
                  onChange={handleChange}
                  className={`${baseInputClass} rounded-l-none`}
                  placeholder="https://facebook.com/yourusername"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


interface Item {
  id: string;
  [key: string]: any;
}

interface ItemListProps {
  items: (Project | Education | WorkExperience | Skill)[];
  type: string;
  renderItem: (item: Project | Education | WorkExperience | Skill) => React.ReactNode;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  isDarkMode: boolean;
}

export const ItemList = ({
  items,
  type,
  renderItem,
  onDelete,
  onEdit,
  isDarkMode,
}: ItemListProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="w-full space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items && items.length > 0 ? (
        <div className={`grid ${
          type === "projects" 
            ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" 
            : type === "skills"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        } gap-4`}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className={`relative flex flex-col p-6 rounded-xl ${
                isDarkMode ? "bg-gray-900" : "bg-gray-100"
              } shadow-lg hover:shadow-xl transition-all duration-300 border ${
                isDarkMode ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <div className="flex-1 w-full">{renderItem(item)}</div>
              
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onEdit(item.id)}
                  className={`p-2.5 rounded-xl transition-all ${
                    isDarkMode 
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300" 
                      : "bg-white hover:bg-gray-50 text-gray-700"
                  } shadow-sm hover:shadow`}
                  title="Edit"
                >
                  <PenSquare className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDelete(item.id)}
                  className={`p-2.5 rounded-xl transition-all ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-red-900 text-red-400"
                      : "bg-white hover:bg-red-50 text-red-500"
                  } shadow-sm hover:shadow`}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={itemVariants}
          className={`text-center py-16 px-6 rounded-xl ${
            isDarkMode ? "bg-gray-900" : "bg-gray-100"
          } border ${
            isDarkMode ? "border-gray-800" : "border-gray-200"
          } border-dashed`}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              isDarkMode 
                ? "bg-gray-800" 
                : "bg-white"
            } shadow-lg`}
          >
            <Plus className={`w-10 h-10 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} />
          </motion.div>
          <h3 className={`text-xl font-medium mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            No {type} found
          </h3>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} max-w-sm mx-auto`}>
            Add your first {type.slice(0, -1)} to showcase your work and skills
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};



interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  isDarkMode: boolean;
  content: React.ReactNode;
  onEdit?: () => void;
  onAdd?: () => void;
}

export const SectionCard = ({
  title,
  icon,
  isDarkMode,
  content,
  onEdit,
  onAdd,
}: SectionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full rounded-xl p-6 md:p-8 ${
        isDarkMode
          ? "bg-gray-800"
          : "bg-white"
      } shadow-lg hover:shadow-xl transition-all duration-300 border ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              className={`p-3.5 rounded-xl ${
                isDarkMode 
                  ? "bg-gray-700" 
                  : "bg-gray-50"
              } shadow-md transition-all duration-300 group-hover:shadow-lg`}
            >
              <div className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                {icon}
              </div>
            </motion.div>
            <h2
              className={`text-xl md:text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {title}
            </h2>
          </div>
          <div className="flex gap-2 self-end sm:self-auto">
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2.5 rounded-xl transition-all ${
                  isDarkMode 
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                } shadow-sm hover:shadow`}
                onClick={onEdit}
                title="Edit"
              >
                <PenSquare className="w-4 h-4" />
              </motion.button>
            )}
            {onAdd && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2.5 rounded-xl transition-all ${
                  isDarkMode 
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300" 
                    : "bg-white hover:bg-gray-50 text-gray-700"
                } shadow-sm hover:shadow`}
                onClick={onAdd}
                title="Add New"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
        {content}
      </div>
    </motion.div>
  );
};

export const AddModal = ({ type, isOpen, onClose, onSubmit, isDarkMode, portfolio, setPortfolio }: any) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const fields: {
    [key: string]: {
      name: string;
      label: string;
      type: string;
      required?: boolean;
    }[];
  } = {
    projects: [
      { name: "name", label: "Project Name", type: "text", required: true },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
      },
      { name: "startDate", label: "Start Date", type: "date", required: true },
      { name: "endDate", label: "End Date", type: "date", required: true },
      { name: "image_url", label: "Project Image", type: "image" },
      { name: "web_url", label: "Web URL", type: "text" },
      { name: "skills", label: "Skills", type: "skills" },
    ],
    education: [
      {
        name: "institution",
        label: "Institution",
        type: "text",
        required: true,
      },
      { name: "degree", label: "Degree", type: "text", required: true },
      { name: "startDate", label: "Start Date", type: "date", required: true },
      { name: "endDate", label: "End Date", type: "date", required: true },
      { name: "status", label: "Status", type: "text", required: true },
    ],
    workExperience: [
      {
        name: "companyName",
        label: "Company Name",
        type: "text",
        required: true,
      },
      { name: "position", label: "Position", type: "text", required: true },
      { name: "startDate", label: "Start Date", type: "date", required: true },
      { name: "endDate", label: "End Date", type: "date", required: true },
    ],
    skills: [
      { name: "label", label: "Skill Name", type: "text", required: true },
      { name: "url", label: "URL", type: "text" },
    ],
  };

  const handleSkillSelect = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleAddSkill = async (skillData: any) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/skills`,
        skillData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      
      if (response.data) {
        setSelectedSkills(prev => [...prev, response.data.data.id]);
        setShowSkillModal(false);
        
        // Update portfolio.skills array with the new skill
        if (portfolio) {
          setPortfolio((prev: Portfolio) => ({
            ...prev,
            skills: [...prev.skills, response.data.data]
          }));
        }
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const submitData = {
          ...formData,
          skills: selectedSkills,
        };
        await onSubmit(submitData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    fields[type].forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
      // Validate URLs for any field that contains 'url' in its name
      if (field.name.toLowerCase().includes('url') && formData[field.name]) {
        try {
          new URL(formData[field.name]);
        } catch (error) {
          newErrors[field.name] = "Please enter a valid URL";
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImagePreview = async () => {
    if (!imageUrl) {
      setImageError("Please enter an image URL");
      return;
    }

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch (error) {
      setImageError("Please enter a valid URL");
      return;
    }

    // Check if URL ends with common image extensions
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasValidExtension = validImageExtensions.some(ext => 
      imageUrl.toLowerCase().endsWith(ext)
    );

    if (!hasValidExtension) {
      setImageError("Please enter a valid image URL (jpg, jpeg, png, gif, webp, or svg)");
      return;
    }

    try {
      const img = new window.Image();
      img.onload = () => {
        setFormData(prev => ({ ...prev, image_url: imageUrl }));
        setImageError("");
      };
      img.onerror = () => {
        setImageError("Invalid image URL or image cannot be loaded");
      };
      img.src = imageUrl;
    } catch (error) {
      setImageError("Invalid image URL or image cannot be loaded");
    }
  };

  // Update isFormValid to include URL validation
  const isFormValid = () => {
    return fields[type].every((field) => {
      if (!field.required) return true;
      
      if (field.type === "skills") {
        return selectedSkills.length > 0;
      }
      
      const value = formData[field.name];
      if (!value) return false;

      // Validate URLs for any field that contains 'url' in its name
      if (field.name.toLowerCase().includes('url')) {
        try {
          new URL(value);
        } catch (error) {
          return false;
        }
      }
      
      return true;
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`p-6 md:p-8 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        } shadow-xl backdrop-blur-sm border ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Add {type}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
            }`}
          >
            <X className={`w-6 h-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} />
          </motion.button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields[type].map((field) => (
            <div key={field.name}>
              <label
                className={`block mb-2 font-medium ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {field.label}
              </label>
              {field.type === "skills" ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {portfolio?.skills?.map((skill: any) => (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => handleSkillSelect(skill.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                          selectedSkills.includes(skill.id)
                            ? "bg-blue-500 text-white"
                            : isDarkMode
                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {skill.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSkillModal(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isDarkMode
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    + Add New Skill
                  </button>
                </div>
              ) : field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  className={`w-full p-3 border rounded-xl ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  } focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all`}
                  rows={4}
                  required={field.required}
                />
              ) : field.type === "image" ? (
                <div className="space-y-4">
                  {formData.image_url ? (
                    <div className="relative group">
                      <Image
                        src={formData.image_url}
                        alt="Project"
                        width={200}
                        height={200}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image_url: "" })}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* URL Input */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Link2 className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} h-5 w-5`} />
                        </div>
                        <input
                          type="url"
                          value={imageUrl}
                          placeholder="Enter image URL"
                          className={`block w-full pl-10 pr-24 py-2 rounded-lg border ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                              : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                          } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            imageError ? "border-red-500" : ""
                          }`}
                          onChange={(e) => {
                            setImageUrl(e.target.value);
                            setImageError("");
                          }}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center">
                          <button
                            type="button"
                            onClick={handleImagePreview}
                            disabled={!imageUrl}
                            className={`h-full px-3 text-white rounded-r-lg transition-colors flex items-center gap-2 cursor-pointer ${
                              imageUrl
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-gray-400 cursor-not-allowed"
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

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-300"></span>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className={`px-2 ${isDarkMode ? "bg-gray-900 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                            OR
                          </span>
                        </div>
                      </div>

                      {/* Cloudinary Upload Widget */}
                      <CldUploadWidget
                        uploadPreset="images_preset"
                        onSuccess={(result: any) => {
                          if (result.info) {
                            setFormData({
                              ...formData,
                              image_url: result.info.secure_url,
                            });
                            setImageError("");
                          }
                        }}
                      >
                        {({ open }) => (
                          <div
                            onClick={() => open()}
                            className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center hover:border-blue-500 transition-colors ${
                              isDarkMode
                                ? "border-gray-700 hover:border-blue-400"
                                : "border-gray-300"
                            }`}
                          >
                            <Upload
                              className={`mx-auto h-8 w-8 ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            />
                            <p className={`mt-2 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                              Click to upload
                            </p>
                            <p className={`mt-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                              SVG, PNG, JPG or GIF (max. 4MB)
                            </p>
                          </div>
                        )}
                      </CldUploadWidget>
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  className={`w-full p-3 border rounded-xl ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  } focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all`}
                  required={field.required}
                />
              )}
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className={`px-6 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid()}
              className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer ${
                isSubmitting || !isFormValid()
                  ? "opacity-75 cursor-not-allowed"
                  : "hover:shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                "Add"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {showSkillModal && (
        <AddModal
          type="skills"
          isOpen={showSkillModal}
          onClose={() => setShowSkillModal(false)}
          onSubmit={handleAddSkill}
          isDarkMode={isDarkMode}
        />
      )}
    </motion.div>
  );
};

export const CreatePortfolioModal = ({
  isOpen,
  onClose,
  onSubmit,
  isDarkMode,
}: any) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    about: "",
    bio: "",
    image_url: "",
    x_url: "",
    github_url: "",
    linkedin_url: "",
    facebook_url: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [uploadType, setUploadType] = useState<'url' | 'upload'>('upload');

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.about) newErrors.about = "About is required";
    if (!formData.image_url) newErrors.image_url = "Profile image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleImagePreview = async () => {
    if (!imageUrl) {
      setImageError("Please enter an image URL");
      return;
    }

    try {
      const img = new window.Image();
      img.onload = () => {
        setFormData(prev => ({ ...prev, image_url: imageUrl }));
        setImageError("");
      };
      img.onerror = () => {
        setImageError("Invalid image URL");
      };
      img.src = imageUrl;
    } catch (error) {
      setImageError("Invalid image URL");
    }
  };

  // Add this new function to handle image upload success
  const handleImageUploadSuccess = (result: any) => {
    if (result.info) {
      setFormData(prev => ({
        ...prev,
        image_url: result.info.secure_url
      }));
      setImageError("");
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`p-6 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        } shadow-xl border ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xl font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            Create Your Portfolio
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <X className={`w-5 h-5 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Form fields with updated styling */}
          <div>
            <label className={`block mb-2 text-sm font-medium text-left ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full p-2.5 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className={`block mb-2 text-sm font-medium text-left ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full p-2.5 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className={`block mb-2 text-sm font-medium text-left ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              About
            </label>
            <textarea
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className={`w-full p-2.5 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              rows={4}
              required
            />
            {errors.about && (
              <p className="mt-1 text-sm text-red-500">{errors.about}</p>
            )}
          </div>

          <div>
            <label className={`block mb-2 text-sm font-medium text-left ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className={`w-full p-2.5 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              rows={4}
              placeholder="Write a short bio about yourself..."
            />
          </div>

          <div>
            <label className={`block mb-2 text-sm font-medium text-left ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Profile Image
            </label>
            
            {formData.image_url ? (
              <div className="relative inline-block">
                <img
                  src={formData.image_url}
                  alt="Profile preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, image_url: "" }));
                    setImageUrl("");
                    setImageError("");
                  }}
                  className={`absolute -top-2 -right-2 p-1.5 rounded-full ${
                    isDarkMode 
                      ? "bg-gray-800 hover:bg-gray-700" 
                      : "bg-white hover:bg-gray-100"
                  } shadow-md transition-colors`}
                >
                  <X className={`w-4 h-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`} />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* URL Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link2 className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} h-5 w-5`} />
                  </div>
                  <input
                    type="url"
                    value={imageUrl}
                    placeholder="Enter image URL"
                    className={`block w-full pl-10 pr-24 py-2 rounded-lg border ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      imageError ? "border-red-500" : ""
                    }`}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImageError("");
                    }}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <button
                      type="button"
                      onClick={handleImagePreview}
                      disabled={!imageUrl}
                      className={`h-full px-3 text-white rounded-r-lg transition-colors flex items-center gap-2 cursor-pointer ${
                        imageUrl
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-gray-400 cursor-not-allowed"
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

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300"></span>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-2 ${isDarkMode ? "bg-gray-900 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                      OR
                    </span>
                  </div>
                </div>

                {/* Cloudinary Upload Widget */}
                <CldUploadWidget
                  uploadPreset="images_preset"
                  onSuccess={handleImageUploadSuccess}
                >
                  {({ open }) => (
                    <div
                      onClick={() => open()}
                      className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center hover:border-blue-500 transition-colors ${
                        isDarkMode
                          ? "border-gray-700 hover:border-blue-400"
                          : "border-gray-300"
                      }`}
                    >
                      <Upload
                        className={`mx-auto h-8 w-8 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <p className={`mt-2 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                        Click to upload
                      </p>
                      <p className={`mt-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        SVG, PNG, JPG or GIF (max. 4MB)
                      </p>
                    </div>
                  )}
                </CldUploadWidget>
              </div>
            )}
            {errors.image_url && (
              <p className="mt-1 text-sm text-red-500">{errors.image_url}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
          <div>
              <label className={`block mb-2 text-sm font-medium text-left ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
              X (Twitter) URL
            </label>
            <input
              type="url"
              value={formData.x_url}
                onChange={(e) => setFormData({ ...formData, x_url: e.target.value })}
                className={`w-full p-2.5 rounded-lg border ${
                isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
          </div>

          <div>
              <label className={`block mb-2 text-sm font-medium text-left ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
              GitHub URL
            </label>
            <input
              type="url"
              value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className={`w-full p-2.5 rounded-lg border ${
                isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
          </div>

          <div>
              <label className={`block mb-2 text-sm font-medium text-left ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
              LinkedIn URL
            </label>
            <input
              type="url"
              value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className={`w-full p-2.5 rounded-lg border ${
                isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
          </div>

          <div>
              <label className={`block mb-2 text-sm font-medium text-left ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
              Facebook URL
            </label>
            <input
              type="url"
              value={formData.facebook_url}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                className={`w-full p-2.5 rounded-lg border ${
                isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
            />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all flex items-center gap-2 ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                "Create Portfolio"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const DeleteModal = ({ isOpen, onClose, onConfirm, isDarkMode }: any) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className={`p-8 rounded-xl w-[400px] ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        } shadow-xl`}
      >
        <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Confirm Delete
        </h3>
        <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          Are you sure you want to delete this item? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const EditModal = ({
  type,
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isDarkMode,
}: any) => {
  const [formData, setFormData] = useState(initialData || {});
  const [hasChanges, setHasChanges] = useState(false);

  const fields: {
    [key: string]: { name: string; label: string; type: string }[];
  } = {
    projects: [
      { name: "name", label: "Project Name", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
      { name: "image_url", label: "Image URL", type: "text" },
      { name: "web_url", label: "Web URL", type: "text" },
    ],
    education: [
      { name: "institution", label: "Institution", type: "text" },
      { name: "degree", label: "Degree", type: "text" },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
      { name: "status", label: "Status", type: "text" },
    ],
    workExperience: [
      { name: "companyName", label: "Company Name", type: "text" },
      { name: "position", label: "Position", type: "text" },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
    ],
    skills: [
      { name: "label", label: "Skill Name", type: "text" },
      { name: "url", label: "URL", type: "text" },
    ],
  };

  useEffect(() => {
    setFormData((prevData: any) => ({
      ...prevData,
      ...initialData,
      startDate: initialData?.startDate
        ? new Date(initialData.startDate).toISOString().split("T")[0]
        : "",
      endDate: initialData?.endDate
        ? new Date(initialData.endDate).toISOString().split("T")[0]
        : "",
    }));
    setHasChanges(false);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      startDate: formData.startDate
        ? new Date(formData.startDate).toISOString()
        : null,
      endDate: formData.endDate
        ? new Date(formData.endDate).toISOString()
        : null,
    };
    onSubmit(formattedData);
    setHasChanges(false);
  };

  const handleDiscard = () => {
    setFormData(initialData);
    setHasChanges(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className={`p-6 rounded-lg w-[400px] max-h-[80vh] overflow-y-auto ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h3 className="text-xl font-bold mb-4">Edit {type}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields[type].map((field) => (
            <div key={field.name}>
              <label
                className={`block mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required={field.name !== "web_url" && field.name !== "url"}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required={field.name !== "web_url" && field.name !== "url"}
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2">
            {hasChanges ? (
              <>
                <button
                  type="button"
                  onClick={handleDiscard}
                  className={`px-4 py-2 rounded cursor-pointer ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded cursor-pointer"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded cursor-pointer ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const ProfileEditModal = ({ 
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isDarkMode,
}: any) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    x_url: initialData?.x_url || "",
    github_url: initialData?.github_url || "",
    linkedin_url: initialData?.linkedin_url || "",
    facebook_url: initialData?.facebook_url || "",
    image_url: initialData?.image_url || null,
  });
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      x_url: initialData?.x_url || "",
      github_url: initialData?.github_url || "",
      linkedin_url: initialData?.linkedin_url || "",
      facebook_url: initialData?.facebook_url || "",
      image_url: initialData?.image_url || null,
    });
    setHasChanges(false);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setHasChanges(false);
  };

  const handleDiscard = () => {
    setFormData({
      name: initialData?.name || "",
      x_url: initialData?.x_url || "",
      github_url: initialData?.github_url || "",
      linkedin_url: initialData?.linkedin_url || "",
      facebook_url: initialData?.facebook_url || "",
      image_url: initialData?.image_url || null,
    });
    setHasChanges(false);
  };

  const handleImagePreview = () => {
    try {
      const url = new URL(imageUrl);
      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      setImageUrl("");
      setImageError("");
      setHasChanges(true);
    } catch {
      setImageError("Please enter a valid image URL");
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className={`p-6 rounded-lg w-[400px] max-h-[80vh] overflow-y-auto ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h3 className="text-xl font-bold mb-4">Edit Profile Information</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`block mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              required
            />
          </div>

          {/* Profile Image Section */}
          <div>
            <label
              className={`block mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Profile Image
            </label>
            <div
              className={`rounded-lg overflow-hidden ${
                !formData.image_url && "border-2 border-dashed"
              } ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}
            >
              {formData.image_url ? (
                <div className="relative group">
                  <Image
                    src={formData.image_url}
                    alt="Profile"
                    width={200}
                    height={200}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, image_url: null }));
                        setHasChanges(true);
                      }}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  {/* URL Input */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link2
                        className={`${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } h-5 w-5`}
                      />
                    </div>
                    <input
                      type="url"
                      value={imageUrl}
                      placeholder="Enter image URL"
                      className={`block w-full pl-10 pr-24 py-2 rounded-lg border ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        imageError ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setImageError("");
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <button
                        type="button"
                        onClick={handleImagePreview}
                        disabled={!imageUrl}
                        className={`h-full px-3 text-white rounded-r-lg transition-colors flex items-center gap-2 cursor-pointer ${
                          imageUrl
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-400 cursor-not-allowed"
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

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300"></span>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span
                        className={`px-2 ${
                          isDarkMode
                            ? "bg-gray-800 text-gray-400"
                            : "bg-white text-gray-500"
                        }`}
                      >
                        OR
                      </span>
                    </div>
                  </div>

                  {/* Cloudinary Upload Widget */}
                  <CldUploadWidget
                    uploadPreset="images_preset"
                    onSuccess={(result: any) => {
                      if (result.info) {
                        setFormData(prev => ({
                          ...prev,
                          image_url: result.info.secure_url,
                        }));
                        setImageError("");
                        setHasChanges(true);
                      }
                    }}
                  >
                    {({ open }) => (
                      <div
                        onClick={() => open()}
                        className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center hover:border-blue-500 transition-colors ${
                          isDarkMode
                            ? "border-gray-700 hover:border-blue-400"
                            : "border-gray-300"
                        }`}
                      >
                        <Upload
                          className={`mx-auto h-8 w-8 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <p
                          className={`mt-2 text-sm font-medium ${
                            isDarkMode ? "text-gray-200" : "text-gray-900"
                          }`}
                        >
                          Click to upload
                        </p>
                        <p
                          className={`mt-1 text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          SVG, PNG, JPG or GIF (max. 4MB)
                        </p>
                      </div>
                    )}
                  </CldUploadWidget>
                </div>
              )}
            </div>
          </div>

          {/* Social Media Fields */}
          <div>
            <label
              className={`block mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              X URL
            </label>
            <input
              type="text"
              name="x_url"
              value={formData.x_url}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>
          <div>
            <label
              className={`block mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              GitHub URL
            </label>
            <input
              type="text"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>
          <div>
            <label
              className={`block mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              LinkedIn URL
            </label>
            <input
              type="text"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>
          <div>
            <label
              className={`block mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Facebook URL
            </label>
            <input
              type="text"
              name="facebook_url"
              value={formData.facebook_url}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>
          <div className="flex justify-end gap-2">
            {hasChanges ? (
              <>
                <button
                  type="button"
                  onClick={handleDiscard}
                  className={`px-4 py-2 rounded cursor-pointer ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded cursor-pointer"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded cursor-pointer ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const EducationItem = ({ education, isDarkMode }: { education: Education; isDarkMode: boolean }) => {
  // Format dates to be more compact (e.g., "Jan 2020 - May 2024")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short'
    });
  };

  return (
    <div className="mb-3">
      <div className="flex justify-between items-baseline mb-1">
        <h4 className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {education.institution}
        </h4>
        <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          {education.status}
        </span>
      </div>
      <p className={`text-xs mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
        {education.degree}
      </p>
      <div className="flex items-center text-xs">
        <Calendar className="w-3 h-3 mr-1" />
        <span className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          {formatDate(education.startDate)} - {formatDate(education.endDate)}
        </span>
      </div>
    </div>
  );
};


export const ProjectItem = ({ project, isDarkMode }: { project: Project; isDarkMode: boolean }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="relative w-full h-[200px] rounded-xl overflow-hidden cursor-pointer group"
  >
    {/* Background Image */}
    <Image
      src={project.image_url || "/default-project.png"}
      alt={project.name}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
    
    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
    
    {/* Content */}
    <div className="absolute inset-0 p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-white line-clamp-2">
          {project.name}
        </h3>
        <div className="flex gap-2">
          {project.web_url && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={project.web_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer"
            >
              <Link className="w-4 h-4 text-white" />
            </motion.a>
          )}
          {project.github_url && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer"
            >
              <Code className="w-4 h-4 text-white" />
            </motion.a>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <p className="text-sm text-gray-200 line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(project.startDate).toLocaleDateString()} -{" "}
            {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Present'}
          </span>
        </div>
        
        {project.technologies && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.split(',').slice(0, 3).map((tech: string, index: number) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs rounded-lg bg-white/10 backdrop-blur-sm text-white"
              >
                {tech.trim()}
              </span>
            ))}
            {project.technologies.split(',').length > 3 && (
              <span className="px-2 py-1 text-xs rounded-lg bg-white/10 backdrop-blur-sm text-white">
                +{project.technologies.split(',').length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

interface Skill {
  id: string;
  label: string;
  url?: string;
  level?: number;
}

interface SkillItemProps {
  skill: Skill;
  isDarkMode: boolean;
}

export const SkillItem = ({ skill, isDarkMode }: SkillItemProps) => {
  const renderStars = (level: number = 0) => {
    return Array(5).fill(0).map((_, i) => (
      <svg
        key={i}
        className={`w-3 h-3 ${
          i < level
            ? isDarkMode ? "text-gray-300" : "text-gray-700"
            : isDarkMode ? "text-gray-700" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch (error) {
      console.error("Invalid URL:", error);
      return url;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`flex flex-col gap-3 p-4 rounded-xl ${
        isDarkMode
          ? "hover:bg-gray-800 bg-gray-900"
          : "hover:bg-gray-50 bg-gray-100"
      } transition-all duration-200 border ${
        isDarkMode ? "border-gray-800" : "border-gray-200"
      }`}
    >
      {/* Main Content Row */}
      <div className="flex items-start justify-between gap-3 w-full">
        {/* Left side - Icon and Label */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`flex-shrink-0 p-2 rounded-lg ${
            isDarkMode
              ? "bg-gray-800"
              : "bg-white"
          } shadow-sm`}>
            <Code className={`w-4 h-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} />
          </div>
          <h4 className={`font-medium truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {skill.label}
          </h4>
        </div>

        {/* Right side - Stars */}
        {skill.level && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {renderStars(skill.level)}
          </div>
        )}
      </div>

      {/* URL Row - Only shown if URL exists */}
      {skill.url && (
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href={skill.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg w-fit ${
            isDarkMode
              ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
              : "bg-white text-gray-700 hover:bg-gray-50"
          } transition-colors`}
        >
          <Link className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate max-w-[200px]">
            {getHostname(skill.url)}
          </span>
        </motion.a>
      )}
    </motion.div>
  );
};
export const WorkExperienceItem = ({ work, isDarkMode }: { work: WorkExperience; isDarkMode: boolean }) => (
  <div className="space-y-2 flex-1">
    <h4
      className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
    >
      {work.companyName}
    </h4>
    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
      {work.position}
    </p>
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4" />
      <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
        {new Date(work.startDate).toLocaleDateString()} -{" "}
        {new Date(work.endDate).toLocaleDateString()}
      </p>
    </div>
  </div>
);

export const DeletePortfolioModal = ({ isOpen, onClose, onConfirm, isDarkMode }: any) => {
  const [confirmationText, setConfirmationText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmationText === "DELETE PORTFOLIO") {
      onConfirm();
    } else {
      setError("Please type 'DELETE PORTFOLIO' to confirm");
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`p-6 md:p-8 rounded-xl w-full max-w-md ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        } shadow-xl backdrop-blur-sm border ${
          isDarkMode ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Delete Portfolio
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
            }`}
          >
            <X className={`w-6 h-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} />
          </motion.button>
        </div>

        <div className="space-y-4">
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            This action cannot be undone. This will permanently delete your portfolio and all associated data.
          </p>
          
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Please type <span className="font-mono font-bold">DELETE PORTFOLIO</span> to confirm.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => {
                setConfirmationText(e.target.value);
                setError("");
              }}
              className={`w-full p-3 border rounded-xl ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white border-gray-200 text-gray-900"
              } focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                error ? "border-red-500" : ""
              }`}
              placeholder="Type DELETE PORTFOLIO"
            />
            
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className={`px-6 py-2 rounded-xl font-medium transition-colors cursor-pointer ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={confirmationText !== "DELETE PORTFOLIO"}
                className={`px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  confirmationText !== "DELETE PORTFOLIO"
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-lg"
                }`}
              >
                <Trash2 size={18} />
                Delete Portfolio
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};