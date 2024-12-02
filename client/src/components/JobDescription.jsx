import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isInitiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isInitiallyApplied);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });

            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id))
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <> <Navbar />

            <motion.div
                initial={ { opacity: 0, y: 50 } }
                animate={ { opacity: 1, y: 0 } }
                transition={ { duration: 0.5 } }
                className='max-w-6xl mx-auto pt-16  first-letter: bg-white p-4  sm:p-15 lg:p-20  sm:mt-0'
            >

                {/* Job Header Section */ }
                <motion.div
                    initial={ { opacity: 0, x: -50 } }
                    animate={ { opacity: 1, x: 0 } }
                    transition={ { duration: 0.5, delay: 0.2 } }
                    className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6'
                >
                    <div className="mb-4 sm:mb-0">
                        <h1 className='text-2xl font-semibold text-blue-700'>{ singleJob?.title }</h1>
                        <div className='flex flex-wrap items-center gap-4 mt-4'>
                            <Badge className='text-blue-600 bg-blue-100 font-medium' variant="ghost">{ singleJob?.position } Positions</Badge>
                            <Badge className='text-red-600 bg-red-100 font-medium' variant="ghost">{ singleJob?.jobType }</Badge>
                            <Badge className='text-purple-600 bg-purple-100 font-medium' variant="ghost">{ singleJob?.salary?.length == 0 ? singleJob?.salary : 'Not Disclosed' } LPA</Badge>
                        </div>
                    </div>

                    <Button
                        onClick={ isApplied ? null : applyJobHandler }
                        disabled={ isApplied }
                        className={ `rounded-lg px-6 py-3 ${isApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}` }
                    >
                        { isApplied ? 'Already Applied' : 'Apply Now' }
                    </Button>
                </motion.div>

                {/* Job Description Section */ }
                <motion.div
                    initial={ { opacity: 0, x: 50 } }
                    animate={ { opacity: 1, x: 0 } }
                    transition={ { duration: 0.5, delay: 0.4 } }
                >
                    <h2 className='text-lg font-semibold text-gray-700 border-b-2 border-gray-200 pb-2 mb-4'>Job Description</h2>
                    <div className='space-y-4'>
                        <p className='text-gray-600'><strong>Role:</strong> { singleJob?.title }</p>
                        <p className='text-gray-600'><strong>Location:</strong> { singleJob?.location }</p>
                        <p className='text-gray-600'><strong>Description:</strong> { singleJob?.description }</p>
                        <p className='text-gray-600'><strong>Experience:</strong> { singleJob?.experience }</p>
                        <p className='text-gray-600'><strong>Salary:</strong> { singleJob?.salary } </p>
                        <p className='text-gray-600'><strong>Total Applicants:</strong> { singleJob?.applications?.length }</p>
                        <p className='text-gray-600'><strong>Posted Date:</strong> { singleJob?.createdAt.split("T")[0] }</p>
                    </div>
                </motion.div>
            </motion.div>
            <Footer />
        </>
    )
}

export default JobDescription;
