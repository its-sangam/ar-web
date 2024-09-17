import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginUser } from "@/services/authService";
import { loginSchema } from "@/lib/validators/login-validators";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "@/contexts/UserContext";

interface IFormInput {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        getValues,
    } = useForm<IFormInput>({
        resolver: yupResolver(loginSchema),
    });
    const { setUser, setIsAuthenticated } = useUserContext();
    const navigate = useNavigate();

    const mutation = useMutation(loginUser, {
        onSuccess: (response) => {
            toast.success("Logged In successfully!");
            setUser(response.data.user);
            setIsAuthenticated(true);
            navigate('/dashboard');
        },
        onError: (error: any) => {
            if (error?.status === 400) {
                const serverErrors = error?.data || {};
                for (const [key, message] of Object.entries(serverErrors)) {
                    if (Object.keys(getValues()).includes(key)) {
                        setError(key as keyof IFormInput, {
                            type: "manual",
                            message: message as string,
                        });
                    }
                }
            } else {
                toast.error("Login failed. Please try again.");
            }
        }
    });

    const onSubmit = (data: IFormInput) => {
        mutation.mutate(data);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Password</label>
                        <input
                            type="password"
                            {...register("password")}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:ring focus:ring-indigo-200"
                        disabled={mutation.isLoading}
                    >
                        {mutation.isLoading ? 'Submitting' : "Login"}
                    </button>
                </form>
                
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-indigo-500 hover:underline">
                            Register Now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
