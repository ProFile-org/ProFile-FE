import Sidebar from '@/components/Sidebar/Sidebar.component';
import Spinner from '@/components/Spinner/Spinner.component';
import { Suspense } from 'react';
import { Outlet } from 'react-router';

const DashboardPage = () => {
	return (
		<div className='flex mt-5 gap-5 sm:gap-8 pb-3 sm:pb-5'>
			<Sidebar />
			<div className='flex-1 sm:basis-10/12 text-white overflow-hidden'>
				<Suspense
					fallback={
						<div className='flex items-center justify-center h-full'>
							<Spinner size='5rem' borderTopColor='border-t-primary' />
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
