// import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ROUTES from '@/constants/routes';
import AuthGuard from '@/pages/Guards/AuthGuard';
import SignInPage from '@/pages/SignInPage/SignInPage';
// import { AuthContext } from './context/authContext';
import Navbar from './components/Navbar/Navbar.component';

function App() {
	// const { dispatch } = useContext(AuthContext);
	return (
		<Routes>
			<Route
				path={ROUTES.AUTH}
				element={<AuthGuard authComponent={<Navigate to='/' />} unAuthComponent={<SignInPage />} />}
			/>
			<Route
				path={ROUTES.HOME}
				element={<AuthGuard authComponent={<Navbar />} unAuthComponent={<Navigate to='/auth' />} />}
			>
				<Route
					index
					element={
						<div>
							<h1 className='text-white font-bold text-4xl'>Home page</h1>
						</div>
					}
				/>
				<Route path='*' element={<div>Not Found</div>} />
			</Route>
		</Routes>
	);
}

export default App;
