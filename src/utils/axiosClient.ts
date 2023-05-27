import axios from 'axios';

const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_API_ENDPOINT,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

axiosClient.interceptors.response.use(
	(response) => response,
	(error) => {
		// Not sign in, just reject
		const user = localStorage.getItem('user');
		if (!user) return Promise.reject(error);

		// Ignore logout
		if (error?.response?.status === 401 && error?.config?.url === '/auth/logout') {
			return Promise.reject(error);
		}

		// Refresh token
		const originalRequest = error.config;

		return new Promise((resolve, reject) => {
			if (error?.response?.status === 401) {
				if (!originalRequest?.retry) {
					originalRequest.retry = true;
					axiosClient.post('/auth/refresh').then(() => {
						if (originalRequest.url === '/auth/validate') {
							console.log('This should only refresh once and does not call validate again');
							return resolve('');
						}
						// Call this again when not /auth/validate to refetch data
						// console.log(originalRequest);
						// return resolve(axiosClient(originalRequest)); // Not required when using React Query with retry
					});
				} else {
					// NEVER REACH WHEN USING WITH REACT QUERY
					// Already retry
					// localStorage.removeItem('user');
				}
			}
			// This means that the refresh token is expired or invalid
			if (error?.config.url === '/auth/refresh' && error?.response?.status === 400) {
				// console.log(error);
				localStorage.removeItem('user');
				location.reload();
				return;
			}
			reject(error);
		});
	}
);

export default axiosClient;
