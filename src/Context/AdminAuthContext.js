// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { onAuthStateChanged } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';
// import { auth, fireStore } from '../Config/firebase';

// const AdminAuthContext = createContext({
//     isAdmin: false,
//     adminUser: null,
//     isLoading: true
// });

// export const AdminAuthProvider = ({ children }) => {
//     const [adminState, setAdminState] = useState({
//         isAdmin: false,
//         adminUser: null,
//         isLoading: true
//     });

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, async (user) => {
//             if (user) {
//                 const docSnap = await getDoc(doc(fireStore, "users", user.uid));
//                 if (docSnap.exists()) {
//                     const userData = docSnap.data();
//                     if (userData.role === "admin") {
//                         setAdminState({ isAdmin: true, adminUser: userData, isLoading: false });
//                     } else {
//                         setAdminState({ isAdmin: false, adminUser: null, isLoading: false });
//                     }
//                 }
//             } else {
//                 setAdminState({ isAdmin: false, adminUser: null, isLoading: false });
//             }
//         });

//         return () => unsubscribe();
//     }, []);

//     return (
//         <AdminAuthContext.Provider value={adminState}>
//             {children}
//         </AdminAuthContext.Provider>
//     );
// };

// export const useAdminAuth = () => useContext(AdminAuthContext);



import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, fireStore } from '../Config/firebase';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const AdminAuthContext = createContext({
    isAdmin: false,
    adminUser: null,
    isLoading: true,
    handleLogout: () => {}
});

export const AdminAuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [adminState, setAdminState] = useState({
        isAdmin: false,
        adminUser: null,
        isLoading: true
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docSnap = await getDoc(doc(fireStore, "users", user.uid));
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    if (userData.role === "admin") {
                        setAdminState({ isAdmin: true, adminUser: userData, isLoading: false });
                    } else {
                        setAdminState({ isAdmin: false, adminUser: null, isLoading: false });
                    }
                }
            } else {
                setAdminState({ isAdmin: false, adminUser: null, isLoading: false });
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setAdminState({ isAdmin: false, adminUser: null, isLoading: false });
                message.success('Logout successful');
                navigate("/auth/login");
            })
            .catch(() => {
                message.error('Something went wrong while logging out');
            });
    };

    return (
        <AdminAuthContext.Provider value={{ ...adminState, handleLogout }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);