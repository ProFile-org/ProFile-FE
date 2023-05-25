import { AUTH_ROUTES } from '@/constants/routes';
import { Link } from 'react-router-dom';

const EmpDashboardPage = () => {
	return (
		<div className='flex flex-col gap-5'>
			<Link to={AUTH_ROUTES.DRIVE} className='header link-underlined'>
				MiniDrive &gt;
			</Link>
			<div className='flex gap-5'>
				{[...Array(3)].map((_, index) => (
					<div className='card flex-1 h-40' key={index}>
						File {index}
					</div>
				))}
			</div>
			<Link to={AUTH_ROUTES.REQUESTS} className='header link-underlined'>
				Pending request &gt;
			</Link>
			<div className='flex gap-5'>
				<div className='card flex-1 h-40'></div>
				<div className='card flex-1 h-40'></div>
				<div className='card flex-1 h-40'></div>
			</div>
		</div>
	);
};

export default EmpDashboardPage;
