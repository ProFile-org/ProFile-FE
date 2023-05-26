import { IUser } from '@/types/item';
import axiosClient from '@/utils/axiosClient';
import { AxiosError } from 'axios';
import { createContext, FC, useReducer, useEffect } from 'react';

export const AuthContext = createContext<{
	user: IUser | null;
	dispatch: React.Dispatch<{ type: string; payload: IUser | null }>;
}>({
	user: null,
	dispatch: () => null,
});

interface IAuthProviderProps {
	children?: React.ReactNode;
}

const reducer = (state: IUser | null, action: { type: string; payload: IUser | null }) => {
	const { type, payload } = action;
	switch (type) {
		case 'LOGIN':
			return payload;
		case 'LOGOUT':
			return null;
		default:
			return state;
	}
};

const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
	const user = localStorage.getItem('user');
	const [state, dispatch] = useReducer(reducer, user ? JSON.parse(user) : null);

	useEffect(() => {
		if (!user) return;

		const validateUser = async () => {
			try {
				// Validate on page refresh
				await axiosClient.post('/auth/validate');
			} catch (error) {
				const axiosError = error as AxiosError;
				// 401 then refresh token
				if (axiosError.response?.status === 401) {
					try {
						// This should provide a new jwe and refresh token
						await axiosClient.post('/auth/refresh');
					} catch (error) {
						// Else refresh token has expired, log the user out
						dispatch({
							type: 'LOGOUT',
							payload: null,
						});
						localStorage.removeItem('user');
					}
				}
			}
		};

		validateUser();
	}, [user]);

	return (
		<AuthContext.Provider
			value={{
				user: state,
				dispatch,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
