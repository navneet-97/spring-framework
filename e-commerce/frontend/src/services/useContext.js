import { useContext } from "react";
import { AppContext } from "../context/AppProvider";

const getData = () => {
    return useContext(AppContext);
};

export default getData;
