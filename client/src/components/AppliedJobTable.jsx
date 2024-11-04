import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const AppliedJobTable = () => {
    // Safely get appliedJobs from state with a fallback to an empty array
    const { allAppliedJobs } = useSelector(state => state.job);

    // Function to return appropriate color for status
    const getStatusColor = (status) => {
        if (!status) return 'text-gray-500'; // Fallback color when status is undefined or null
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'text-orange-500';
            case 'accepted':
                return 'text-green-500';
            case 'rejected':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <motion.div
            initial={ { opacity: 0 } }
            animate={ { opacity: 1 } }
            transition={ { duration: 0.5 } }
        >

            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-blue-300 rounded-xl">
                    <thead>
                        <tr className="bg-blue-600 text-white">
                            <th className="border border-blue-300 px-4 py-2">Job Title</th>
                            <th className="border border-blue-300 px-4 py-2">Company</th>
                            <th className="border border-blue-300 px-4 py-2">Applied Date</th>
                            <th className="border border-blue-300 px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allAppliedJobs?.length > 0 ? (
                                allAppliedJobs?.map((appliedJob) => (
                                    <tr key={ appliedJob._id } className="text-blue-600 hover:bg-blue-100">
                                        <td className="border border-blue-300 px-4 py-2">{ appliedJob?.job.title }</td>
                                        <td className="border border-blue-300 px-4 py-2">{ appliedJob?.job.company.name }</td>
                                        <td className="border border-blue-300 px-4 py-2">
                                            { new Date(appliedJob.createdAt).toLocaleDateString() }
                                        </td>
                                        <td className={ `border border-blue-300 px-4 py-2 ${getStatusColor(appliedJob?.status)}` }>
                                            { appliedJob?.status || 'Unknown' }
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">No applied jobs found</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default AppliedJobTable;
