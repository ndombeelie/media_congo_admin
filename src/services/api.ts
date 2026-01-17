const API_BASE_URL = 'http://localhost:8080/api';

export const apiService = {
    async fetchPosts() {
        try {
            const response = await fetch(`${API_BASE_URL}/posts.php`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Erreur réseau');
            return await response.json();
        } catch (error) {
            console.error('Fetch posts error:', error);
            return [];
        }
    },

    async createPost(postData: any) {
        try {
            const isFormData = postData instanceof FormData;
            const response = await fetch(`${API_BASE_URL}/posts.php`, {
                method: 'POST',
                headers: {
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: isFormData ? postData : JSON.stringify(postData),
            });
            if (!response.ok) throw new Error('Erreur création post');
            return await response.json();
        } catch (error) {
            console.error('Create post error:', error);
            throw error;
        }
    },

    async fetchStats(period: string = 'daily') {
        try {
            const response = await fetch(`${API_BASE_URL}/stats.php?period=${period}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Erreur stats');
            return await response.json();
        } catch (error) {
            console.error('Fetch stats error:', error);
            return null;
        }
    },

    async login(credentials: any) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erreur login');
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async fetchViews() {
        try {
            const response = await fetch(`${API_BASE_URL}/views.php`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Erreur views');
            return await response.json();
        } catch (error) {
            console.error('Fetch views error:', error);
            return [];
        }
    }
};
