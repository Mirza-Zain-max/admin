// import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { message } from 'antd';
// import { doc, getDoc } from 'firebase/firestore';
// import ScreenLoader from '../Pages/ScreenLoader/ScreenLoader';
// import { auth, fireStore } from '../Config/firebase';
// import { useNavigate } from 'react-router-dom';

// const AuthContext = createContext({
//     isAuth: false,
//     user: null,
//     isAppLoading: true,
//     dispatch: () => { },
//     handleLogout: () => {
//         message.error("Logout Failed");
//         localStorage.clear()
//     },
// });

// const AuthProvider = ({ children }) => {
//     const navigate = useNavigate();
//     const [state, setState] = useState({ isAuth: false, user: null });
//     const [isAppLoading, setIsAppLoading] = useState(true);
//     const userRole = localStorage.getItem("user-role");
//     const readProfile = useCallback(async (user) => {
//         try {
//             const docSnap = await getDoc(doc(fireStore, "users", user.uid));
//             if (docSnap.exists()) {
//                 const userData = docSnap.data();
//                 console.log('Firestore user:', userData); // Log userData to verify role

//                 // Check if the role property exists and is set to "admin"
//                 const isAdmin = userData.role === "admin";
//                 console.log('User role:', userData.role);
//                 console.log('Is Admin:', isAdmin);

//                 setState({
//                     isAuth: true,
//                     user: { ...userData, isAdmin } // Ensure admin role is set
//                 });
//             }
//         } catch (error) {
//             console.error("Error fetching user profile:", error);
//         }
//     }, []);

//     useEffect(() => {
//         const unsubscribe = onAuthStateChanged(auth, async (user) => {
//             if (user) {
//                 console.log('User logged in:', user);
//                 await readProfile(user);
//             } else {
//                 if (userRole === 'admin') {
//                     setState({
//                         isAuth: true,
//                         user: { isAdmin: true }
//                     });
//                 } else {
//                     setState({ isAuth: false, user: null });
//                 }

//             }
//             setIsAppLoading(false);
//         });

//         return () => unsubscribe();
//     }, [readProfile]);

//     const handleLogout = () => {
//         setState({ isAuth: false, user: null });
//         signOut(auth)
//             .then(() => {
//                 message.success('Logout successful');
//                 navigate("/auth/register");
//                 localStorage.clear()
//             })
//             .catch(() => {
//                 message.error('Something went wrong while logging out');
//             });
//     };

//     return (
//         <AuthContext.Provider value={{ ...state, isAppLoading, handleLogout }}>
//             {isAppLoading ? <ScreenLoader /> : children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuthContext = () => useContext(AuthContext);

// export default AuthProvider;


import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { message } from 'antd';
import { doc, getDoc } from 'firebase/firestore';
import ScreenLoader from '../Pages/ScreenLoader/ScreenLoader';
import { auth, fireStore } from '../Config/firebase';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({
    isAuth: false,
    user: null,
    isAppLoading: true,
    dispatch: () => {},
    handleLogout: () => {
        message.error("Logout Failed");
        localStorage.clear();
    },
});

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [state, setState] = useState({ isAuth: false, user: null });
    const [isAppLoading, setIsAppLoading] = useState(true);
    const userRole = localStorage.getItem("user-role");
    const storedUid = localStorage.getItem("user-uid");

    const readProfile = useCallback(async (user) => {
        try {
            const docSnap = await getDoc(doc(fireStore, "users", user.uid));
            if (docSnap.exists()) {
                const userData = docSnap.data();
                const isAdmin = userData.role === "admin";

                setState({
                    isAuth: true,
                    user: { ...userData, uid: user.uid, isAdmin },
                });
            } else {
                // If no user doc exists, fallback to minimal user
                setState({
                    isAuth: true,
                    user: { uid: user.uid, email: user.email, isAdmin: false },
                });
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log('User logged in via Firebase:', user);
                await readProfile(user);
            } else {
                // Handle local admin login
                if (userRole === 'admin' && storedUid === 'admin-uid') {
                    console.log('Admin logged in locally.');
                    setState({
                        isAuth: true,
                        user: {
                            uid: 'admin-uid',
                            email: 'zain2@gmail.com',
                            isAdmin: true,
                        },
                    });
                } else {
                    setState({ isAuth: false, user: null });
                }
            }
            setIsAppLoading(false);
        });

        return () => unsubscribe();
    }, [readProfile, userRole, storedUid]);

    const handleLogout = () => {
        setState({ isAuth: false, user: null });
        signOut(auth)
            .then(() => {
                message.success('Logout successful');
                navigate("/auth/register");
                localStorage.clear();
            })
            .catch(() => {
                message.error('Something went wrong while logging out');
            });
    };

    return (
        <AuthContext.Provider value={{ ...state, isAppLoading, handleLogout }}>
            {isAppLoading ? <ScreenLoader /> : children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
export default AuthProvider;
