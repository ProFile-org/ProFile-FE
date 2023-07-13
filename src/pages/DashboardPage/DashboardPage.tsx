import Spinner from '@/components/Spinner/Spinner.component';
import clsx from 'clsx';
import { Suspense } from 'react';
import { Outlet } from 'react-router';

const DashboardPage = ({ open = false }) => {
	return (
		<div
			className={clsx('flex-1 flex text-white max-w-full page-wrapper', open && 'lg:pl-[232px]')}
		>
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
	);
};

export default DashboardPage;
