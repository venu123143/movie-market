import { useState, useCallback } from 'react';
import { getRequestToken, createSession, deleteSession } from '@/services/api';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('tmdb_session_id');
    });

    const startAuth = useCallback(async () => {
        try {
            const { request_token } = await getRequestToken();
            // Store request token temporarily
            localStorage.setItem('tmdb_request_token', request_token);
            
            // Redirect to TMDB auth page
            window.location.href = `https://www.themoviedb.org/authenticate/${request_token}?redirect_to=${encodeURIComponent(window.location.origin)}`;
        } catch (error) {
            console.error('Failed to get request token:', error);
            throw error;
        }
    }, []);

    const completeAuth = useCallback(async () => {
        const requestToken = localStorage.getItem('tmdb_request_token');
        if (!requestToken) return;

        try {
            const { session_id } = await createSession(requestToken);
            localStorage.setItem('tmdb_session_id', session_id);
            localStorage.removeItem('tmdb_request_token');
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Failed to create session:', error);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await deleteSession();
            localStorage.removeItem('tmdb_session_id');
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Failed to logout:', error);
            // Still clear local state even if API call fails
            localStorage.removeItem('tmdb_session_id');
            setIsAuthenticated(false);
        }
    }, []);

    return {
        isAuthenticated,
        startAuth,
        completeAuth,
        logout
    };
}; 