import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link, useParams } from "react-router-dom";
import Datatable from "@/components/Datatable";
import { listMusic, deleteMusic } from "@/services/musicService"; // Ensure this service is correct
import { toast } from "react-toastify";
import { useUserContext } from '@/contexts/UserContext';

const List: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);
    const { user } = useUserContext();
    const { id } = useParams();

    const columns = [
        { label: "S.N", data: "s_n", searchable: false },
        { label: "Title", data: "title", searchable: true },
        { label: "Music Name", data: "album_name", searchable: true },
        { label: "Genre", data: "genre", searchable: true },
        ...(user?.role === 'artist' ? [{ label: "Actions", data: "actions", searchable: false }] : []), // Conditionally add Actions column
    ];

    const fetchData = async () => {
        try {
            const res = await listMusic({artist_id:id});
            const formattedData = res.data.map((music: any, index: number) => ({
                s_n: index + 1,
                id: music.id,
                title: music.title,
                album_name: music.album_name,
                genre: music.genre,
                ...(user?.role === 'artist' ? {
                    actions: (
                        <div className="flex justify-center items-center space-x-4">
                            <Link to={`/music/${music.id}/edit`} className="text-blue-600 hover:text-blue-800">
                                <FaEdit size={16} />
                            </Link>
                            <button onClick={() => handleDelete(music.id)} className="text-red-600 hover:text-red-800">
                                <FaTrash size={16} />
                            </button>
                        </div>
                    )
                } : {}),
            }));
            setData(formattedData);
        } catch (err) {
            toast.error("Failed Fetching Music Data");
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        const isConfirmed = window.confirm("Do you want to delete this music?");

        if (isConfirmed) {
            try {
                await deleteMusic(id);
                toast.success("Music Deleted Successfully!");
                fetchData();
            } catch (error) {
                console.error("Failed to delete the music:", error);
                toast.error("Failed to delete the music.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
            <div className="w-full max-w-6xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Musics List</h1>
                    {user?.role === 'artist' && <Link to="/musics/create">
                        <button className="px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:ring focus:ring-indigo-200">
                            Add New Music
                        </button>
                    </Link>}
                </div>

                <div className="w-full p-4 space-y-6 bg-white rounded-lg shadow-md">
                    <Datatable columns={columns} data={data} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default List;
