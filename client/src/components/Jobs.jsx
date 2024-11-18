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
        <div className="bg-white min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto pt-20">
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
                    <motion.div
                        className="flex-1 h-[88vh] overflow-y-auto pb-5"
                        initial={ { opacity: 0 } }
                        animate={ { opacity: 1 } }
                        transition={ { duration: 0.5 } }
                    >
                        { filteredJobs.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                layout
                            >
                                { filteredJobs.map(job => (
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
                                )) }
                            </motion.div>
                        ) : (
                            <span className="text-blue-600 font-bold">No jobs found</span>
                        ) }
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
