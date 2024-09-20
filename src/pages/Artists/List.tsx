import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { Link } from "react-router-dom";
import Datatable from "@/components/Datatable";
import { listArtists, deleteArtist, exportArtists, importArtists } from "@/services/artistService";
import { toast } from "react-toastify";
import { useUserContext } from "@/contexts/UserContext";
import CSVImportModal from "@/components/CSVImportModal";

const List: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const { user } = useUserContext();
    const [uploadErrors] = useState<string[]>([]);


    const columns = [
        { label: "S.N", data: "s_n", searchable: false },
        { label: "Name", data: "name", searchable: true },
        { label: "Date of birth", data: "dob", searchable: true },
        { label: "Gender", data: "gender", searchable: false },
        { label: "Address", data: "address", searchable: false },
        { label: "First Release Year", data: "first_release_year", searchable: false },
        { label: "No of albums released", data: "no_of_albums_released", searchable: false },
        { label: "Actions", data: "actions", searchable: false },
    ];

    const fetchData = async () => {
        try {
            const res = await listArtists();
            const formattedData = res.data.map((artist: any, index: number) => ({
                s_n: index + 1,
                id: artist.id,
                name: artist.name,
                dob: new Date(artist.dob).toLocaleDateString(),
                gender: artist.gender === 'm' ? 'Male' : artist.gender === 'f' ? 'Female' : 'Other',
                first_release_year: artist.first_release_year,
                no_of_albums_released: artist.no_of_albums_released,
                address: artist.address,
                actions: (
                    <div className="flex justify-center items-center space-x-4">
                        <Link to={`/artist/${artist.id}/musics/list`} className="text-blue-600 hover:text-blue-800">
                            <FaEye size={16} />
                        </Link>
                        {user?.role === 'artist_manager' &&
                            <>
                                <Link to={`/artist/${artist.id}/edit`} className="text-blue-600 hover:text-blue-800">
                                    <FaEdit size={16} />
                                </Link>
                                <button onClick={() => handleDelete(artist.id)} className="text-red-600 hover:text-red-800">
                                    <FaTrash size={16} />
                                </button>
                            </>
                        }
                    </div>
                ),
            }));
            setData(formattedData);
        } catch (err) {
            toast.error("Failed Fetching Artist Data");
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleDelete = async (id: number) => {
        const isConfirmed = window.confirm("Do you want to delete the artist?");

        if (isConfirmed) {
            try {
                await deleteArtist(id);
                toast.success("Artist Deleted Successfully!");
                fetchData();
            } catch (error) {
                console.error("Failed to delete the artist:", error);
            }
        }
    };

    const handleExport = async () => {
        const isConfirmed = window.confirm("Do you want to export the artists in csv format?");

        if (isConfirmed) {
            try {
                const blob = await exportArtists();

                if (blob.records) {
                    const url = window.URL.createObjectURL(new Blob([blob.records]));
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'artists.csv';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    toast.success("Artist Exported Successfully!");
                }
            } catch (error) {
                console.error("Failed to export the artists:", error);
            }
        }
    }

    const [isCSVUploadModalOpen, setIsCSVUploadModalOpen] = useState(false);

    const handleUpload = async (file: File): Promise<string[]> => {
        const errors: string[] = [];
        try {
            const response = await importArtists(file);
            if (response?.status === 200) {
                toast.success("CSV file uploaded successfully!");
                fetchData();
                setIsCSVUploadModalOpen(false);
            } else {
                errors.push(response?.data?.message);
            }
        } catch (error) {
            console.error("Failed to upload CSV file:", error);
            errors.push("Failed to upload CSV file. Please try again.");
        }
        return errors;
    };
    
    
    
    return (

        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
            <div className="w-full max-w-6xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Artists List</h1>
                    <div className="flex gap-2">
                        {user?.role === 'artist_manager' &&
                            <>
                                {/* <Link to="/artist/create"> */}
                                <button onClick={() => setIsCSVUploadModalOpen(true)} className="px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:ring focus:ring-indigo-200">
                                    Import
                                </button>
                                {/* </Link> */}
                                {/* <Link to="/artist/create"> */}
                                <button onClick={handleExport} className="px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:ring focus:ring-indigo-200">
                                    Export
                                </button>
                                {/* </Link> */}
                                <Link to="/artist/create">
                                    <button className="px-4 py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:ring focus:ring-indigo-200">
                                        Add New Artist
                                    </button>
                                </Link>
                            </>}
                    </div>
                </div>

                <CSVImportModal
                    isOpen={isCSVUploadModalOpen}
                    onClose={() => setIsCSVUploadModalOpen(false)}
                    onUpload={handleUpload}
                    uploadErrors={uploadErrors}
                />

                <div className="w-full p-4 space-y-6 bg-white rounded-lg shadow-md">
                    <Datatable columns={columns} data={data} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default List;