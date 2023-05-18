import { useContext } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ROUTES from '@/constants/routes';
import AuthGuard from '@/pages/Guards/AuthGuard';
import SignInPage from '@/pages/SignInPage/SignInPage';
import { AuthContext } from './context/authContext';

function App() {
	const { dispatch } = useContext(AuthContext);
	return (
		<Routes>
			<Route
				path={ROUTES.AUTH}
				element={<AuthGuard authComponent={<Navigate to='/' />} unAuthComponent={<SignInPage />} />}
			/>
			<Route
				path={ROUTES.HOME}
				element={<AuthGuard authComponent={<Outlet />} unAuthComponent={<Navigate to='/auth' />} />}
			>
				<Route
					index
					element={
						<div>
							<button
								className='text-white'
								onClick={() => {
									dispatch({
										type: 'LOGOUT',
										payload: null,
									});
									localStorage.removeItem('user');
								}}
							>
								Log out
							</button>
						</div>
					}
				/>
				<Route path='*' element={<div>Not Found</div>} />
			</Route>
		</Routes>
	);
}

export default App;
