import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from "react-router-dom";
import Datatable from "@/components/Datatable";
import { listUsers, deleteUser } from "@/services/userService";
import { toast } from "react-toastify";

const List: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const columns = [
        { label: "S.N", data: "s_n", searchable: false },
        { label: "Name", data: "name", searchable: true },
        { label: "Email", data: "email", searchable: true },
        { label: "Phone Number", data: "phone", searchable: true },
        { label: "Date of birth", data: "dob", searchable: false },
        { label: "Gender", data: "gender", searchable: false },
        { label: "Role", data: "role", searchable: false },
        { label: "Address", data: "address", searchable: false },
        { label: "Actions", data: "actions", searchable: false },
    ];

    const fetchData = async () => {
        try {
            const res = await listUsers();
            const formattedData = res.data.map((user: any, index: number) => ({
                s_n: index + 1,
                id: user.id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                phone: user.phone,
                dob: new Date(user.dob).toLocaleDateString(),
                gender: user.gender === 'm' ? 'Male' : user.gender === 'f' ? 'Female' : 'Other',
                role: user.role === 'super_admin' ? 'Super Admin' : user.role === 'artist_manager' ? 'Artist Manager' : user.role,
                address: user.address,
                actions: (
                    <div className="flex justify-center items-center space-x-4">
                        <Link to={`/user/${user.id}/edit`} className="text-blue-600 hover:text-blue-800">
                            <FaEdit size={16} />
                        </Link>
                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800">
                            <FaTrash size={16} />
                        </button>
                    </div>
                ),
            }));
            setData(formattedData);
        } catch (err) {
            toast.error("Failed Fetching User Data");
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleDelete = async (id: number) => {
        const isConfirmed = window.confirm("Do you want to delete the user?");

        if (isConfirmed) {
            try {
                await deleteUser(id);
                toast.success("User Deleted Successfully!");
                fetchData();
            } catch (error) {
                console.error("Failed to delete the user:", error);
            }
        }
    };
    return (

        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
            <div className="w-full max-w-6xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Users List</h1>
                    <Link to="/users/create">
                        <button className="px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:ring focus:ring-indigo-200">
                            Add New User
                        </button>
                    </Link>
                </div>

                <div className="w-full p-4 space-y-6 bg-white rounded-lg shadow-md">
                    <Datatable columns={columns} data={data} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default List;