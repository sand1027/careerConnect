import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filteredJobs, setFilteredJobs] = useState([]);

    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (searchedQuery) {
            const queryWords = searchedQuery.toLowerCase().split(" ");
            const filtered = allJobs.filter(job => {
                const searchFields = [
                    job.title,
                    job.description,
                    job.requirements?.join(" "), // Join requirements array into a single string
                    job.location
                ];
                return queryWords.some(word =>
                    searchFields.some(field => field?.toLowerCase().includes(word))
                );
            });
            setFilteredJobs(filtered);
        } else {
            setFilteredJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto pt-20  bg-gradient-to-br from-[#00040A] to-[#001636]">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filter Sidebar */ }
                    <div className="hidden lg:block lg:col-span-1">
                        <FilterCard />
                    </div>

                    {/* Main Job List Section */ }
                    <div className="lg:col-span-3">
                        <motion.div
                            className="grid grid-cols-1 gap-8" // Changed from grid-cols-1 md:grid-cols-2 lg:grid-cols-3 to grid-cols-1
                            initial={ { opacity: 0 } }
                            animate={ { opacity: 1 } }
                            transition={ { duration: 0.5 } }
                        >
                            { filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => (
                                    <motion.div
                                        key={ job?._id }
                                        layout
                                        initial={ { opacity: 0, y: 50 } }
                                        animate={ { opacity: 1, y: 0 } }
                                        transition={ {
                                            type: 'spring',
                                            stiffness: 200,
                                            damping: 20
                                        } }
                                    >
                                        <Job job={ job } />
                                    </motion.div>
                                ))
                            ) : (
                                <span className="text-blue-600 font-bold">No jobs found</span>
                            ) }
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
