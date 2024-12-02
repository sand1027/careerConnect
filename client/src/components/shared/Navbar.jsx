import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Menu, LogOut, User2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State to handle mobile menu toggle
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch({ type: 'LOGOUT' });
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };


    return (
        <div className='bg-white p-4 shadow-md w-full fixed top-0 z-50 '>
            <div className='flex items-center justify-between mx-auto max-w-7xl px-4'>

                <div className='text-2xl font-bold mr-20 cursor-pointer' onClick={ () => navigate('/') }>
                    Hire <span className='text-blue-600'>Hub</span>
                </div>

                {/* Mobile Menu Toggle */ }
                <div className='md:hidden flex items-center'>
                    <button onClick={ toggleMenu } aria-label='Toggle Menu'>
                        { menuOpen ? <X className='w-6 h-6 text-blue-600' /> : <Menu className='w-6 h-6 text-blue-600' /> }
                    </button>
                </div>

                {/* Links and User Avatar for Desktop */ }
                <div className='hidden md:flex flex-1 items-center justify-between'>
                    <ul className='flex font-sans items-end space-x-6 list-none'>
                        { user && user.role === 'recruiter' ? (
                            <>
                                <Link to='/admin/companies'><li className='cursor-pointer text-blue-600'>Companies</li></Link>
                                <Link to='/admin/jobs'><li className='cursor-pointer text-blue-600'>Jobs</li></Link>
                            </>
                        ) : (
                            <>
                                <Link to='/'><li className='cursor-pointer text-blue-600'>Home</li></Link>
                                <Link to='/jobs'><li className='cursor-pointer text-blue-600'>Jobs</li></Link>
                                <Link to='/browse'><li className='cursor-pointer text-blue-600'>Browse</li></Link>
                            </>
                        ) }
                    </ul>

                    { user ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="w-8 h-8 rounded-full overflow-hidden cursor-pointer">
                                    <AvatarImage
                                        src={ user?.profile?.profilePhoto }
                                        alt="User Avatar"
                                        className="object-cover w-full h-full"
                                    />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="p-4 bg-white shadow-md rounded-lg w-80">
                                <div className='flex items-center gap-4'>
                                    <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                                        <AvatarImage
                                            src={ user?.profile?.profilePhoto }
                                            alt="User Avatar"
                                            className="object-cover w-full h-full"
                                        />
                                    </Avatar>
                                    <div>
                                        <h1 className="font-semibold text-blue-600">{ user?.fullname }</h1>
                                        <p className="text-sm text-gray-500">{ user?.profile?.bio }</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-between items-center gap-2">
                                    { user && user.role === 'student' && (
                                        <Link to='/profile'>
                                            <Button className="flex items-center gap-1 text-blue-500 bg-transparent border-none shadow-sm hover:bg-gray-100">
                                                <User2 className="w-4 h-4" />
                                                View Profile
                                            </Button>
                                        </Link>
                                    ) }

                                    <Button onClick={ logoutHandler } className="flex items-center gap-1 text-red-500 bg-transparent border-none shadow-sm hover:bg-gray-100">
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <div className='flex items-center gap-2'>
                            <Link to='/login'>
                                <Button variant='outline' className='border-blue-600 text-blue-600'>Login</Button>
                            </Link>
                            <Link to='/signup'>
                                <Button className='bg-blue-600 hover:bg-blue-700 text-white'>Signup</Button>
                            </Link>
                        </div>
                    ) }
                </div>

            </div>

            {/* Mobile Menu (if open) */ }
            { menuOpen && (
                <div className="absolute top-16 left-0 right-0 bg-white shadow-md p-4 md:hidden z-50">
                    <ul className="space-y-4 text-blue-600">
                        { user?.role === 'recruiter' ? (
                            <>
                                <li className="cursor-pointer"><Link to="/admin/companies">Companies</Link></li>
                                <li className="cursor-pointer"><Link to="/admin/jobs">Jobs</Link></li>
                            </>
                        ) : (
                            <>
                                <li className="cursor-pointer"><Link to="/">Home</Link></li>
                                <li className="cursor-pointer"><Link to="/jobs">Jobs</Link></li>
                                <li className="cursor-pointer"><Link to="/browse">Browse</Link></li>
                                <li><Link to='/profile'>
                                    <Button className="flex items-center gap-1 text-blue-500 bg-transparent border-none shadow-sm hover:bg-gray-100">
                                        <User2 className="w-4 h-4" />
                                        View Profile
                                    </Button>
                                </Link></li>
                            </>
                        ) }

                        { !user && (
                            <div className="flex flex-col gap-2">
                                <Link to="/login">
                                    <Button variant="outline" className="border-blue-600 text-blue-600">Login</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Signup</Button>
                                </Link>
                            </div>
                        ) }
                    </ul>
                </div>
            )
            }
        </div >
    );
};

export default Navbar;