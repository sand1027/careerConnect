import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (e) => {
        e.preventDefault();

        dispatch(setSearchedQuery(query));
        navigate('/browse');
    };

    return (
        <div className='flex flex-col items-center justify-center bg-blue-100 min-h-screen text-blue-900 px-6 py-16'>
            {/* Tagline */ }
            <motion.span
                className='mx-auto px-4 py-2 rounded-full bg-blue-200 text-blue-800 font-semibold mb-4'
                initial={ { opacity: 0, y: -30 } }
                whileInView={ { opacity: 1, y: 0 } }
                transition={ { duration: 0.6 } }
                viewport={ { once: true } }
            >
                India's Leading Career Portal
            </motion.span>

            {/* Title */ }
            <motion.h1
                className='text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-center'
                initial={ { opacity: 0, scale: 0.85 } }
                whileInView={ { opacity: 1, scale: 1 } }
                transition={ { duration: 0.7 } }
                viewport={ { once: true } }
            >
                Unlock Your Potential &<br /> Secure Your <span className='text-[#6A38C2]'>Ideal Job</span>
            </motion.h1>

            {/* Description */ }
            <motion.p
                className='text-base sm:text-lg md:text-xl max-w-lg mb-8 text-gray-700 text-center'
                initial={ { opacity: 0 } }
                whileInView={ { opacity: 1 } }
                transition={ { delay: 0.3, duration: 0.6 } }
                viewport={ { once: true } }
            >
                Join thousands of professionals who use our platform to find opportunities that match their skills. Start exploring top companies and growing startups looking for talent just like you!
            </motion.p>

            {/* Search Bar */ }
            <motion.div
                className='flex w-full sm:w-[70%] lg:w-[50%] shadow-md border border-blue-300 pl-3 pr-2 py-2 rounded-full items-center gap-4 mx-auto bg-white'
                initial={ { opacity: 0, y: 50 } }
                whileInView={ { opacity: 1, y: 0 } }
                transition={ { duration: 0.8 } }
                viewport={ { once: true } }
            >
                <input
                    type="text"
                    value={ query }
                    placeholder="Search by job title or skills"
                    onChange={ (e) => setQuery(e.target.value) }
                    className='w-full p-3 outline-none border-none text-blue-900 rounded-full focus:ring-2 focus:ring-blue-500'
                />
                <Button
                    onClick={ searchJobHandler }
                    className="rounded-full bg-[#6A38C2] text-white hover:bg-[#5731a6] px-6 py-3 flex items-center"
                >
                    <Search className='h-5 w-5 mr-2' />
                    Search
                </Button>
            </motion.div>

            {/* Scrolling Animation Section */ }
            <motion.div
                className='mt-16'
                initial={ { y: 50, opacity: 0 } }
                whileInView={ { y: 0, opacity: 1 } }
                transition={ { duration: 1 } }
                viewport={ { once: true } }
            >
                <p className='text-lg text-gray-700'>
                    Scroll down to explore more!
                </p>
                <motion.div
                    className='w-6 h-6 border-4 border-blue-600 rounded-full mt-4 animate-bounce'
                    initial={ { y: -10 } }
                    animate={ { y: 10 } }
                    transition={ { yoyo: Infinity, duration: 0.6 } }
                />
            </motion.div>
        </div>
    );
};

export default HeroSection;
