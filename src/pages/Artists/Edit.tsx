import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { getArtistDetails, updateArtist } from "@/services/artistService";
import { ArtistSchema } from "@/lib/validators/artist-validators";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";

interface IMusicInput {
    title: string;
    album_name: string;
    genre: "rnb" | "country" | "classic" | "rock" | "jazz";
}

interface IFormInput {
    name: string;
    dob: Date | null;
    gender: "m" | "f" | "o";
    address: string;
    first_release_year: number;
    no_of_albums_released: number;
    musics?: IMusicInput[];
}

const EditArtist: React.FC = () => {
    // const { id } = useParams();
    // if (!id) {
    //     return <div>Artist Not Found</div>;
    // }
    // const navigate = useNavigate();

    // const { register, handleSubmit, control, formState: { errors }, setError, reset } = useForm<IFormInput>({
    //     resolver: yupResolver(ArtistSchema),
    //     defaultValues: {
    //         name: '',
    //         dob: null,
    //         gender: 'm',
    //         address: '',
    //         no_of_albums_released: 0,
    //         first_release_year: 2000,
    //         musics: [{ title: '', album_name: '', genre: 'rnb' }]
    //     }
    // });

    // const { fields, append, remove } = useFieldArray({
    //     control,
    //     name: "musics"
    // });

    // const { isLoading, error } = useQuery(['artist', id], () => getArtistDetails(id!), {
    //     enabled: !!id,
    //     onSuccess: (res) => {
    //         const { data } = res;
    //         data.dob = new Date(data.dob).toISOString().split('T')[0];
    //         reset(data);
    //     },
    //     onError: (error: any) => {
    //         console.error(error);
    //         toast.error("Error fetching artist details");
    //     }
    // });

    // const mutation = useMutation(({ id, data }: { id: string; data: IFormInput }) => updateArtist(id, data), {
    //     onSuccess: () => {
    //         toast.success("Artist Updated Successfully!");
    //         navigate('/artist/list');
    //     },
    //     onError: (error: any) => {
    //         if (error?.response?.status === 400) {
    //             const serverErrors = error?.response?.data || {};
    //             for (const [key, message] of Object.entries(serverErrors)) {
    //                 setError(key as keyof IFormInput, {
    //                     type: "manual",
    //                     message: message as string,
    //                 });
    //             }
    //         } else {
    //             toast.error("Artist update failed. Please try again.");
    //         }
    //     }
    // });

    // const onSubmit = (data: IFormInput) => {
    //     mutation.mutate({ id: id, data: data });
    // };

    // if (isLoading) return <div>Loading...</div>;
    // if (error) return <div>Error loading artist details.</div>;

    const { id } = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, control, formState: { errors }, setError, reset } = useForm<IFormInput>({
        resolver: yupResolver(ArtistSchema),
        defaultValues: {
            name: '',
            dob: null,
            gender: 'm',
            address: '',
            no_of_albums_released: 0,
            first_release_year: 2000,
            musics: [{ title: '', album_name: '', genre: 'rnb' }]
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "musics" });

    const { isLoading, error } = useQuery(
        ['artist', id],
        () => (id ? getArtistDetails(id!) : Promise.reject('No ID found')),
        {
            enabled: !!id,
            onSuccess: (res) => {
                const { data } = res;
                data.dob = new Date(data.dob).toISOString().split('T')[0];
                reset(data);
            },
            onError: (error: any) => {
                console.error(error);
                toast.error("Error fetching artist details");
            },
        }
    );

    const mutation = useMutation(
        ({ id, data }: { id: string; data: IFormInput }) => updateArtist(id, data),
        {
            onSuccess: () => {
                toast.success("Artist Updated Successfully!");
                navigate('/artist/list');
            },
            onError: ({ response }: any) => {
                if (response?.status === 400) {
                    const serverErrors = response?.data || {};
                    Object.entries(serverErrors).forEach(([key, message]) => {
                        setError(key as keyof IFormInput, { type: "manual", message: message as string });
                    });
                } else {
                    toast.error("Artist update failed. Please try again.");
                }
            },
        }
    );

    const onSubmit = (data: IFormInput) => mutation.mutate({ id: id!, data });

    if (!id) return <div>Artist Not Found</div>;
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading artist details.</div>;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 text-sm font-medium">Name</label>
                            <input
                                {...register("name")}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Date of Birth</label>
                            <input
                                type="date"
                                {...register("dob")}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                            />
                            {errors.dob && (
                                <p className="text-sm text-red-500">{errors.dob.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Gender</label>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value="m"
                                        {...register("gender")}
                                        className="text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium">Male</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value="f"
                                        {...register("gender")}
                                        className="text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium">Female</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value="o"
                                        {...register("gender")}
                                        className="text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium">Other</span>
                                </label>
                            </div>
                            {errors.gender && (
                                <p className="text-sm text-red-500">{errors.gender.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Address</label>
                            <input
                                {...register("address")}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                            />
                            {errors.address && (
                                <p className="text-sm text-red-500">{errors.address.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">First Release Year</label>
                            <input
                                type="number"
                                {...register("first_release_year")}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                            />
                            {errors.first_release_year && (
                                <p className="text-sm text-red-500">{errors.first_release_year.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Number of Albums Released</label>
                            <input
                                type="number"
                                {...register("no_of_albums_released")}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                            />
                            {errors.no_of_albums_released && (
                                <p className="text-sm text-red-500">{errors.no_of_albums_released.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium">Musics</h2>
                        <button type="button" onClick={() => append({ title: "", album_name: "", genre: "rnb" })} className="text-indigo-600 hover:text-indigo-800">
                            <FaPlus size={16} />
                        </button>
                    </div>

                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium">Title</label>
                                <input
                                    {...register(`musics.${index}.title` as const)}
                                    defaultValue={field.title}
                                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                                />
                                {errors.musics?.[index]?.title && (
                                    <p className="text-sm text-red-500">{errors.musics[index].title?.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Album Name</label>
                                <input
                                    {...register(`musics.${index}.album_name` as const)}
                                    defaultValue={field.album_name}
                                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                                />
                                {errors.musics?.[index]?.album_name && (
                                    <p className="text-sm text-red-500">{errors.musics[index].album_name?.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Genre</label>
                                <select
                                    {...register(`musics.${index}.genre` as const)}
                                    defaultValue={field.genre}
                                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                                >
                                    <option value="rnb">Rnb</option>
                                    <option value="country">Country</option>
                                    <option value="classic">Classic</option>
                                    <option value="rock">Rock</option>
                                    <option value="jazz">Jazz</option>
                                </select>
                                {errors.musics?.[index]?.genre && (
                                    <p className="text-sm text-red-500">{errors.musics[index].genre?.message}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-center">
                            <button onClick={() => remove(index)} className="text-red-600 hover:text-red-800">
                                    <FaTrash size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="text-right">
                        <button
                            type="submit"
                            className="p-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:ring focus:ring-indigo-200"
                            disabled={mutation.isLoading}
                        >
                            {mutation.isLoading ? 'Submitting' : "Update Artist"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditArtist;