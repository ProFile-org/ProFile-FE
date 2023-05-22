import { AUTH_ROUTES } from '@/constants/routes';
import { Link } from 'react-router-dom';

const StaffDashboardPage = () => {
	return (
		<div className='flex flex-col gap-5'>
			<Link to={AUTH_ROUTES.REQUESTS} className='header'>
				Pending request &gt;
			</Link>
			<div className='flex gap-5'>
				<div className='card flex-1 h-40'></div>
				<div className='card flex-1 h-40'></div>
				<div className='card flex-1 h-40'></div>
			</div>
			<Link to={AUTH_ROUTES.LOCKERS} className='header'>
				Lockers &gt;
			</Link>
			<div className='flex gap-5'>
				{[...Array(3)].map((_, index) => (
					<div className='card flex-1 h-40' key={index}>
						Locker {index}
					</div>
				))}
			</div>
			<Link to={AUTH_ROUTES.FOLDERS} className='header'>
				Folders &gt;
			</Link>
			<div className='flex gap-5'>
				{[...Array(5)].map((_, index) => (
					<div className='card flex-1 h-40' key={index}>
						Folder {index}
					</div>
				))}
			</div>
			<Link to={AUTH_ROUTES.DOCUMENTS} className='header'>
				Documents &gt;
			</Link>
			<div className='flex gap-5 overflow-x-auto max-w-full'>
				{[...Array(10)].map((_, index) => (
					<div className='card flex-1 h-40' key={index}>
						Document {index}
					</div>
				))}
			</div>
		</div>
	);
};

export default StaffDashboardPage;
