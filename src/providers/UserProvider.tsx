import React, { useState, useEffect, ReactNode } from 'react';
import { getCookie, removeCookie } from "@/utils/cookieUtils";
import { getProfile } from '@/services/authService';
import { UserContext } from '@/contexts/UserContext';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    dob: string;
    gender: 'm' | 'f' | 'o';
    role: 'super_admin' | 'artist_manager' | 'artist';
    address: string;
}
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        removeCookie("authToken");
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = getCookie("authToken");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await getProfile();
                if (response.status === 200) {
                    const userData = await response.data.user;
                    setUser(userData);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <UserContext.Provider value={{ user, isAuthenticated, loading, setUser, setIsAuthenticated, logout }}>
            {children}
        </UserContext.Provider>
    );
};