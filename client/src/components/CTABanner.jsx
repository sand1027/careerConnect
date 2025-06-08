import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CTABanner = () => {
  const navigate = useNavigate();

  return (
    <motion.section
      className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
        <div className="text-center lg:text-left lg:w-1/2">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Kickstart Your Career?
          </h2>
          <p className="mt-4 text-lg">
            Join thousands of job seekers and explore opportunities today.
          </p>
          <motion.button
            className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/signup")}
          >
            Get Started Now
          </motion.button>
        </div>
        <motion.div
          className="opacity-0, scale: 0.8"
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <svg
            width="300"
            height="200"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M12 2L2 7L12 12L22 9.5V17H2V7"
              stroke="#ffffff"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
            />
            <motion.circle
              cx="12"
              cy="12"
              r="3"
              fill="#2563EB"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </svg>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CTABanner;
