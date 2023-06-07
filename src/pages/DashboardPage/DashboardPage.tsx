import Sidebar from '@/components/Sidebar/Sidebar.component';
import Spinner from '@/components/Spinner/Spinner.component';
import { Suspense } from 'react';
import { Outlet } from 'react-router';

const DashboardPage = () => {
	return (
		<div className='flex mt-5 gap-5 sm:gap-8 pb-3 sm:pb-5'>
			<Sidebar />
			<div className='flex-1 sm:basis-10/12 text-white lg:max-w-[83.333333%] w-full'>
				<Suspense
					fallback={
						<div className='flex items-center justify-center lg:h-full fixed w-screen lg:w-full right-0 top-0 h-screen lg:static'>
							<Spinner size='4rem' borderTopColor='border-t-primary' />
						</div>
					}
				>
					<Outlet />
				</Suspense>
			</div>
		</div>
	);
};

export default DashboardPage;
