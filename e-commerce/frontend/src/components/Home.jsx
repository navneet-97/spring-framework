import React from "react";
import getData from "../services/useContext.js";
import { Link, useLocation, useSearchParams } from "react-router-dom";

const Home = () => {
    const location = useLocation();
    const selectedCategory = location.state?.category;
    const [searchParams] = useSearchParams();
    const searchInput = searchParams.get("search") || "";

    const {
        products,
        loading,
        error,
        addToCart,
    } = getData();
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <h2 className="text-2xl font-semibold text-gray-700 animate-pulse">
                    Loading Products...
                </h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <h2 className="text-xl font-semibold text-red-600">
                    {error}
                </h2>
            </div>
        );
    }

    const categoryWiseProducts = selectedCategory ? products
        .filter(product => product.category === selectedCategory)
        : products;

    const filteredProducts = searchInput ? categoryWiseProducts
        .filter(p => p.name.toLowerCase().includes(searchInput.toLowerCase()))
        : categoryWiseProducts;

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-10">
            <div className="max-w-7xl mx-auto">

                {filteredProducts.length === 0 ? (
                    <div className="flex items-center justify-center h-[50vh]">
                        <h2 className="text-2xl font-semibold text-gray-500">
                            {selectedCategory ? `No Products Available in ${selectedCategory} Category` : "No Products Available"}
                        </h2>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product) => {
                            const {
                                id,
                                brand,
                                name,
                                price,
                                available,
                                imageUrl,
                            } = product;

                            return (
                                <div
                                    key={id}
                                    className={`group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border ${!available
                                        ? "opacity-70"
                                        : ""
                                        }`}
                                >
                                    <Link
                                        to={`/product/${id}`}
                                        className="block"
                                    >
                                        <div className="overflow-hidden bg-gray-100 h-56">
                                            <img
                                                src={imageUrl}
                                                alt={name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>

                                        <div className="p-5 flex flex-col justify-between h-55">
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-800 line-clamp-2">
                                                    {name}
                                                </h2>

                                                <p className="text-sm text-gray-500 italic mt-1">
                                                    ~ {brand}
                                                </p>

                                                <div className="mt-4 flex items-center gap-1 text-2xl font-bold text-indigo-600">
                                                    <span>₹</span>
                                                    <span>{price}</span>
                                                </div>
                                            </div>

                                            <button
                                                className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all duration-300 ${available
                                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                                                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                                    }`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addToCart(product);
                                                }}
                                                disabled={!available}
                                            >
                                                {available
                                                    ? "Add to Cart"
                                                    : "Out of Stock"}
                                            </button>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
