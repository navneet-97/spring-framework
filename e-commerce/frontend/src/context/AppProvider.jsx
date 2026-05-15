import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

const API = axios.create({
    baseURL: "http://localhost:8000/api",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwt-token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
})

export const AppProvider = ({ children }) => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );
    const [token, setToken] = useState(
        localStorage.getItem("jwt-token") || ""
    );
    const [user, setUser] = useState(null);

    const [cart, setCart] = useState(
        JSON.parse(localStorage.getItem("cart-items")) || []
    );

    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (!token) {
                setUser(null);
                return;
            }
            try {
                const res = await API.get("/auth/me");
                setUser(res.data);
            } catch (error) {
                console.log(error);
                localStorage.removeItem("jwt-token");
                setToken("");
                setUser(null);
            }
        }
        fetchCurrentUser();
    }, [token]);

    const logout = () => {
        localStorage.removeItem("jwt-token");
        setToken("");
        setUser(null);
    }

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
    }, []);

    useEffect(() => {
        localStorage.setItem("cart-items", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) =>
            prev === "light" ? "dark" : "light"
        );
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
                            cartQuantity: item.cartQuantity < item.quantity
                                ? item.cartQuantity + 1
                                : item.cartQuantity
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
                user,
                products,
                loading,
                error,
                API,
                theme,
                fetchProducts,
                toggleTheme,
                cart,
                addToCart,
                logout,
                removeFromCart,
                clearCart,
                setCart,
                setToken
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
