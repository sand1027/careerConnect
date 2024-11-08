import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        if (searchedQuery) {
            const queryWords = searchedQuery.toLowerCase().split(" "); // Split the search query into individual words
            const filteredJobs = allJobs.filter(job => {
                // Check if any word from the search query is included in the job's title, description, or location
                return queryWords.some(word =>
                    job.title.toLowerCase().includes(word) ||
                    job.description.toLowerCase().includes(word) ||
                    job.location.toLowerCase().includes(word)
                );
            });
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className="bg-white">
            <Navbar />
            <div className='max-w-7xl mx-auto  pt-16'>
                <div className='flex gap-5'>
                    <div className='w-1/5'>
                        <FilterCard />
                    </div>
                    { filterJobs.length <= 0 ? (
                        <span className="text-blue-600 font-bold">Job not found</span>
                    ) : (
                        <motion.div
                            className='flex-1 h-[88vh] overflow-y-auto pb-5'
                            initial={ { opacity: 0 } }
                            animate={ { opacity: 1 } }
                            transition={ { duration: 0.5 } }
                        >
                            <motion.div
                                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                                layout
                            >
                                { filterJobs.map(job => (
                                    <motion.div
                                        key={ job?._id }
                                        layout
                                        initial={ { opacity: 0, y: 50 } }
                                        animate={ { opacity: 1, y: 0 } }
                                        transition={ { type: 'spring', stiffness: 200, damping: 20 } }
                                    >
                                        <Job job={ job } />
                                    </motion.div>
                                )) }
                            </motion.div>
                        </motion.div>
                    ) }
                </div>
            </div>
        </div>
    );
};

export default Jobs;
