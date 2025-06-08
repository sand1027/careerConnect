import React from "react";
import { motion } from "framer-motion";

const TrustedCompanies = () => {
  const companies = [
    {
      name: "TechCorp",
      logo: "https://via.placeholder.com/120x40?text=TechCorp",
    },
    {
      name: "Innovate",
      logo: "https://via.placeholder.com/120x40?text=Innovate",
    },
    {
      name: "GrowFast",
      logo: "https://via.placeholder.com/120x40?text=GrowFast",
    },
    { name: "NexGen", logo: "https://via.placeholder.com/120x40?text=NexGen" },
    {
      name: "FutureWorks",
      logo: "https://via.placeholder.com/120x40?text=FutureWorks",
    },
  ];

  return (
    <motion.section
      className="py-12 px-4 sm:px-6 lg:px-8 bg-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Trusted by Top Companies
        </h2>
        <motion.div
          className="mt-8 flex overflow-hidden"
          animate={{ x: ["0%-100%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          <div className="flex space-x-12">
            {[...companies, ...companies].map(
              (
                company,
                index // Duplicate for continuous scroll
              ) => (
                <img
                  key={index}
                  src={company.logo}
                  alt={company.name}
                  className="h-10 w-auto opacity-50 hover:opacity-100 transition-opacity"
                />
              )
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TrustedCompanies;
