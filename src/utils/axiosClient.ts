import axios from 'axios';

const axiosClient = axios.create({
	baseURL: import.meta.env.VITE_API_ENDPOINT,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

let isRefreshing = false;

function refresh() {
	if (isRefreshing) return Promise.resolve();
	isRefreshing = true;
	return axiosClient
		.post('/auth/refresh')
		.then(() => {
			isRefreshing = false;
		})
		.catch(() => {
			isRefreshing = false;
			localStorage.removeItem('user');
		});
}

axiosClient.interceptors.response.use(undefined, (error) => {
	// Not sign in, just reject
	const user = localStorage.getItem('user');
	if (!user) return Promise.reject(error);

	// Ignore logout
	if (error?.response?.status === 401 && error?.config?.url === '/auth/logout') {
		return Promise.reject(error);
	}

	// Refresh token
	const originalRequest = error.config;

	if (error?.response?.status === 401 && !originalRequest._retry) {
		originalRequest._retry = true;
		return refresh().then(() => {
			return axiosClient(originalRequest);
		});
	}
});

export default axiosClient;
