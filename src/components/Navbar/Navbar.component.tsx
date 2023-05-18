import { Outlet } from 'react-router';
import Layout from '../Layout/Layout.component';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/context/authContext';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import clsx from 'clsx';

const Navbar = () => {
	const { user, dispatch } = useContext(AuthContext);
	return (
		<>
			<div>
				<Layout>
					<div className='flex py-3 justify-between items-center'>
						<Link to='/' className='text-white font-bold text-2xl'>
							ProFile
						</Link>
						<div className='flex gap-5 items-center'>
							<span className='text-white text-lg'>
								{user?.role} - {user?.department} - {user?.username}
							</span>
							<Button
								className='text-white px-3 py-2'
								onClick={() => {
									dispatch({
										type: 'LOGOUT',
										payload: null,
									});
									localStorage.removeItem('user');
								}}
							>
								<span className='hidden sm:inline'>Sign out</span>
								<i className={clsx(PrimeIcons.SIGN_OUT, 'text-white sm:hidden')} />
							</Button>
						</div>
					</div>
				</Layout>
			</div>
			<Layout>
				<Outlet />
			</Layout>
		</>
	);
};

export default Navbar;
