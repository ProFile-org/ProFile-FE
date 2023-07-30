import { Routes, Route, Navigate } from 'react-router-dom';
import { AUTH_ROUTES, UNAUTH_ROUTES } from '@/constants/routes';
import AuthGuard from '@/pages/Guards/AuthGuard';
import SignInPage from '@/pages/SignInPage/SignInPage';
import Navbar from './components/Navbar/Navbar.component';
import RoleGuard from './pages/Guards/RoleGuard';
import ResetPage from './pages/CallbackPage/CallbackPage';
import ErrorTemplate from './components/ErrorTemplate/ErrorTemplate.component';

function App() {
	return (
		<Routes>
			<Route
				path={UNAUTH_ROUTES.AUTH}
				element={
					<AuthGuard
						authComponent={<Navigate to={AUTH_ROUTES.HOME} />}
						unAuthComponent={<SignInPage />}
					/>
				}
			/>
			<Route
				path={UNAUTH_ROUTES.CALLBACK}
				element={
					<AuthGuard
						authComponent={<Navigate to={AUTH_ROUTES.HOME} />}
						unAuthComponent={<ResetPage />}
					/>
				}
			/>
			<Route
				path={AUTH_ROUTES.HOME}
				element={
					<AuthGuard
						authComponent={<Navbar />}
						unAuthComponent={<Navigate to={UNAUTH_ROUTES.AUTH} />}
					/>
				}
			>
				{Object.entries(AUTH_ROUTES).map(([key, value]) => (
					<Route key={key} path={value} element={<RoleGuard route={value} />} />
				))}
				<Route
					path='*'
					element={
						<ErrorTemplate code={404} message='Page not found' btnText='Return home' url='/' />
					}
				/>
			</Route>
		</Routes>
	);
}

export default App;
