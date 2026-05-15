import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getData from "../services/useContext";

const Login = () => {
    const navigate = useNavigate();
    const { API, setToken } = getData();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await API.post(
                "/auth/login",
                formData
            );

            localStorage.setItem(
                "jwt-token",
                response.data.token
            );
            setToken(response.data.token);
            navigate("/");

        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.message ||
                "Login Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center px-4 transition-colors duration-300">

            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                        Welcome Back
                    </h1>

                    <p className="text-gray-500 dark:text-gray-400 mt-3">
                        Login to continue shopping
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 ${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                    >
                        {loading ? "Logging In..." : "Login"}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
                    Don't have an account? {" "}

                    <Link
                        to="/signup"
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                        Signup
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
