import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const AppContext = createContext();

const API = axios.create({
    baseURL: "http://localhost:8000/api",
});

export const AppProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);
                const res = await API.get("/products");
                setProducts(res.data);
                setError("");
            } catch (error) {
                setError(error.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        }
        getProducts();
    }, [API]);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    }

    return (
        <AppContext.Provider value={{ products, loading, error, API, theme, toggleTheme }}>
            {children}
        </AppContext.Provider>
    )
}
