import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { getUserDetails, updateUser } from "@/services/userService";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { EditUserSchema } from "@/lib/validators/user-edit-validators";

interface IFormInput {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    dob: Date | null;
    gender: "m" | "f" | "o";
    address: string;
    role: "super_admin" | "artist_manager" | "artist";
}

const EditUser: React.FC = () => {
    const { id } = useParams();
    if (!id) {
        return <div>User Not Found</div>;
    }
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset
    } = useForm<IFormInput>({
        resolver: yupResolver(EditUserSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            dob: null,
            gender: 'm',
            address: '',
            role: 'super_admin'
        }
    });

    const { isLoading, error } = useQuery(['user', id], () => getUserDetails(id!), {
        enabled: typeof parseInt(id) === 'number',
        onSuccess: (res) => {
            const { data } = res;
            data.dob = new Date(data.dob).toISOString().split('T')[0]
            reset(data);
        },
        onError: (error: any) => {
            console.error(error);
            toast.error("Error fetching user details");
        }
    });

    const mutation = useMutation(({ id, data }: { id: string; data: IFormInput }) => updateUser(id, data), {
        onSuccess: () => {
            toast.success("User Updated Successfully!");
            navigate('/users/list');
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
                toast.error("User update failed. Please try again.");
            }
        }
    });

    const onSubmit = (data: IFormInput) => {
        mutation.mutate({ id: id, data: data });
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading user details.</div>;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full p-8 space-y-6 bg-white rounded-lg shadow-md">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 text-sm font-medium">First Name</label>
                            <input
                                {...register("first_name")}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                            />
                            {errors.first_name && (
                                <p className="text-sm text-red-500">{errors.first_name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Last Name</label>
                            <input
                                {...register("last_name")}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                            />
                            {errors.last_name && (
                                <p className="text-sm text-red-500">{errors.last_name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Email</label>
                            <input
                                readOnly={true}
                                type="email"
                                {...register("email")}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Phone</label>
                            <input
                                type="text"
                                {...register("phone")}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-500">{errors.phone.message}</p>
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
                            <label className="block mb-1 text-sm font-medium">Role</label>
                            <select
                                {...register("role")}
                                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                            >
                                <option value="super_admin">Super Admin</option>
                                <option value="artist_manager">Artist Manager</option>
                                <option value="artist">Artist</option>
                            </select>
                            {errors.role && (
                                <p className="text-sm text-red-500">{errors.role.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="text-right">
                        <button
                            type="submit"
                            className="p-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:ring focus:ring-indigo-200"
                            disabled={mutation.isLoading}
                        >
                            {mutation.isLoading ? 'Submitting' : "Update User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUser;
