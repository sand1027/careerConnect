import { motion } from "framer-motion";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer",
      quote:
        "I found my dream job in just 10 days! The platform’s job matching is incredible.",
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Michael Chen",
      role: "Marketing Specialist",
      quote:
        "The resume builder helped me create a standout CV that got me noticed.",
      image: "https://via.placeholder.com/80",
    },
    {
      name: "Emma Davis",
      role: "HR Manager",
      quote:
        "Hiring top talent is seamless with this platform’s intuitive tools.",
      image: "https://via.placeholder.com/80",
    },
  ];

  return (
    <motion.section
      className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          What Our Users Say
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Real stories from job seekers and employers.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gray-100 p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              <p className="mt-4 font-semibold text-gray-900">
                {testimonial.name}
              </p>
              <p className="text-gray-500">{testimonial.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;
