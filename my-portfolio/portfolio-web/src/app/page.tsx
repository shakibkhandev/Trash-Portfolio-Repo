"use client";
import {
  AvatarSkeleton,
  CardSkeleton,
  Skeleton,
  TextSkeleton,
} from "@/components/Skeleton";
import { useThemeState } from "@/context/zustand";
import { Colors } from "@/utils/Colors";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

export default function Home() {
  const { theme, toggleTheme } = useThemeState();
  const [isLoading, setIsLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add smooth scroll function
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/portfolio`
        );

        if (response.data.data.length > 0) {
          setPortfolio(response.data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/newsletter`,
        { email }
      );

      if (response.data.success) {
        toast.success("Thank you for subscribing to our newsletter!");
        setEmail("");
      } else {
        toast.error("Failed to subscribe. Please try again later.");
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main
        className={`min-h-screen w-screen ${Colors[theme].background.primary}`}
      >
        <main className={`max-w-4xl mx-auto px-4 py-16`}>
          {/* Section 1 Skeleton */}
          <section className={`flex flex-col md:flex-row items-center gap-8`}>
            <div className={`flex-1 text-center md:text-left`}>
              <Skeleton className="h-12 w-3/4 mb-4" />
              <TextSkeleton className="mb-2" />
              <TextSkeleton className="mb-2" />
              <TextSkeleton className="mb-2" />
              <div
                className={`mt-8 flex gap-4 justify-center md:justify-start`}
              >
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <div className={`shrink-0`}>
              <AvatarSkeleton className="h-48 w-48 md:h-64 md:w-64" />
            </div>
          </section>

          {/* Section 2 Skeleton */}
          <section className="mt-12">
            <Skeleton className="h-8 w-24 mb-4" />
            <TextSkeleton className="mb-2" />
            <TextSkeleton className="mb-2" />
            <TextSkeleton className="mb-2" />
          </section>

          {/* Section 3 Skeleton */}
          <section className="mt-16">
            <div className="text-center mb-10">
              <Skeleton className="h-10 w-48 mx-auto mb-4" />
              <TextSkeleton className="w-3/4 mx-auto" />
            </div>
            <div className="space-y-8">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl ${
                    theme === "dark" ? "bg-gray-800/30" : "bg-white"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <Skeleton className="h-6 w-48 mb-2" />
                      <TextSkeleton className="w-32" />
                    </div>
                    <TextSkeleton className="w-24" />
                  </div>
                  <TextSkeleton className="mt-4" />
                  <TextSkeleton className="mt-4" />
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[1, 2, 3].map((skillIndex) => (
                      <Skeleton key={skillIndex} className="h-6 w-16" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4 Skeleton */}
          <section className="mt-16">
            <div className="text-center mb-10">
              <Skeleton className="h-10 w-48 mx-auto mb-4" />
              <TextSkeleton className="w-3/4 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl ${
                    theme === "dark" ? "bg-gray-800/30" : "bg-white"
                  }`}
                >
                  <Skeleton className="h-6 w-48 mb-2" />
                  <TextSkeleton className="w-32 mb-4" />
                  <TextSkeleton className="mb-2" />
                  <TextSkeleton className="mb-2" />
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5 Skeleton */}
          <section className="mt-12">
            <Skeleton className="h-8 w-24 mb-4" />
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {[1, 2, 3, 4, 5].map((index) => (
                <Skeleton key={index} className="h-8 w-24" />
              ))}
            </div>
          </section>

          {/* Section 6 Skeleton */}
          <section className="mt-12">
            <div className="text-center mb-8">
              <Skeleton className="h-6 w-32 mx-auto mb-4" />
              <Skeleton className="h-10 w-64 mx-auto mb-3" />
              <TextSkeleton className="w-3/4 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          </section>

          {/* Contact Section Skeleton */}
          <section className="mt-24 mb-16">
            <div className="text-center mb-8">
              <Skeleton className="h-6 w-32 mx-auto mb-4" />
              <Skeleton className="h-10 w-64 mx-auto mb-3" />
              <TextSkeleton className="w-3/4 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {[1, 2].map((index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl ${
                    theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-24 mb-2" />
                      <TextSkeleton className="w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Newsletter Section Skeleton */}
          <section className="mt-24 mb-16">
            <div
              className={`max-w-2xl mx-auto p-8 rounded-2xl ${
                theme === "dark" ? "bg-white/5" : "bg-gray-900/5"
              }`}
            >
              <div className="text-center">
                <Skeleton className="h-8 w-48 mx-auto mb-4" />
                <TextSkeleton className="w-3/4 mx-auto mb-8" />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-32" />
              </div>
            </div>
          </section>
        </main>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen w-screen ${Colors[theme].background.primary}`}
    >
      <Toaster position="top-right" theme={theme} />
      <main className={`max-w-4xl mx-auto px-4 py-16`}>
        {/* Section 1 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex flex-col md:flex-row items-center gap-8`}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`flex-1 text-center md:text-left`}
          >
            <h1
              className={`text-4xl md:text-6xl font-bold mb-4 ${Colors[theme].text.primary}`}
            >
              Hi, I'm {portfolio?.name.split(" ")[0]} <span className="animate-wave">👋</span>
            </h1>
            <p className={`text-lg ${Colors[theme].text.secondary}`}>
              {portfolio?.bio}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`mt-8 flex gap-4 justify-center md:justify-start`}
            >
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                onClick={(e) => scrollToSection(e, "contact")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300
                ${
                  theme === "dark"
                    ? "bg-white text-[#0F172A] hover:bg-white/90"
                    : "bg-[#0F172A] text-white hover:bg-[#1a2744]"
                }`}
              >
                Get in Touch
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#projects"
                onClick={(e) => scrollToSection(e, "projects")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300
                ${
                  theme === "dark"
                    ? "bg-transparent text-white border border-white/90 hover:bg-white/5"
                    : "bg-transparent text-[#0F172A] border border-[#0F172A] hover:bg-[#0F172A]/5"
                }`}
              >
                View Projects
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`shrink-0`}
          >
            <div
              className={`w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden ${Colors[theme].background.secondary}`}
            >
              <img
                src={portfolio?.image_url}
                alt="Profile Image"
                className={`w-full h-full object-cover transform transition-transform duration-300`}
              />
            </div>
          </motion.div>
        </motion.section>

        {/* Section 2 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 transform transition-all duration-500"
        >
          <h2
            className={`text-2xl font-bold mb-4 flex items-center gap-2 ${Colors[theme].text.primary}`}
          >
            About
          </h2>
          <p className={`${Colors[theme].text.secondary} p-4 rounded-lg`}>
            I'm a passionate developer with a focus on web and mobile
            development. I enjoy learning new technologies, creating innovative
            solutions, and exploring the intersection of AI and business.
            Currently, I'm working on personal projects to enhance my skills in
            JavaScript, Kotlin, and more. Always open to collaborating and
            learning from others. Let's build something awesome together!
          </p>
        </motion.section>

        {/* Section 3 - Work Experience */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <div className="text-center mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`text-3xl md:text-4xl font-bold ${Colors[theme].text.primary}`}
            >
              Work Experience
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`text-lg ${Colors[theme].text.secondary} mt-2 max-w-2xl mx-auto`}
            >
              My professional journey
            </motion.p>
          </div>

          <div className="space-y-8">
            {portfolio?.workExperience?.map(
              (experience: any, index: number) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-xl ${
                    theme === "dark" ? "bg-gray-800/30" : "bg-white"
                  } hover:shadow-md transition-all duration-300`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3
                        className={`text-xl font-bold ${Colors[theme].text.primary}`}
                      >
                        {experience.position}
                      </h3>
                      <p
                        className={`text-lg ${Colors[theme].text.secondary} mt-1`}
                      >
                        {experience.companyName}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`text-sm ${Colors[theme].text.secondary}`}
                      >
                        {experience.startDate} - {experience.endDate}
                      </span>
                    </div>
                  </div>

                  {experience.description && (
                    <p className={`mt-4 ${Colors[theme].text.secondary}`}>
                      {experience.description}
                    </p>
                  )}

                  {experience.skills && experience.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {experience.skills.map((skill: any) => (
                        <span
                          key={skill.id}
                          className={`px-2 py-1 rounded-full text-xs 
                        ${
                          theme === "dark"
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-800"
                        }`}
                        >
                          {skill.label}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )
            )}

            {(!portfolio?.workExperience ||
              portfolio.workExperience.length === 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`p-6 rounded-xl ${
                  theme === "dark" ? "bg-gray-800/30" : "bg-white"
                } text-center`}
              >
                <p className={`text-lg ${Colors[theme].text.secondary}`}>
                  No Experience Yet
                </p>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Section 4 - Education */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16"
        >
          <div className="text-center mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`text-3xl md:text-4xl font-bold ${Colors[theme].text.primary}`}
            >
              Education
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`text-lg ${Colors[theme].text.secondary} mt-2 max-w-2xl mx-auto`}
            >
              My educational background
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {portfolio?.education?.map((edu: any, index: number) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-xl ${
                  theme === "dark" ? "bg-gray-800/30" : "bg-white"
                } hover:shadow-md transition-all duration-300`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3
                      className={`text-xl font-bold ${Colors[theme].text.primary}`}
                    >
                      {edu.degree}
                    </h3>
                    <p
                      className={`text-lg ${Colors[theme].text.secondary} mt-1`}
                    >
                      {edu.institution}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className={`text-sm ${Colors[theme].text.secondary}`}>
                      {edu.startDate} - {edu.endDate}
                    </span>
                    <span
                      className={`text-sm ${
                        edu.status === "Completed"
                          ? theme === "dark"
                            ? "text-green-400"
                            : "text-green-600"
                          : theme === "dark"
                          ? "text-blue-400"
                          : "text-blue-600"
                      }`}
                    >
                      • {edu.status}
                    </span>
                  </div>

                  {edu.description && (
                    <p className={`mt-4 ${Colors[theme].text.secondary}`}>
                      {edu.description}
                    </p>
                  )}

                  {edu.achievements && edu.achievements.length > 0 && (
                    <div className="mt-4">
                      <h4
                        className={`text-sm font-medium ${Colors[theme].text.primary} mb-2`}
                      >
                        Achievements
                      </h4>
                      <ul className="space-y-1">
                        {edu.achievements.map(
                          (achievement: string, i: number) => (
                            <li
                              key={i}
                              className={`text-sm ${Colors[theme].text.secondary}`}
                            >
                              • {achievement}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {(!portfolio?.education || portfolio.education.length === 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`p-6 rounded-xl ${
                  theme === "dark" ? "bg-gray-800/30" : "bg-white"
                } text-center md:col-span-2`}
              >
                <p className={`text-lg ${Colors[theme].text.secondary}`}>
                  No Educational Qualifications Found
                </p>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Section 5 - Skills */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12"
        >
          <h2
            className={`text-2xl font-bold mb-4 flex items-center gap-2 ${Colors[theme].text.primary}`}
          >
            Skills
          </h2>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {portfolio?.skills?.map((skill: any, index: number) => (
              <motion.a
                key={skill.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={skill.url}
                target="_blank"
                className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer 
                transition-all duration-300 
                ${
                  theme === "dark"
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-gray-900/5 text-gray-900 hover:bg-gray-900/10"
                }`}
              >
                {skill.label}
              </motion.a>
            ))}
            {(!portfolio?.skills || portfolio.skills.length === 0) && (
              <div
                className={`p-4 rounded-lg ${Colors[theme].background.secondary}`}
              >
                <p className={`text-lg ${Colors[theme].text.secondary}`}>
                  No skills added yet
                </p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Section 6 - Projects */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12"
          id="projects"
        >
          <div className="text-center mb-8">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium inline-block transition-all duration-300 hover:scale-105 cursor-pointer 
              ${
                theme === "dark"
                  ? "bg-gray-800/80 text-gray-200 border-gray-700 hover:bg-gray-700/80"
                  : "bg-gray-100/80 text-gray-800 border-gray-200 hover:bg-gray-200/80"
              }`}
            >
              My Projects
            </span>
            <h2
              className={`text-4xl font-bold mt-4 mb-3 ${Colors[theme].text.primary}`}
            >
              Check out my latest work
            </h2>
            <p className={`text-lg ${Colors[theme].text.secondary}`}>
              I've worked on a variety of projects, from simple websites to
              complex web applications.
            </p>
          </div>

          {portfolio?.projects && portfolio.projects.length > 0 ? (
            <Swiper
              className="mySwiper"
              rewind={true}
              grabCursor={true}
              autoplay={{ delay: 2000 }}
              modules={[Autoplay]}
            >
              {portfolio.projects.map((item: any) => (
                <SwiperSlide key={item.id}>
                  <div
                    className={`rounded-lg overflow-hidden border ${Colors[theme].border.primary} transition-transform duration-300 hover:scale-[1.02]`}
                  >
                    {/* Grid Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Image Section */}
                      <div className="relative h-[160px] sm:h-[240px] md:h-full">
                        <Image
                          src={item.image_url}
                          alt={`${item.name} Image`}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Content Section */}
                      <div className="p-4">
                        <h3
                          className={`text-xl font-bold mb-1 ${Colors[theme].text.primary}`}
                        >
                          {item.name}
                        </h3>
                        <p
                          className={`text-xs ${Colors[theme].text.secondary} mb-2`}
                        >
                          {new Date(item.startDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}{" "}
                          -{" "}
                          {new Date(item.endDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <p
                          className={`text-sm mb-3 line-clamp-2 ${Colors[theme].text.secondary}`}
                        >
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.skills.map((skill: any) => (
                            <span
                              key={skill.id}
                              className={`px-2 py-1 rounded-full text-xs 
                              ${
                                theme === "dark"
                                  ? "bg-gray-800 text-gray-300 border border-gray-700"
                                  : "bg-gray-100 text-gray-800 border border-gray-200"
                              }`}
                            >
                              {skill.label}
                            </span>
                          ))}
                        </div>
                        <a
                          target="_blank"
                          href={item.web_url}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium 
                          transition-all duration-300 hover:scale-105
                          ${
                            theme === "dark"
                              ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          <svg
                            className="transition-transform duration-300 group-hover:scale-110"
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                            />
                          </svg>
                          Website
                        </a>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div
              className={`text-center p-8 rounded-lg ${Colors[theme].background.secondary}`}
            >
              <p className={`text-lg ${Colors[theme].text.secondary}`}>
                No projects available at the moment. Check back later!
              </p>
            </div>
          )}
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          id="contact"
          className="mt-24 scroll-mt-16 mb-24"
        >
          <div className="text-center mb-8">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium inline-block
                transition-all duration-300 hover:scale-105 cursor-pointer
                ${
                  theme === "dark"
                    ? "bg-gray-800/80 text-gray-200 border border-gray-700 hover:bg-gray-700/80"
                    : "bg-gray-100/80 text-gray-800 border border-gray-200 hover:bg-gray-200/80"
                }`}
            >
              Get in Touch
            </span>
            <h2
              className={`text-4xl font-bold mt-4 mb-3 ${Colors[theme].text.primary}`}
            >
              Let&apos;s work together
            </h2>
            <p className={`text-lg ${Colors[theme].text.secondary}`}>
              Feel free to reach out for collaborations or just a friendly hello
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <a
              href={`mailto:${
                portfolio?.email || "mdshakibkhan.dev@gmail.com"
              }`}
              className={`group p-6 rounded-2xl transition-all duration-300
                ${
                  theme === "dark"
                    ? "bg-gray-800/50 hover:bg-gray-800"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl
                    ${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-700"
                    }`}
                >
                  <svg
                    className="transition-transform duration-300 group-hover:scale-110"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${Colors[theme].text.primary}`}>
                    Email
                  </h3>
                  <p className={`text-sm ${Colors[theme].text.secondary}`}>
                    {portfolio?.email || "mdshakibkhan.dev@gmail.com"}
                  </p>
                </div>
              </div>
            </a>

            <a
              target="_blank"
              href={portfolio?.x_url || "https://x.com/shakib_khan_dev"}
              className={`group p-6 rounded-2xl transition-all duration-300
                ${
                  theme === "dark"
                    ? "bg-gray-800/50 hover:bg-gray-800"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl
                    ${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-700"
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:scale-110"
                  >
                    <path d="M17 3h4l-7.5 8.5L21 21h-4l-5-6-5 6H3l7.5-9.5L3 3h4l5 6z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${Colors[theme].text.primary}`}>
                    X
                  </h3>
                  <p className={`text-sm ${Colors[theme].text.secondary}`}>
                    {`@${portfolio?.x_url?.split("/").pop()}` ||
                      "@shakib_khan_dev"}
                  </p>
                </div>
              </div>
            </a>
          </div>
        </motion.section>

        {/* Newsletter Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-24 mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`max-w-2xl mx-auto p-8 rounded-2xl ${
              theme === "dark" ? "bg-white/5" : "bg-gray-900/5"
            }`}
          >
            <div className="text-center">
              <h2
                className={`text-2xl md:text-3xl font-bold mb-4 ${Colors[theme].text.primary}`}
              >
                Stay Updated
              </h2>
              <p
                className={`text-sm md:text-base mb-8 ${Colors[theme].text.secondary}`}
              >
                Subscribe to my newsletter for the latest updates on projects,
                articles, and tech insights.
              </p>
            </div>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col md:flex-row gap-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`flex-1 px-4 py-3 rounded-lg text-sm md:text-base outline-none transition-all duration-300
                  ${
                    theme === "dark"
                      ? "bg-white/10 text-white placeholder:text-gray-400 focus:bg-white/20"
                      : "bg-white text-gray-900 placeholder:text-gray-500 focus:bg-gray-50"
                  }`}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 cursor-pointer rounded-lg font-medium transition-all duration-300
                  ${
                    theme === "dark"
                      ? "bg-white text-gray-900 hover:bg-gray-100"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </motion.div>
        </motion.section>
      </main>
    </main>
  );
}
