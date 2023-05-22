import Layout from '../Layout/Layout.component';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '@/context/authContext';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import clsx from 'clsx';
import DashboardPage from '@/pages/DashboardPage/DashboardPage';
import MobileSideBar from '../Sidebar/MobileSideBar.component';

const Navbar = () => {
	const { user, dispatch } = useContext(AuthContext);
	const [open, setOpen] = useState(false);

	return (
		<>
			<div>
				<Layout>
					<div className='flex py-3 justify-between items-center'>
						<div className='flex gap-3'>
							<button className='md:hidden' onClick={() => setOpen(true)}>
								<i className={clsx(PrimeIcons.BARS, 'text-white text-2xl')} />
							</button>
							<Link to='/' className='text-white font-bold text-2xl'>
								ProFile
							</Link>
						</div>
						<div className='flex gap-5 items-center'>
							<span className='text-white text-lg hidden md:inline'>
								{user?.role} - {user?.department} - {user?.username}
							</span>
							<Button
								className='text-white px-3 py-2 rounded-lg'
								onClick={() => {
									dispatch({
										type: 'LOGOUT',
										payload: null,
									});
									localStorage.removeItem('user');
								}}
							>
								<span className='hidden md:inline'>Sign out</span>
								<i className={clsx(PrimeIcons.SIGN_OUT, 'text-white md:hidden')} />
							</Button>
						</div>
					</div>
				</Layout>
			</div>
			<Layout>
				<DashboardPage />
			</Layout>
			<MobileSideBar open={open} setOpen={setOpen} />
		</>
	);
};

export default Navbar;
