import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);  // Assuming allJobs is an array
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(''));
        };
    }, [dispatch]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto  pt-16'>
                <h1 className='font-bold text-xl my-10'>Search Results ({ allJobs.length })</h1>
                <div className='grid grid-cols-3 gap-4'>
                    { allJobs.length > 0 ? (
                        allJobs.map((job) => (
                            <Job key={ job._id } job={ job } />
                        ))
                    ) : (
                        <p>No jobs found.</p>
                    ) }
                </div>
            </div>
        </div>
    );
};

export default Browse;
