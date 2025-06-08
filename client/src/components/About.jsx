import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Target, Briefcase, Heart } from "lucide-react";
import Footer from "./shared/Footer";
import Navbar from "./shared/Navbar";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-[#00040A] to-[#001636] min-h-screen text-white">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              About Career<span className="text-blue-400">Connect</span>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Connecting talent with opportunity. We empower job seekers and
              recruiters to build meaningful careers and thriving teams.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link to="/jobs">
                <button className="bg-blue-400 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-500 transition duration-300 mr-4">
                  Explore Jobs
                </button>
              </Link>
              <Link to="/signup">
                <button className="border border-blue-400 text-blue-400 font-semibold py-3 px-6 rounded-md hover:bg-blue-400 hover:text-white transition duration-300">
                  Join Now
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16 bg-[#001636]">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <Target className="w-8 h-8 text-blue-400 mr-3" />
                  <h2 className="text-3xl font-semibold text-white">
                    Our Mission
                  </h2>
                </div>
                <p className="text-gray-300 text-lg">
                  To simplify the job search process by providing a seamless
                  platform where job seekers find their dream roles and
                  employers discover top talent, fostering growth and
                  opportunity for all.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <Briefcase className="w-8 h-8 text-blue-400 mr-3" />
                  <h2 className="text-3xl font-semibold text-white">
                    Our Vision
                  </h2>
                </div>
                <p className="text-gray-300 text-lg">
                  To become the leading global job platform, transforming the
                  way people work and companies grow by connecting passion with
                  purpose.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              className="text-4xl font-bold mb-12 text-white"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Meet Our Team
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Jane Doe",
                  role: "Founder & CEO",
                  image: "https://via.placeholder.com/150",
                  bio: "Passionate about empowering careers, Jane leads HireHub with a vision for innovation.",
                },
                {
                  name: "John Smith",
                  role: "CTO",
                  image: "https://via.placeholder.com/150",
                  bio: "A tech visionary, John builds the robust platform that powers HireHub.",
                },
                {
                  name: "Emily Brown",
                  role: "Head of Talent",
                  image: "https://via.placeholder.com/150",
                  bio: "Emily ensures every candidate finds their perfect role with HireHub.",
                },
              ].map((member, index) => (
                <motion.div
                  key={index}
                  className="bg-[#001636] rounded-lg p-6 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-white">
                    {member.name}
                  </h3>
                  <p className="text-blue-400 mb-2">{member.role}</p>
                  <p className="text-gray-300 text-sm">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        {/* Core Values Section */}
        <section className="py-16 bg-[#001636]">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-4xl font-bold text-center mb-12 text-white"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Our Core Values
            </motion.h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: <Users className="w-8 h-8 text-blue-400" />,
                  title: "Collaboration",
                  desc: "We believe in working together to achieve shared success.",
                },
                {
                  icon: <Target className="w-8 h-8 text-blue-400" />,
                  title: "Innovation",
                  desc: "We embrace new ideas to transform the job market.",
                },
                {
                  icon: <Heart className="w-8 h-8 text-blue-400" />,
                  title: "Integrity",
                  desc: "We uphold honesty and transparency in all we do.",
                },
                {
                  icon: <Briefcase className="w-8 h-8 text-blue-400" />,
                  title: "Excellence",
                  desc: "We strive for the highest quality in our services.",
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center p-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="w-14 h-14 flex items-center justify-center bg-[#00040A] rounded-full mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-300 text-sm">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              className="text-4xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p
              className="text-xl text-gray-300 max-w-xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Whether you're seeking your next career move or building your
              dream team, HireHub is here to help.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link to="/signup">
                <button className="bg-blue-400 text-white font-semibold py-3 px-8 rounded-md hover:bg-blue-500 transition duration-300">
                  Get Started
                </button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
