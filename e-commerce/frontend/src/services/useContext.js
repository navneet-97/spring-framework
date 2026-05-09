import { useContext } from "react";
import { AppContext } from "../context/AppProvider";

const getData = () => {
    const { products, loading, error, API,theme,toggleTheme } = useContext(AppContext);
    
    
    return { products, loading, error, API,theme,toggleTheme };
}

export default getData;
