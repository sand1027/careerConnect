import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
    const [input, setInput] = useState({
        fullname: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: '',
        file: ''
    });
    const { loading, user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullname', input.fullname);
        formData.append('email', input.email);
        formData.append('phoneNumber', input.phoneNumber);
        formData.append('password', input.password);
        formData.append('role', input.role);
        if (input.file) {
            formData.append('file', input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate('/login');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-r from-blue-100 to-white flex flex-col"
            initial={ { opacity: 0 } }
            animate={ { opacity: 1 } }
            transition={ { duration: 0.5 } }
        >
            <Navbar />
            <motion.div
                className="flex items-center justify-center w-full px-4 md:px-0 max-w-7xl mx-auto"
                initial={ { scale: 0.8, opacity: 0 } }
                animate={ { scale: 1, opacity: 1 } }
                transition={ { duration: 0.5 } }
            >
                <motion.form
                    onSubmit={ submitHandler }
                    className="w-full max-w-lg bg-white border border-gray-200 rounded-lg p-8 shadow-md my-10"
                    initial={ { y: 50, opacity: 0 } }
                    animate={ { y: 0, opacity: 1 } }
                    transition={ { type: 'spring', stiffness: 120 } }
                >
                    <motion.h1
                        className="font-bold text-2xl text-center text-blue-600 mb-5"
                        initial={ { opacity: 0 } }
                        animate={ { opacity: 1 } }
                        transition={ { delay: 0.2 } }
                    >
                        Sign Up
                    </motion.h1>
                    <motion.div
                        className="my-4"
                        initial={ { x: -100, opacity: 0 } }
                        animate={ { x: 0, opacity: 1 } }
                        transition={ { duration: 0.4 } }
                    >
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={ input.fullname }
                            name="fullname"
                            onChange={ changeEventHandler }
                            placeholder="John Doe"
                            className="mt-1"
                        />
                    </motion.div>
                    <motion.div
                        className="my-4"
                        initial={ { x: -100, opacity: 0 } }
                        animate={ { x: 0, opacity: 1 } }
                        transition={ { duration: 0.5 } }
                    >
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={ input.email }
                            name="email"
                            onChange={ changeEventHandler }
                            placeholder="john.doe@gmail.com"
                            className="mt-1"
                        />
                    </motion.div>
                    <motion.div
                        className="my-4"
                        initial={ { x: -100, opacity: 0 } }
                        animate={ { x: 0, opacity: 1 } }
                        transition={ { duration: 0.6 } }
                    >
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            value={ input.phoneNumber }
                            name="phoneNumber"
                            onChange={ changeEventHandler }
                            placeholder="8080808080"
                            className="mt-1"
                        />
                    </motion.div>
                    <motion.div
                        className="my-4"
                        initial={ { x: -100, opacity: 0 } }
                        animate={ { x: 0, opacity: 1 } }
                        transition={ { duration: 0.7 } }
                    >
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={ input.password }
                            name="password"
                            onChange={ changeEventHandler }
                            placeholder="********"
                            className="mt-1"
                        />
                    </motion.div>
                    <motion.div
                        className="flex flex-col md:flex-col items-center justify-between my-4"
                        initial={ { y: 50, opacity: 0 } }
                        animate={ { y: 0, opacity: 1 } }
                        transition={ { delay: 0.3 } }
                    >
                        <RadioGroup className="flex items-center gap-4">
                            <spn>I'am</spn>
                            <motion.div
                                className="flex items-center space-x-2"
                                initial={ { opacity: 0 } }
                                animate={ { opacity: 1 } }
                                transition={ { delay: 0.4 } }
                            >
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={ input.role === 'student' }
                                    onChange={ changeEventHandler }
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="student">JobSeeker</Label>
                            </motion.div>
                            <motion.div
                                className="flex items-center space-x-2"
                                initial={ { opacity: 0 } }
                                animate={ { opacity: 1 } }
                                transition={ { delay: 0.5 } }
                            >
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={ input.role === 'recruiter' }
                                    onChange={ changeEventHandler }
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="recruiter">Recruiter</Label>
                            </motion.div>
                        </RadioGroup>

                        <motion.div
                            className="flex items-center gap-2 mt-4 md:mt-0"
                            initial={ { opacity: 0 } }
                            animate={ { opacity: 1 } }
                            transition={ { delay: 0.6 } }
                        >
                            <Label>Profile </Label>
                            <Input
                                accept="image/*"
                                type="file"
                                onChange={ changeFileHandler }
                                className="cursor-pointer"
                            />
                        </motion.div>


                    </motion.div>
                    { loading ? (
                        <Button className="w-full my-4">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <motion.div
                            initial={ { scale: 0.8, opacity: 0 } }
                            animate={ { scale: 1, opacity: 1 } }
                            transition={ { delay: 0.4 } }
                        >
                            <Button type="submit" className="w-full my-4">
                                Signup
                            </Button>
                        </motion.div>
                    ) }
                    <motion.span
                        className="text-sm"
                        initial={ { opacity: 0 } }
                        animate={ { opacity: 1 } }
                        transition={ { delay: 0.6 } }
                    >
                        Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
                    </motion.span>
                </motion.form>
            </motion.div>
        </motion.div>
    );
};

export default Signup;
