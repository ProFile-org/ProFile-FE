import { createContext, FC, useReducer } from 'react';

interface IUser {
	id: string;
	username: string;
	email: string;
	role: string;
	department: string;
	roomId?: string; // only exist if staff
}

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
