import React from "react";
import { motion } from "framer-motion";

const BlogSection = () => {
  const blogs = [
    {
      title: "Top 5 Resume Tips for 2025",
      description:
        "Craft a standout resume with these essential tips tailored for the 2025 job market.",
      imageSrc: "https://via.placeholder.com/300x200?text=Resume+Tips",
      link: "/blog/resume-tips",
    },
    {
      title: "Mastering Remote Interviews",
      description:
        "Ace your virtual interviews with expert strategies for success.",
      imageSrc: "https://via.placeholder.com/300x200?text=Remote+Interviews",
      link: "/blog/interview-tech",
    },
    {
      title: "The Rise of Tech Jobs",
      description:
        "Discover opportunities in the booming tech industry and how to prepare.",
      imageSrc: "https://via.placeholder.com/300x200?text=Tech+Jobs",
      link: "/blog/tech-jobs",
    },
  ];

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Career Insights
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Stay ahead with the latest career advice and industry news.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Blog Image */}
              <motion.img
                src={blog.imageSrc}
                alt={`Thumbnail for ${blog.title}`}
                className="w-full h-48 object-cover rounded-t-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              {/* Animated SVG Icon */}
              <motion.div
                className="absolute top-2 right-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M12 2v4m0 12v4M2 12h4m12-4h4"
                    stroke="#2563EB"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                  />
                </svg>
              </motion.div>
              {/* Blog Content */}
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                {blog.title}
              </h3>
              <p className="mt-2 text-gray-600">{blog.description}</p>
              <a
                href={blog.link}
                className="mt-4 inline-block text-blue-600 hover:underline font-medium"
                rel="noopener noreferrer"
              >
                Read More
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default React.memo(BlogSection);
