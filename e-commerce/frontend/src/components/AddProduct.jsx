import React, { useState } from "react";
import getData from "../services/useContext";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const navigate=useNavigate();
    const { API, fetchProducts } = getData();
    const [product, setProduct] = useState({
        name: "",
        brand: "",
        description: "",
        price: "",
        category: "",
        quantity: "",
        release_date: "",
        available: false,
    });

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setProduct({
            ...product,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("imageFile", image);
            formData.append(
                "product",
                new Blob(
                    [JSON.stringify(product)],
                    { type: "application/json" }
                )
            );

            const response = await API.post(
                "/product",
                formData
            );

            alert("Product Added Successfully");
            setProduct({
                name: "",
                brand: "",
                description: "",
                price: "",
                category: "",
                quantity: "",
                release_date: "",
                available: false,
            });

            setImage(null);
            fetchProducts();
            navigate("/");
        } catch (error) {
            console.log(error);
            alert("Failed To Add Product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">

                {/* Header */}
                <div className="bg-indigo-600 px-8 py-6">
                    <h1 className="text-3xl font-bold text-white">
                        Add New Product
                    </h1>

                    <p className="text-indigo-100 mt-2">
                        Fill in product details below
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={submitHandler}
                    className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
                >

                    {/* Product Name */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">
                            Product Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleInputChange}
                            placeholder="Enter product name"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* Brand */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">
                            Brand
                        </label>

                        <input
                            type="text"
                            name="brand"
                            value={product.brand}
                            onChange={handleInputChange}
                            placeholder="Enter brand"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block mb-2 font-semibold text-gray-700">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleInputChange}
                            rows="5"
                            placeholder="Write product description..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            required
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">
                            Price
                        </label>

                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleInputChange}
                            placeholder="Enter price"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">
                            Category
                        </label>

                        <select
                            name="category"
                            value={product.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Headphone">Headphone</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Toys">Toys</option>
                            <option value="Fashion">Fashion</option>
                        </select>
                    </div>

                    {/* Stock Quantity */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">
                            Stock Quantity
                        </label>

                        <input
                            type="number"
                            name="quantity"
                            value={product.quantity}
                            onChange={handleInputChange}
                            placeholder="Available stock"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* Release Date */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">
                            Release Date
                        </label>

                        <input
                            type="date"
                            name="release_date"
                            value={product.release_date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="md:col-span-2">
                        <label className="block mb-2 font-semibold text-gray-700">
                            Product Image
                        </label>

                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="w-full border border-dashed border-gray-400 rounded-xl p-4 bg-gray-50 cursor-pointer"
                            required
                        />
                    </div>

                    {/* Product Available */}
                    <div className="md:col-span-2 flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="available"
                            checked={product.available}
                            onChange={handleInputChange}
                            className="w-5 h-5 accent-indigo-600"
                        />

                        <label className="font-medium text-gray-700">
                            Product Available
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl cursor-pointer"
                                }`}
                        >
                            {loading ? "Adding Product..." : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;