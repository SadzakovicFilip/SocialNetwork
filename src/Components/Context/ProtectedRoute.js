import React from 'react'
import { useContext  } from "react";

import { Navigate } from 'react-router-dom';

import { AuthContext } from './AuthContext';

function ProtectedRoute({children}) {
    const {currentUser}=useContext(AuthContext)
    
    return currentUser? children : <Navigate to="/"/>

}

export default ProtectedRoute