import React from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { getMusicDetails, updateMusic } from "@/services/musicService";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { MusicSchema } from "@/lib/validators/music-validators";

interface IFormInput {
    title: string;
    album_name: string;
    genre: "rnb" | "country" | "classic" | "rock" | "jazz";
}

const UpdateMusic: React.FC = () => {
    const { musicId } = useParams();
    const navigate = useNavigate();

    // Hook to fetch music details
    const { isLoading, error, data } = useQuery(['music', musicId], () => getMusicDetails(musicId!), {
        enabled: !!musicId && !isNaN(Number(musicId)),
        onError: (error: any) => {
            console.error(error);
            toast.error("Error fetching music details");
        }
    });

    // Hook for mutation to update music
    const mutation = useMutation(({ musicId, data }: { musicId: string; data: IFormInput }) => updateMusic(musicId, data), {
        onSuccess: () => {
            toast.success("Music Updated Successfully!");
            navigate('/musics/list');
        },
        onError: (error: any) => {
            if (error?.response?.status === 400) {
                const serverErrors = error?.response?.data || {};
                for (const [key, message] of Object.entries(serverErrors)) {
                    setError(key as keyof IFormInput, {
                        type: "manual",
                        message: message as string,
                    });
                }
            } else {
                toast.error("Music update failed. Please try again.");
            }
        }
    });

    // Hook to manage form state and validation
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset
    } = useForm<IFormInput>({
        resolver: yupResolver(MusicSchema),
    });

    // Reset form data when music details are successfully fetched
    React.useEffect(() => {
        if (data) {
            reset(data);
        }
    }, [data, reset]);

    const onSubmit = (data: IFormInput) => {
        if (!musicId) return; // Early return if musicId is not available
        mutation.mutate({ musicId, data });
    };

    // Early return for loading or error state
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading music details.</div>;

    return (
        <div className="flex justify-center min-h-screen bg-gray-100">
            <div className="w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 text-sm font-medium">Title</label>
                            <input
                                {...register("title")}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium">Album Name</label>
                            <input
                                {...register("album_name")}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                            />
                            {errors.album_name && (
                                <p className="text-sm text-red-500">{errors.album_name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Genre</label>
                            <select
                                {...register("genre")}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                            >
                                <option value="rnb">Rnb</option>
                                <option value="country">Country</option>
                                <option value="classic">Classic</option>
                                <option value="rock">Rock</option>
                                <option value="jazz">Jazz</option>
                            </select>
                            {errors.genre && (
                                <p className="text-sm text-red-500">{errors.genre.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="text-right">
                        <button
                            type="submit"
                            className="p-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:ring focus:ring-indigo-200"
                            disabled={mutation.isLoading}
                        >
                            {mutation.isLoading ? 'Submitting' : "Update Music"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateMusic;