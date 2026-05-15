import React from 'react'
import { Navigate } from 'react-router-dom';
import getData from '../services/useContext';
const ProtectedRoute = ({ children }) => {
    const { user } = getData();
    if (!user) {
        return <Navigate to="/login" />
    }

    return children;
}

export default ProtectedRoute
