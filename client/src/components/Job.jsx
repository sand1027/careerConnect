import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import axios from 'axios';
import { setsavedJobs } from '@/redux/authSlice';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/utils/constant';

const Job = ({ job }) => {
    const { savedJobs } = useSelector(store => store.auth)


    const navigate = useNavigate();
    const dispatch = useDispatch()

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    };

    const handleSaveForLater = async (jobId) => {
        console.log('entered')
        try {
            const response = await axios.post(`${USER_API_END_POINT}/savedjob`, { jobId }, {
                withCredentials: true
            });
            console.log(response);
            if (response) {
                dispatch(setsavedJobs(response.data.savedJobs))
                toast.success(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.success(error.response.data.message)
        }
    };
    return (
        <motion.div
            className='p-5 rounded-md shadow-lg bg-white border border-gray-100 hover:shadow-2xl cursor-pointer'
            whileHover={ { scale: 1.08 } }
            initial={ { opacity: 0, y: 20 } } // Initial state before the component becomes visible
            animate={ { opacity: 1, y: 0 } }  // Final state
            transition={ {
                type: 'spring',
                stiffness: 300,
                damping: 20,
                duration: 0.9,
                ease: 'easeInOut'
            } }
        >
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>
                    { daysAgoFunction(job?.createdAt) === 0 ? 'Today' : `${daysAgoFunction(job?.createdAt)} days ago` }
                </p>
                <Button variant='outline' className='rounded-full' size='icon'>
                    <Bookmark />
                </Button>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className='p-6' variant='outline' size='icon'>
                    <Avatar>
                        <AvatarImage src={ job?.company?.logo } />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{ job?.company?.name }</h1>
                    <p className='text-sm text-gray-500'>{ job?.company?.location }</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2 text-blue-700 truncate' style={ { maxWidth: '250px' } }>
                    { job?.title }
                </h1>
                <p className='text-sm text-gray-600 line-clamp-3 overflow-hidden'>
                    { job?.description }
                </p>
            </div>

            <div className='flex items-center gap-2 mt-4'>
                <Badge className='text-blue-700 font-bold whitespace-nowrap' variant='ghost'>
                    { job?.position } Positions
                </Badge>
                <Badge className='text-red-600 font-bold whitespace-nowrap' variant='ghost'>
                    { job?.jobType }
                </Badge>
                <Badge className='text-purple-600 font-bold whitespace-nowrap' variant='ghost'>
                    { job?.salary } LPA
                </Badge>
            </div>

            <div className='flex items-center gap-4 mt-4'>
                <Button onClick={ () => navigate(`/description/${job?._id}`) } variant='outline'>
                    Details
                </Button>
                {
                    savedJobs?.some(savedJobs => savedJobs._id.toString() === job?._id.toString()) ?
                        <Button className='bg-green-500 text-white' >Saved Already</Button> :
                        <Button className='bg-blue-700 text-white' onClick={ () => handleSaveForLater(job._id) }>Save For Later</Button>
                }


            </div>
        </motion.div>
    );
};

export default Job;
