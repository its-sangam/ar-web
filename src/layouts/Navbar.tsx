import { useEffect, useState } from 'react';
import { FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserContext } from '@/contexts/UserContext';


const Navbar = ({ setIsSidebarOpen }: any) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const { user,logout } = useUserContext();
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully!");
        navigate('/login');
    };
    useEffect(() => {
        setIsProfileMenuOpen(false);
      }, [location.pathname]);
    return (
        <nav className="bg-white border-b border-indigo-200 flex justify-between sm:justify-end  p-4">
            <button onClick={() => setIsSidebarOpen((prev: boolean) => !prev)} className="lg:hidden p-2 text-gray-600 rounded hover:bg-gray-100">
                <FaBars className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4 sm:hidden">
                <img src="logo.png" alt="Logo" className="h-16" />
            </div>

            <div className="relative">
                <button
                    onClick={() => setIsProfileMenuOpen(prev => !prev)}
                    type="button"
                    className="flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200 ease-in-out"
                >
                    <img
                        src="/user.png"
                        alt="Profile Pic"
                        className="w-10 h-10 rounded-full border-2 border-gray-300 mr-3"
                    />
                    <div className="ml-2">
                        <span className="block font-semibold text-gray-800">{user?.first_name + ' ' + user?.last_name}</span>
                        <span className="block text-sm text-gray-500">{user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'artist_manager' ? 'Artist Manager' : "Artist"}</span>
                    </div>
                </button>

                <div className={`absolute right-0 mt-2 w-48 bg-indigo-800 border border-indigo-600 rounded shadow-lg ${isProfileMenuOpen ? 'block' : 'hidden'}`}>
                    <ul>
                        {/* <li>
                            <Link to="/manage-account" className="block px-4 py-2 text-white hover:bg-indigo-700">
                                <FaUser className="inline mr-2" />
                                Manage Account
                            </Link>
                        </li> */}
                        <li>
                            <button
                                onClick={handleLogout}
                                className="block px-4 py-2 text-white hover:bg-indigo-700 w-full text-left"
                            >
                                <FaSignOutAlt className="inline mr-2" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
