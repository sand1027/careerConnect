import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for form submission logic (e.g., API call)
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-gradient-to-b from-[#00040A] to-[#001636] min-h-screen text-white flex flex-col">
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
              Get in <span className="text-blue-400">Touch</span>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Have questions or need support? We're here to help you connect
              with opportunities.
            </motion.p>
          </div>
        </section>

        {/* Contact Form & Details Section */}
        <section className="py-16 bg-[#001636]">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-semibold text-white mb-6 flex items-center">
                  <Send className="w-8 h-8 text-blue-400 mr-3" />
                  Send Us a Message
                </h2>
                {submitted && (
                  <p className="text-green-400 mb-4">
                    Thank you! We'll get back to you soon.
                  </p>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="name">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-md bg-[#00040A] text-white border border-gray-700 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-md bg-[#00040A] text-white border border-gray-700 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-300 mb-2"
                      htmlFor="message"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full p-3 rounded-md bg-[#00040A] text-white border border-gray-700 focus:border-blue-400 focus:outline-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-400 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-500 transition duration-300 flex items-center"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit
                  </button>
                </form>
              </motion.div>

              {/* Contact Details */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-semibold text-white mb-6">
                  Contact Information
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-300">
                    <Mail className="w-6 h-6 text-blue-400 mr-3" />
                    <a
                      href="mailto:support@hirehub.co"
                      className="hover:text-blue-400"
                    >
                      support@hirehub.co
                    </a>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Phone className="w-6 h-6 text-green-500 mr-3" />
                    <a href="tel:+1234567890" className="hover:text-blue-400">
                      +1 (234) 567-890
                    </a>
                  </li>
                  <li className="flex items-center text-gray-300">
                    <MapPin className="w-6 h-6 text-red-500 mr-3" />
                    <span>123 Career Avenue, Tech City, USA</span>
                  </li>
                </ul>
                {/* Map Placeholder */}
                <div className="mt-8 h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Interactive Map Placeholder</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactUs;
