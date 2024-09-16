import { Link} from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaCog } from 'react-icons/fa';

const Sidebar = ({isSidebarOpen}:any) => {
    return(
        <aside className={`w-64 bg-indigo-700 text-white border-r border-indigo-600 fixed top-0 left-0 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}>
                <div className="flex flex-col h-full">
                    <div className="items-center justify-center h-16 bg-indigo-800 hidden sm:flex">
                        <img src="/logo-white.png" alt="Logo" className="h-16" />
                    </div>
                    <nav className="flex-1 overflow-y-auto">
                        <ul className="space-y-2 lg:mt-5">
                            <li>
                                <Link to="/dashboard" className="flex items-center px-4 py-3 text-gray-300 hover:bg-indigo-600">
                                    <FaTachometerAlt className="w-6 h-6 mr-3" />
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/users" className="flex items-center px-4 py-3 text-gray-300 hover:bg-indigo-600">
                                    <FaUsers className="w-6 h-6 mr-3" />
                                    Users
                                </Link>
                            </li>
                            <li>
                                <Link to="/settings" className="flex items-center px-4 py-3 text-gray-300 hover:bg-indigo-600">
                                    <FaCog className="w-6 h-6 mr-3" />
                                    Settings
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
    )
};

export default Sidebar;