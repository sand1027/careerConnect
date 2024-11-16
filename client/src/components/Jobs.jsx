import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [showFilters, setShowFilters] = useState(false); // State for showing filter card on mobile

    useEffect(() => {
        if (searchedQuery) {
            const queryWords = searchedQuery.toLowerCase().split(" ");
            const filteredJobs = allJobs.filter(job => {
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
            <div className="max-w-7xl mx-auto pt-16">
                <div className="flex flex-col md:flex-row gap-5">
                    {/* Toggle button for mobile */ }
                    <button
                        onClick={ () => setShowFilters(!showFilters) }
                        className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        { showFilters ? "Hide Filters" : "Show Filters" }
                    </button>

                    {/* Sidebar Filters */ }
                    <div
                        className={ `transition-all duration-300 ease-in-out md:block ${showFilters ? "block" : "hidden"
                            } md:w-1/4 w-full` }
                    >
                        <FilterCard />
                    </div>

                    {/* Jobs Section */ }
                    { filterJobs.length <= 0 ? (
                        <span className="text-blue-600 font-bold">Job not found</span>
                    ) : (
                        <motion.div
                            className="flex-1 h-[88vh] overflow-y-auto pb-5"
                            initial={ { opacity: 0 } }
                            animate={ { opacity: 1 } }
                            transition={ { duration: 0.5 } }
                        >
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
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
