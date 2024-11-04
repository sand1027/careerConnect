import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import { motion } from 'framer-motion';

const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <motion.div
            initial={ { opacity: 0 } }
            animate={ { opacity: 1 } }
            transition={ { duration: 0.5 } }
            className='pb-4'
        >
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-blue-200 rounded-2xl my-5 p-8 shadow-md transition-all duration-500 ease-in-out'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={ user?.profile?.profilePhoto } alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl text-blue-600'>{ user?.fullname }</h1>
                            <p className="text-gray-600">{ user?.profile?.bio }</p>
                        </div>
                    </div>
                    <Button onClick={ () => setOpen(true) } className="text-right" variant="outline">
                        <Pen />
                    </Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2 text-blue-600'>
                        <Mail />
                        <span>{ user?.email }</span>
                    </div>
                    <div className='flex items-center gap-3 my-2 text-blue-600'>
                        <Contact />
                        <span>{ user?.phoneNumber }</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1 className='text-blue-600'>Skills</h1>
                    <div className='flex items-center gap-1'>
                        {
                            user?.profile?.skills.length !== 0 ? user?.profile?.skills.map((item, index) => (
                                <Badge key={ index } className="bg-blue-600 text-white">{ item }</Badge>
                            )) : <span>NA</span>
                        }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold text-blue-600">Resume</Label>
                    {
                        isResume ? <a target='blank' href={ user?.profile?.resume } className='text-blue-500 w-full hover:underline cursor-pointer'>{ user?.profile?.resumeOriginalName }</a> : <span>NA</span>
                    }
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl shadow-md transition-all duration-500 ease-in-out'>
                <h1 className='font-bold text-lg my-5 text-blue-600'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={ open } setOpen={ setOpen } />
        </motion.div>
    )
}

export default Profile;
