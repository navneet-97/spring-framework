import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import getData from "../services/useContext";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    const { theme, toggleTheme } = getData();

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    }

    useEffect(() => {
        setCategoryOpen(false);
    }, [location.pathname]);

    const categories = [
        "Laptop",
        "Headphone",
        "Mobile",
        "Electronics",
        "Toys",
        "Fashion",
    ];

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b dark:border-gray-800 transition-colors duration-300">
            <nav className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-wide"
                    >
                        E-Commerce
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-8">

                        {/* Nav Links */}
                        <ul className="flex items-center gap-6 text-gray-700 dark:text-gray-200 font-medium">
                            <li>
                                <NavLink
                                    to="/"
                                    className={({ isActive }) => `${!isActive ? "hover:text-indigo-500" : "hover:text-yellow-400"} transition ${isActive ? "text-yellow-200" : ""}`}
                                >
                                    Home
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/add_product"
                                    className={({ isActive }) => `${!isActive ? "hover:text-indigo-500" : "hover:text-yellow-400"} transition ${isActive ? "text-yellow-200" : ""}`}
                                >
                                    Add Product
                                </NavLink>
                            </li>

                            {/* Categories Dropdown */}
                            <li className="relative">
                                <button
                                    onClick={() => setCategoryOpen(!categoryOpen)}
                                    className="hover:text-indigo-600 transition cursor-pointer"
                                >
                                    Categories
                                </button>

                                {categoryOpen && (
                                    <ul className="absolute top-10 left-0 w-52 bg-white dark:bg-gray-900 rounded-xl shadow-lg border py-2">
                                        {categories.map((category) => (
                                            <li key={category}>
                                                <Link
                                                    to="/"
                                                    state={{ category }}
                                                    className="block w-full px-4 py-2 hover:bg-gray-100 transition"
                                                    onClick={() => setCategoryOpen(false)}
                                                >
                                                    {category}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        </ul>

                        {/* Search */}
                        <div className="relative">
                            <input
                                type="search"
                                placeholder="Search products..."
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    navigate(`/?search=${e.target.value}`);
                                }}
                                className="w-72 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-900 transition cursor-pointer"
                        >
                            {theme === "dark" ? "☀️" : "🌙"}
                        </button>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        >
                            🛒 Cart
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
