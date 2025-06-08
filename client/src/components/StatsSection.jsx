import { motion } from "framer-motion";

const StatsSection = () => {
  const stats = [
    { value: "12,000+", label: "Jobs Posted" },
    { value: "65,000+", label: "Active Users" },
    { value: "1,500+", label: "Companies Hiring" },
  ];

  return (
    <motion.section
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Our Impact</h2>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: index * 0.2 }}
            >
              <p className="text-5xl font-bold">{stat.value}</p>
              <p className="mt-2 text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default StatsSection;
