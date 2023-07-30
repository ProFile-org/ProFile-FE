import Layout from '../Layout/Layout.component';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '@/context/authContext';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import clsx from 'clsx';
import DashboardPage from '@/pages/DashboardPage/DashboardPage';
import MobileSideBar from '../Sidebar/MobileSideBar.component';
import axiosClient from '@/utils/axiosClient';
import { useQueryClient } from 'react-query';
import Sidebar from '../Sidebar/Sidebar.component';

const Navbar = () => {
	const { user, dispatch } = useContext(AuthContext);
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const signOut = async () => {
		try {
			await axiosClient.post('/auth/logout');
		} catch (error) {
			console.log(error);
		} finally {
			dispatch({
				type: 'LOGOUT',
				payload: null,
			});
			localStorage.removeItem('user');
			queryClient.clear();
		}
	};

	return (
		<>
			<div className='sticky top-0 z-10 bg-[#121212] shadow-sm'>
				<Layout>
					<div className='flex py-3 justify-between items-center'>
						<div className='flex gap-3'>
							<button className='' onClick={() => setOpen((prev) => !prev)}>
								<i className={clsx(PrimeIcons.BARS, 'text-white text-2xl')} />
							</button>
							<Link to='/' className='text-white font-bold text-2xl'>
								ProFile
							</Link>
						</div>
						<div className='flex gap-5 items-center'>
							<span className='text-white text-lg'>{`${user?.role
								.slice(0, 1)
								.toUpperCase()}${user?.role.slice(1)}`}</span>
							<span className='text-white text-lg'>-</span>
							<span className='text-white text-lg'>{user?.firstName}</span>
							<Button className='text-white px-3 py-2 rounded-lg' onClick={signOut}>
								<span className='hidden lg:inline'>Sign out</span>
								<i className={clsx(PrimeIcons.SIGN_OUT, 'text-white lg:hidden')} />
							</Button>
						</div>
					</div>
				</Layout>
			</div>
			<Layout>
				<div className='flex mt-5 pb-3 sm:pb-5 max-w-full h-full'>
					<Sidebar open={open} />
					<DashboardPage open={open} />
				</div>
			</Layout>
			<MobileSideBar open={open} setOpen={setOpen} />
		</>
	);
};

export default Navbar;
