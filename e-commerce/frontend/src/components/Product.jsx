import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import getData from "../services/useContext";

const Product = () => {
    const { id } = useParams();

    const {
        API,
        addToCart,
        removeFromCart,
        fetchProducts,
    } = getData();

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await API.get(`/product/${id}`);

                let imageUrl = "https://placehold.co/400x300?text=No+Image";

                try {
                    const imageResponse = await API.get(`/product/${response.data.id}/image`,
                        {
                            responseType: "blob",
                        }
                    );
                    imageUrl = URL.createObjectURL(imageResponse.data);
                } catch (error) {
                    console.log("Image Fetch Failed", error);
                }

                setProduct({ ...response.data, imageUrl });
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const deleteProduct = async () => {
        try {
            await API.delete(`/product/${id}`);
            removeFromCart(id);
            navigate("/");
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleEditClick = () => {
        navigate(`/product/update/${id}`);
    };

    const handleAddToCart = () => {
        addToCart(product);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 animate-pulse">
                    Loading Product...
                </h2>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h2 className="text-2xl font-semibold text-red-500">
                    Product Not Found
                </h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-4 transition-colors duration-300">
            <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

                {/* Product Image */}
                <div className="bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-8">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full max-w-lg h-125 object-cover rounded-2xl shadow-md"
                    />
                </div>

                {/* Product Details */}
                <div className="p-8 lg:p-12 flex flex-col justify-between">

                    <div>

                        {/* Top Info */}
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
                                {product.category}
                            </span>

                            <div className="text-right text-sm text-gray-500">
                                <p className="font-semibold">Listed</p>
                                <p>
                                    {product.release_date}
                                </p>
                            </div>
                        </div>

                        {/* Product Name */}
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white capitalize leading-tight">
                            {product.name}
                        </h1>

                        {/* Brand */}
                        <p className="mt-3 text-lg italic text-gray-500">
                            ~ {product.brand}
                        </p>

                        {/* Price */}
                        <div className="mt-8 flex items-center gap-2">
                            <span className="text-4xl font-bold text-indigo-600">
                                ₹{product.price}
                            </span>
                        </div>

                        {/* Description */}
                        <div className="mt-10">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                                Product Description
                            </h3>

                            <p className="text-gray-600 leading-7">
                                {product.description}
                            </p>
                        </div>

                        {/* Stock */}
                        <div className="mt-8">
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                                Stock Available:
                                <span className="ml-2 text-green-600 font-bold">
                                    {product.quantity}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-10 flex flex-wrap gap-4">

                        {/* Add To Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={!product.available}
                            className={`cursor-pointer px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${product.available
                                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            {product.available
                                ? "Add to Cart"
                                : "Out of Stock"}
                        </button>

                        {/* Update */}
                        <button
                            onClick={handleEditClick}
                            className="px-8 py-4 rounded-2xl font-semibold bg-yellow-500 hover:bg-yellow-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                        >
                            Update
                        </button>

                        {/* Delete */}
                        <button
                            onClick={deleteProduct}
                            className="px-8 py-4 rounded-2xl font-semibold bg-red-500 hover:bg-red-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
