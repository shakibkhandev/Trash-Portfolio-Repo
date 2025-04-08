"use client";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import { useGlobalContext } from "@/context/GlobalContextProvider";
import { 
  AnimatePresence, 
  motion, 
  useScroll, 
  useTransform, 
  useSpring 
} from "framer-motion";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import ExpenseTrackerImage from "../assets/expense-tracker.png";
import filmflareImage from "../assets/filmflare.png";
import axios from "axios";
import { Toaster, toast } from "sonner";

const projects = [
  {
    name: "Filmflare",
    image: filmflareImage,
    timeline: "Jan 2025 - Feb 2025",
    details:
      "Filmflare is a movie discovery web application built with Next.js and TypeScript. It allows users to explore trending movies, search for their favorites, and view detailed information about each film.",
    techStacks: ["Next.js", "TypeScript", "TMDB", "Swiper"],
    url: "https://github.com/shakibkhandev/Filmflare-Movie-Web-App",
  },
  {
    name: "Expense Tracker",
    image: ExpenseTrackerImage,
    timeline: "Jan 2025 - Feb 2025",
    details:
      "Expense Tracker is a web application designed to help users manage their finances. Built with Next.js and TypeScript, it allows users to track expenses The app uses Local database.",
    techStacks: ["Next.js", "TypeScript", "Radix"],
    url: "https://github.com/shakibkhandev/Expense-Tracker-Web-App",
  },
  {
    name: "Spaceship",
    image: "https://raw.githubusercontent.com/shakibkhandev/Spaceship-Static-Site/refs/heads/main/assets/01.png",
    timeline: "Jan 2025 - Feb 2025",  
    details:
      "Spaceship is a static website built with HTML, CSS, and JavaScript. It features a modern design and provides information about the app.",
    techStacks: ["HTML", "CSS", "JS"],
    url: "https://spaceshipweb.netlify.app/",
  },
  {
    name: "Retro Arcade",
    image: "https://raw.githubusercontent.com/shakibkhandev/Retro-Arcade-Static-Site/refs/heads/main/assets/01.png",
    timeline: "Jan 2025 - Feb 2025",
    details: "Retro Arcade is a static website built with HTML, CSS, and JavaScript. It features a modern design and provides information about the app.",
    techStacks: ["HTML", "CSS", "JS"],
    url: "https://retroarcadeweb.netlify.app/",
  },
  {
    name: "NexTech",
    image: "https://raw.githubusercontent.com/shakibkhandev/NexTech-Static-Site/refs/heads/main/assets/01.png",
    timeline: "Jan 2025 - Feb 2025",
    details: "NexTech is a static website built with HTML, CSS, and JavaScript. It features a modern design and provides information about the app.",
    techStacks: ["HTML", "CSS", "JS"],
    url: "https://nextechweb.netlify.app/",
  },
  {
    name: "Gamer Hub",
    image: "https://raw.githubusercontent.com/shakibkhandev/GamerHub-Static-Site/refs/heads/main/assets/01.png",
    timeline: "Jan 2025 - Feb 2025",
    details: "Gamer Hub is a static website built with HTML, CSS, and JavaScript. It features a modern design and provides information about the app.",
    techStacks: ["HTML", "CSS", "JS"],
    url: "https://gamerhubweb.netlify.app/",
  },
  {
    name: "Fishology",
    image: "https://raw.githubusercontent.com/shakibkhandev/Fishology-Static-Site/refs/heads/main/assets/01.png",
    timeline: "Jan 2025 - Feb 2025",
    details: "Fishology is a static website built with HTML, CSS, and JavaScript. It features a modern design and provides information about the app.",
    techStacks: ["HTML", "CSS", "JS"],
    url: "https://fishologyweb.netlify.app/",
  },
  {
    name: "Extreose",
    image: "https://raw.githubusercontent.com/shakibkhandev/Extreose-Static-Site/refs/heads/main/assets/01.jpg",
    timeline: "February 2025 - March 2025",
    details: "Extreose is a static website built with HTML, CSS, and JavaScript. It features a modern design and provides information about the app.",
    techStacks: ["HTML", "CSS", "JS"],
    url: "https://extreoseweb.netlify.app/",
  },
  {
    name: "Crafty",
    image: "https://raw.githubusercontent.com/shakibkhandev/Crafty-Static-Site/refs/heads/main/assets/01.png",
    timeline: "February 2025 - March 2025",
    details: "Crafty is a static website built with HTML, CSS, and JavaScript. It features a modern design and provides information about the app.",
    techStacks: ["HTML", "CSS", "JS"],
    url: "https://craftyweb3.netlify.app/",
  },
  {
    name: "Cosmic Chronicles",
    image: "https://raw.githubusercontent.com/shakibkhandev/Cosmic-Chronicles-Static-Site/refs/heads/main/assets/01.png",
    timeline: "February 2025 - March 2025",
    details: "Cosmic Chronicles is a static website built with HTML, CSS, and JavaScript. It features a modern design and provides information about the app.",
    techStacks: ["HTML", "CSS", "JS"],
    url: "https://cosmicchroniclesweb.netlify.app/",
  },
  {
    name: "Boheina",
    image: "https://raw.githubusercontent.com/shakibkhandev/Boheina-Static-Site/refs/heads/main/assets/01.png",
    timeline: "February 2025 - March 2025",
    details: "Boheina is a static website built with HTML, CSS, and JavaScript. It features a modern design and provides information about the app.",
    techStacks: ["HTML", "CSS", "JS"],
    url: "https://boheina.netlify.app/",
  },
  {
    name: "AutoSpa Elite",
    image: "https://raw.githubusercontent.com/shakibkhandev/AutoSpa-Elite-Static-Site/refs/heads/main/assets/01.png",
    timeline: "February 2025 - March 2025",
    details: "AutoSpa Elite is a static website built with HTML, CSS, and JavaScript. It features a modern design and provides information about the app.",
    techStacks: ["HTML", "CSS", "JS"],
    url: "https://autospaelite.netlify.app/",
  },
  {
    name: "Adventure Gear",
    image: "https://raw.githubusercontent.com/shakibkhandev/Adventure-Gear-Static-Site/refs/heads/main/assets/01.png",
    timeline: "February 2025 - March 2025",
    details: "Adventure Gear is a static website built with HTML, CSS, and JavaScript. It features a modern design and provides information about the app.",
    techStacks: ["HTML", "CSS", "JS"],
    url: "https://adventuregear.netlify.app/",
  },
  {
    name: "FioLabs",
    image: "https://raw.githubusercontent.com/shakibkhandev/FioLabs-Static-Site/refs/heads/main/assets/01.png",
    timeline: "February 2025 - March 2025",
    details: "FioLabs is a static website built with HTML, CSS, and JavaScript. It features a modern design and provides information about the app.",
    techStacks: ["HTML", "CSS", "JS"],
    url: "https://fiolabs.netlify.app/",
  },
  {
    name: "True Fitness",
    image: "https://raw.githubusercontent.com/shakibkhandev/TrueFitness-Static-Site/refs/heads/main/assets/01.png",
    timeline: "February 2025 - March 2025",
    details: "True Fitness is a static website built with HTML, CSS, and JavaScript. It features a modern design and provides information about the app.",
    techStacks: ["HTML", "CSS", "JS"],
    url: "https://true-fitness.netlify.app/",
  },
  {
    name: "Pet Grooming Store",
    image: "https://raw.githubusercontent.com/shakibkhandev/Pet-Grooming-Store-Static-Site/refs/heads/main/assets/01.png",
    timeline: "February 2025 - March 2025",
    details: "Pet Grooming Store is a static website built with HTML, CSS, and JavaScript. It features a modern design and provides information about the app.",
    techStacks: ["HTML", "CSS", "JS"],
    url: "https://petgroomingstore.netlify.app/",
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const cardHoverVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: { 
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: "easeIn"
    }
  }
};

const buttonVariants = {
  initial: { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  hover: { 
    scale: 1.05,
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: { 
    scale: 0.95,
    boxShadow: "0 5px 10px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.1,
      ease: "easeIn"
    }
  }
};

export default function Home() {
  const { isDarkMode } = useGlobalContext();
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(false);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/portfolio`
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/newsletter`, { email });
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
      console.error("Newsletter subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !portfolio || portfolio.length === 0) {
    return (
      <main className={`min-h-screen w-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className={`h-12 md:h-16 w-48 md:w-64 rounded-lg mb-4 animate-pulse ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`} />
              <div className={`h-6 w-32 rounded-lg animate-pulse ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`} />
            </div>
            <div className="shrink-0">
              <div className={`w-48 h-48 md:w-64 md:h-64 rounded-2xl animate-pulse ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`} />
            </div>
          </div>

          {/* About Section Skeleton */}
          <div className="mt-12">
            <div className={`h-8 w-24 rounded-lg mb-4 animate-pulse ${
              isDarkMode ? "bg-gray-800" : "bg-gray-200"
            }`} />
            <div className={`h-32 rounded-lg animate-pulse ${
              isDarkMode ? "bg-gray-800" : "bg-gray-200"
            }`} />
          </div>

          {/* Work Experience Section Skeleton */}
          <div className="mt-12">
            <div className={`h-8 w-48 rounded-lg mb-4 animate-pulse ${
              isDarkMode ? "bg-gray-800" : "bg-gray-200"
            }`} />
            <div className={`h-24 rounded-lg animate-pulse ${
              isDarkMode ? "bg-gray-800" : "bg-gray-200"
            }`} />
          </div>

          {/* Education Section Skeleton */}
          <div className="mt-12">
            <div className={`h-8 w-32 rounded-lg mb-4 animate-pulse ${
              isDarkMode ? "bg-gray-800" : "bg-gray-200"
            }`} />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-16 rounded-lg animate-pulse ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                }`} />
              ))}
            </div>
          </div>

          {/* Skills Section Skeleton */}
          <div className="mt-12">
            <div className={`h-8 w-24 rounded-lg mb-4 animate-pulse ${
              isDarkMode ? "bg-gray-800" : "bg-gray-200"
            }`} />
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`h-8 w-20 rounded-lg animate-pulse ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                }`} />
              ))}
            </div>
          </div>

          {/* Projects Section Skeleton */}
          <div className="mt-24">
            <div className="text-center mb-8">
              <div className={`h-8 w-32 rounded-lg mx-auto mb-4 animate-pulse ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`} />
              <div className={`h-6 w-48 rounded-lg mx-auto mb-2 animate-pulse ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`} />
              <div className={`h-4 w-64 rounded-lg mx-auto animate-pulse ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`} />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`h-64 rounded-lg animate-pulse ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                }`} />
              ))}
            </div>
          </div>

          {/* Contact Section Skeleton */}
          <div className="mt-24">
            <div className="text-center mb-8">
              <div className={`h-8 w-32 rounded-lg mx-auto mb-4 animate-pulse ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`} />
              <div className={`h-6 w-48 rounded-lg mx-auto mb-2 animate-pulse ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`} />
              <div className={`h-4 w-64 rounded-lg mx-auto animate-pulse ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`} />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className={`h-24 rounded-lg animate-pulse ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                }`} />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen w-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Toaster position="top-center" richColors />
      <motion.div
        className={`fixed top-0 left-0 right-0 h-0.5 ${isDarkMode ? "bg-white" : "bg-black"} origin-left z-50`}
        style={{ scaleX }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.section 
        className="max-w-4xl mx-auto px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex flex-col md:flex-row items-center gap-8"
          variants={containerVariants}
        >
          <motion.div className="flex-1 text-center md:text-left" variants={containerVariants}>
            <motion.h1
              variants={itemVariants}
              className={`text-4xl md:text-6xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Hi, I&apos;m {portfolio?.name?.split(" ")[0] || "Shakib"} <span className="animate-wave">👋</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {portfolio?.bio || "Full Stack Developer & UI/UX Enthusiast"}
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="mt-8 flex gap-4 justify-center md:justify-start"
            >
              <motion.a
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                href="#contact"
                className={`px-6 py-3 rounded-lg font-medium ${
                  isDarkMode 
                    ? "bg-white text-gray-900 hover:bg-gray-100" 
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                Get in Touch
              </motion.a>
              <motion.a
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                href="#projects"
                className={`px-6 py-3 rounded-lg font-medium border ${
                  isDarkMode 
                    ? "border-white text-white hover:bg-white/10" 
                    : "border-gray-900 text-gray-900 hover:bg-gray-900/10"
                }`}
              >
                View Projects
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="shrink-0">
            <motion.div
              variants={cardHoverVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className={`w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden ${
                isDarkMode ? "bg-white/10" : "bg-gray-200/50"
              }`}
            >
              <Image
                src={portfolio?.image_url || "/profile.png"}
                alt="Profile Image"
                width={256}
                height={256}
                className="w-full h-full object-cover transform transition-transform duration-300"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* About Section */}
        <motion.section
          variants={containerVariants}
          className="mt-12 transform transition-all duration-500"
        >
          <motion.h2
            variants={itemVariants}
            className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-800"
            }`}
          >
            About
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} 
                        p-4 rounded-lg 
                        ${isDarkMode ? "bg-gray-900/30" : "bg-gray-50/50"}`}
          >
            {portfolio?.about || "I&apos;m a passionate developer with a focus on web and mobile development. I enjoy learning new technologies, creating innovative solutions, and exploring the intersection of AI and business. Currently, I&apos;m working on personal projects to enhance my skills in JavaScript, Kotlin, and more. Always open to collaborating and learning from others. Let&apos;s build something awesome together!"}
          </motion.p>
        </motion.section>

        {/* Work Experience Section */}
        <motion.section
          variants={containerVariants}
          className="mt-12"
        >
          <motion.h2
            variants={itemVariants}
            className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-800"
            }`}
          >
            Work Experience
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-gray-900/30" : "bg-gray-50/50"
            }`}
          >
            <motion.p
              variants={itemVariants}
              className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              No Experience Yet
            </motion.p>
          </motion.div>
        </motion.section>

        {/* Education Section */}
        <motion.section
          variants={containerVariants}
          className="mt-12"
        >
          <motion.h2
            variants={itemVariants}
            className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-800"
            }`}
          >
            Education
          </motion.h2>
          {portfolio?.education && portfolio.education.length > 0 ? (
            <Timeline
              defaultValue={3}
              orientation={isMobile ? "vertical" : "horizontal"}
              className={`white`}
            >
              {portfolio.education.map((item: any, index: number) => (
                <TimelineItem
                  key={index}
                  step={index}
                  isDarkMode={isDarkMode}
                  className={`${isDarkMode ? "text-gray-100" : ""}`}
                >
                  <TimelineHeader>
                    <TimelineSeparator />
                    <TimelineDate className={`${isDarkMode ? "text-gray-200 opacity-70" : ""}`}>
                      {new Date(item.startDate).getFullYear()} - {new Date(item.endDate).getFullYear()}
                    </TimelineDate>
                    <TimelineTitle >{item.degree}</TimelineTitle>
                    <TimelineIndicator isDarkMode={isDarkMode} />
                  </TimelineHeader>
                  <TimelineContent className={`${isDarkMode ? "text-gray-200 opacity-70" : ""}`}>{item.status}</TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          ) : (
            <motion.p
              variants={itemVariants}
              className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"} p-4 rounded-lg ${
                isDarkMode ? "bg-gray-900/30" : "bg-gray-50/50"
              }`}
            >
              No Educational Qualifications Found
            </motion.p>
          )}
        </motion.section>

        {/* Skills Section */}
        <motion.section
          variants={containerVariants}
          className="mt-12"
        >
          <motion.h2
            variants={itemVariants}
            className={`text-2xl font-bold mb-4 flex items-center gap-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-800"
            }`}
          >
            Skills
          </motion.h2>
          {portfolio?.skills && portfolio.skills.length > 0 ? (
            <motion.div
              variants={containerVariants}
              className="flex flex-wrap gap-3 justify-center md:justify-start"
            >
              {portfolio.skills.map((skill: any, index: number) => (
                <motion.div
                  key={index}
                  variants={cardHoverVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer
                    transition-all duration-300
                    ${
                    isDarkMode 
                      ? "bg-white/10 text-white hover:bg-white/20" 
                      : "bg-gray-900/5 text-gray-900 hover:bg-gray-900/10"
                    }`}
                >
                  {skill.label}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.p
              variants={itemVariants}
              className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"} p-4 rounded-lg ${
                isDarkMode ? "bg-gray-900/30" : "bg-gray-50/50"
              }`}
            >
              No Skills Found
            </motion.p>
          )}
        </motion.section>

        {/* Projects Section */}
        <motion.section id="projects" className="mt-24 scroll-mt-16">
          <motion.div
            variants={containerVariants}
            className="text-center mb-8"
          >
            <motion.span
              variants={itemVariants}
              className={`px-4 py-2 rounded-full text-sm font-medium inline-block
                transition-all duration-300 hover:scale-105 cursor-pointer
                ${
                  isDarkMode 
                    ? "bg-gray-800/80 text-gray-200 border border-gray-700 hover:bg-gray-700/80" 
                    : "bg-gray-100/80 text-gray-800 border border-gray-200 hover:bg-gray-200/80"
                }`}
            >
              My Projects
            </motion.span>
            <motion.h2
              variants={itemVariants}
              className={`text-4xl font-bold mt-4 mb-3 transition-colors duration-300
                ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}
            >
              Check out my latest work
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className={`text-lg transition-colors duration-300
                ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              {portfolio?.projects && portfolio.projects.length > 0 
                ? "I've worked on a variety of projects, from simple websites to complex web applications." 
                : "No projects found yet"}
            </motion.p>
          </motion.div>

          {portfolio?.projects && portfolio.projects.length > 0 ? (
            <Swiper className="mySwiper" rewind={true} grabCursor={true} autoplay={{ delay: 2000 }} >
              {portfolio.projects.map((item: any, index: number) => (
                <SwiperSlide key={index}>
                  <motion.div
                    variants={cardHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    className={`rounded-lg overflow-hidden border ${
                      isDarkMode ? "border-gray-800" : "border-gray-200"
                    }`}
                  >
                    {/* Grid Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Image Section */}
                      <div className="relative h-[160px] sm:h-[240px] md:h-full">
                        <Image
                          src={item.image_url}
                          alt="Filmflare Image"
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Content Section */}
                      <div className="p-4">
                        <motion.h3
                          variants={itemVariants}
                          className={`text-xl font-bold mb-1 ${
                            isDarkMode && "text-gray-100"
                          }`}
                        >
                          {item.name}
                        </motion.h3>
                        <motion.p
                          variants={itemVariants}
                          className="text-xs text-gray-500 dark:text-gray-400 mb-2"
                        >
                          {new Date(item.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} - {new Date(item.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </motion.p>
                        <motion.p
                          variants={itemVariants}
                          className={`text-sm mb-3 line-clamp-2 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {item.description}
                        </motion.p>
                        <motion.div
                          variants={itemVariants}
                          className="flex flex-wrap gap-1 mb-3"
                        >
                          {item.skills.map((skill: any, index: number) => (
                            <motion.span
                              key={index}
                              variants={itemVariants}
                              className={`px-2 py-1 rounded-full text-xs ${
                                isDarkMode
                                  ? "bg-gray-800 text-gray-300 border border-gray-700"
                                  : "bg-gray-100 text-gray-800 border border-gray-200"
                              }`}
                            >
                              {skill.label}
                            </motion.span>
                          ))}
                        </motion.div>
                        <motion.a
                          variants={buttonVariants}
                          initial="initial"
                          whileHover="hover"
                          whileTap="tap"
                          target="_blank"
                          href={item.url}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium 
                            ${
                              isDarkMode
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
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <motion.div
              variants={itemVariants}
              className={`text-center p-8 rounded-lg ${
                isDarkMode ? "bg-gray-900/30" : "bg-gray-50/50"
              }`}
            >
              <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                No projects available at the moment. Check back later!
              </p>
            </motion.div>
          )}
        </motion.section>

        {/* Contact Section */}
        <motion.section id="contact" className="mt-24 scroll-mt-16 mb-24">
          <motion.div
            variants={containerVariants}
            className="text-center mb-8"
          >
            <motion.span
              variants={itemVariants}
              className={`px-4 py-2 rounded-full text-sm font-medium inline-block
                transition-all duration-300 hover:scale-105 cursor-pointer
                ${
                  isDarkMode
                    ? "bg-gray-800/80 text-gray-200 border border-gray-700 hover:bg-gray-700/80"
                    : "bg-gray-100/80 text-gray-800 border border-gray-200 hover:bg-gray-200/80"
                }`}
            >
              Get in Touch
            </motion.span>
            <motion.h2
              variants={itemVariants}
              className={`text-4xl font-bold mt-4 mb-3 transition-colors duration-300
                ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}
            >
              Let&apos;s work together
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className={`text-lg transition-colors duration-300
                ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Feel free to reach out for collaborations or just a friendly
              hello
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto"
          >
            <motion.a
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              href="mailto:mdshakibkhan.dev@gmail.com"
              className={`group p-6 rounded-2xl transition-all duration-300
                ${
                  isDarkMode
                    ? "bg-gray-800/50 hover:bg-gray-800"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
            >
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4"
              >
                <motion.div
                  variants={itemVariants}
                  className={`p-3 rounded-xl
                    ${
                      isDarkMode
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
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="flex-1"
                >
                  <motion.h3
                    variants={itemVariants}
                    className={`font-semibold ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    Email
                  </motion.h3>
                  <motion.p
                    variants={itemVariants}
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {portfolio?.email || "mdshakibkhan.dev@gmail.com"}
                  </motion.p>
                </motion.div>
              </motion.div>
            </motion.a>

            <motion.a
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              target="_blank"
              href={portfolio?.x_url || "https://x.com/shakib_khan_dev"}
              className={`group p-6 rounded-2xl transition-all duration-300
                ${
                  isDarkMode
                    ? "bg-gray-800/50 hover:bg-gray-800"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
            >
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4"
              >
                <motion.div
                  variants={itemVariants}
                  className={`p-3 rounded-xl
                    ${
                      isDarkMode
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
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="flex-1"
                >
                  <motion.h3
                    variants={itemVariants}
                    className={`font-semibold ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    X
                  </motion.h3>
                  <motion.p
                    variants={itemVariants}
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {`@${portfolio?.x_url.split("/").pop()}` || "@shakib_khan_dev"}
                  </motion.p>
                </motion.div>
              </motion.div>
            </motion.a>
          </motion.div>
        </motion.section>

        {/* Newsletter Section */}
        <motion.section 
          variants={containerVariants}
          className="mt-24 mb-16"
        >
          <motion.div 
            variants={containerVariants}
            className={`max-w-2xl mx-auto p-8 rounded-2xl ${
              isDarkMode ? "bg-white/5" : "bg-gray-900/5"
            }`}
          >
            <motion.div 
              variants={containerVariants}
              className="text-center"
            >
              <motion.h2 
                variants={itemVariants}
                className={`text-2xl md:text-3xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Stay Updated
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className={`text-sm md:text-base mb-8 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Subscribe to my newsletter for the latest updates on projects, articles, and tech insights.
              </motion.p>
            </motion.div>
            
            <motion.form 
              variants={containerVariants}
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col md:flex-row gap-4"
            >
              <motion.input
                variants={itemVariants}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`flex-1 px-4 py-3 rounded-lg text-sm md:text-base outline-none ${
                  isDarkMode 
                    ? "bg-white/10 text-white placeholder:text-gray-400 focus:bg-white/20" 
                    : "bg-white text-gray-900 placeholder:text-gray-500 focus:bg-gray-50"
                } transition-all duration-300`}
              />
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 cursor-pointer rounded-lg font-medium ${
                  isDarkMode 
                    ? "bg-white text-gray-900 hover:bg-gray-100" 
                    : "bg-gray-900 text-white hover:bg-gray-800"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </motion.button>
            </motion.form>
          </motion.div>
        </motion.section>
      </motion.section>
    </main>
  );
}
