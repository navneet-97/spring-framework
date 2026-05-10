import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

const API = axios.create({
    baseURL: "http://localhost:8000/api",
});

export const AppProvider = ({ children }) => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    const [cart, setCart] = useState(
        JSON.parse(localStorage.getItem("cart-items")) || []
    );

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await API.get("/products");

            const updatedProducts = await Promise.all(
                response.data.map(async (product) => {
                    try {
                        const imageResponse = await API.get(
                            `/product/${product.id}/image`,
                            {
                                responseType: "blob",
                            }
                        );
                        const imageUrl = URL.createObjectURL(
                            imageResponse.data
                        );
                        return {
                            ...product,
                            imageUrl,
                        };
                    } catch {
                        return {
                            ...product,
                            imageUrl:
                                "https://placehold.co/400x300?text=No+Image",
                        };
                    }
                })
            );

            setProducts(updatedProducts);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [API]);

    useEffect(() => {
        localStorage.setItem("cart-items", JSON.stringify(cart));
    }, [cart]);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const addToCart = (product) => {
        const exists = cart.find(
            (item) => item.id === product.id
        );

        if (exists) {
            setCart(
                cart.map((item) =>
                    item.id === product.id
                        ? {
                            ...item,
                            cartQuantity:
                                item.cartQuantity + 1,
                        }
                        : item
                )
            );
        } else {
            setCart([
                ...cart,
                {
                    ...product,
                    cartQuantity: 1,
                },
            ]);
        }
        alert("Product added into cart!");
    };

    const removeFromCart = (id) => {
        setCart(
            cart.filter((item) => item.id !== id)
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <AppContext.Provider
            value={{
                products,
                loading,
                error,
                API,
                theme,
                fetchProducts,
                toggleTheme,
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                setCart
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
