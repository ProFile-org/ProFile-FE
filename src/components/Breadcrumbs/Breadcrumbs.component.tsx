import { AUTH_ROUTES } from '@/constants/routes';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({
	path,
	pathArr,
	shared = false,
}: {
	path: string;
	pathArr: string[];
	shared?: boolean;
}) => {
	return (
		<div className='flex gap-2'>
			{shared && (
				<>
					<span>/</span>
					<Link to={AUTH_ROUTES.DRIVE_SHARED}>Home</Link>
				</>
			)}
			{path === '/' ? (
				<>
					<span>/</span>
					<span>Home</span>
				</>
			) : (
				pathArr.map((item, index) => {
					const link = item ? pathArr.slice(0, index + 1).join('/') : '/';
					return (
						<Fragment key={link}>
							{!shared || link !== '/' ? <span>/</span> : null}
							{index === pathArr.length - 1 ? (
								<span>{item}</span>
							) : (
								<Link
									to={`${
										shared ? AUTH_ROUTES.DRIVE_SHARED : AUTH_ROUTES.DRIVE
									}?path=${encodeURIComponent(link)}`}
								>
									{item || 'Home'}
								</Link>
							)}
						</Fragment>
					);
				})
			)}
		</div>
	);
};

export default Breadcrumbs;
