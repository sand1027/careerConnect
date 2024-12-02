import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            onClick={ () => navigate(`/description/${job._id}`) }
            className="p-6 rounded-lg shadow-lg bg-white border border-gray-200 cursor-pointer transition-all duration-300"
            initial={ { opacity: 0, y: 30 } } // Initial state for motion
            animate={ { opacity: 1, y: 0 } } // Animate to final state
            whileHover={ { scale: 1.05, boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)" } } // Hover effect
            transition={ { duration: 0.3 } }
        >
            <div className="mb-4">
                <h1 className="font-medium text-lg text-blue-800">{ job?.company?.name }</h1>
                <p className="text-sm text-gray-500">India</p>
            </div>

            <div className="mb-4">
                <h1 className="font-bold text-xl text-gray-900">{ job?.title }</h1>
                <p className="text-sm text-gray-600 mt-2">{ job?.description }</p>
            </div>

            <div className="flex items-center gap-3 mt-4 flex-wrap">
                <Badge className="bg-blue-100 text-blue-700 font-semibold" variant="ghost">
                    { job?.position } Positions
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 font-semibold" variant="ghost">
                    { job?.jobType }
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 font-semibold" variant="ghost">
                    { job?.salary } LPA
                </Badge>
            </div>
        </motion.div>
    );
};

export default LatestJobCards;
