import React from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { motion } from "framer-motion";
import {
  FileText,
  Video,
  Book,
  Briefcase,
  Users,
  TrendingUp,
  Globe,
  Star,
  Zap,
} from "lucide-react";

const resourceCategories = [
  {
    title: "Job Search Essentials",
    icon: <Briefcase className="w-10 h-10 text-blue-400" />,
    resources: [
      {
        title: "How to Write a Resume in 2025",
        type: "Video",
        link: "https://www.youtube.com/watch?v=Tt08KmFfIYQ", // Placeholder, replace with 2025-specific video
      },
      {
        title: "Cover Letter Templates",
        type: "Template",
        link: "https://www.canva.com/create/cover-letters/",
      },
      {
        title: "Job Search Strategies Guide",
        type: "eBook",
        link: "https://www.themuse.com/advice/job-search-strategy",
      },
    ],
  },
  {
    title: "Interview Preparation",
    icon: <Users className="w-10 h-10 text-green-500" />,
    resources: [
      {
        title: "Top 10 Interview Questions & Answers (2025)",
        type: "Video",
        link: "https://www.youtube.com/watch?v=PCWVi5pAa30", // Placeholder, replace with 2025-specific video
      },
      {
        title: "Mock Interview Simulator",
        type: "Interactive",
        link: "https://www.interviewing.io/",
      },
      {
        title: "Body Language in Interviews",
        type: "Article",
        link: "https://www.forbes.com/sites/forbescoachescouncil/2021/03/02/15-body-language-tips-for-your-next-interview/",
      },
    ],
  },
  {
    title: "Career Development",
    icon: <TrendingUp className="w-10 h-10 text-purple-500" />,
    resources: [
      {
        title: "Personal Branding Masterclass",
        type: "Video",
        link: "https://www.youtube.com/watch?v=61wdjr6gWpw", // Placeholder, replace with 2025-specific video
      },
      {
        title: "Networking Strategies Podcast",
        type: "Podcast",
        link: "https://www.careercloud.com/podcast",
      },
      {
        title: "Career Planning Workbook",
        type: "PDF",
        link: "https://www.livecareer.com/resources/careers/planning/career-workbook",
      },
    ],
  },
  {
    title: "Industry Insights",
    icon: <Globe className="w-10 h-10 text-red-500" />,
    resources: [
      {
        title: "Tech Industry Trends 2025",
        type: "Report",
        link: "https://www.mckinsey.com/business-functions/mckinsey-digital/our-insights/tech-trends-2023",
      },
      {
        title: "Healthcare Career Paths",
        type: "Infographic",
        link: "https://www.healthcareers.nhs.uk/explore-roles",
      },
      {
        title: "Finance Industry Overview",
        type: "Podcast",
        link: "https://www.ft.com/ft-money-show",
      },
    ],
  },
];

const ResourceTypeIcon = ({ type }) => {
  switch (type) {
    case "Video":
      return <Video className="w-5 h-5 text-red-500" />;
    case "eBook":
    case "PDF":
      return <Book className="w-5 h-5 text-green-500" />;
    case "Article":
      return <FileText className="w-5 h-5 text-blue-400" />;
    default:
      return <Star className="w-5 h-5 text-purple-500" />;
  }
};

const featuredResources = [
  {
    title: "Job Search Strategies for 2025",
    type: "Video",
    link: "https://www.youtube.com/watch?v=uG2aEh5xBJE", // Placeholder, replace with 2025-specific video
  },
  {
    title: "Mastering Remote Work",
    type: "Article",
    link: "https://www.flexjobs.com/blog/post/how-to-master-remote-work/",
  },
  {
    title: "Salary Negotiation Tactics",
    type: "Video",
    link: "https://www.youtube.com/watch?v=your-negotiation-link", // Placeholder, replace with 2025-specific video
  },
];

const Resources = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#00040A] to-[#001636] text-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Career <span className="text-blue-400">Resources</span>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Unlock a wealth of tools and insights to elevate your professional
              journey.
            </motion.p>
          </div>
        </section>

        {/* Featured Resources Section */}
        <section className="py-16 bg-[#001636]">
          <div className="container mx-auto px-4">
            <motion.div
              className="bg-[#00040A] rounded-lg shadow-lg p-8 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Zap className="w-10 h-10 text-blue-400 mr-3" />
                Featured Resources
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredResources.map((resource, index) => (
                  <motion.li
                    key={resource.title}
                    className="bg-[#001636] rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center text-center"
                    >
                      <ResourceTypeIcon type={resource.type} />
                      <span className="mt-3 font-semibold text-lg text-white hover:text-blue-400 transition-colors duration-200">
                        {resource.title}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Resource Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {resourceCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  className="bg-[#00040A] rounded-lg shadow-lg p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center mb-6">
                    {category.icon}
                    <h2 className="text-2xl font-bold text-white ml-4">
                      {category.title}
                    </h2>
                  </div>
                  <ul className="space-y-4">
                    {category.resources.map((resource) => (
                      <li key={resource.title}>
                        <a
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-300 hover:text-blue-400 transition-colors duration-200"
                        >
                          <ResourceTypeIcon type={resource.type} />
                          <span className="ml-3 text-lg">{resource.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
