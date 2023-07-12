import { AUTH_ROUTES } from '@/constants/routes';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({
	path,
	pathArr,
	shared = false,
	trashed = false,
}: {
	path: string;
	pathArr: string[];
	shared?: boolean;
	trashed?: boolean;
}) => {
	return (
		<div className='flex gap-2'>
			{shared && (
				<>
					<span>/</span>
					<Link to={AUTH_ROUTES.DRIVE_SHARED}>Shared</Link>
				</>
			)}
			{path === '/' ? (
				<>
					<span>/</span>
					<span>{trashed ? 'Trashed' : 'Home'}</span>
				</>
			) : (
				pathArr.map((item, index) => {
					const link = item ? pathArr.slice(0, index + 1).join('/') : '/';
					console.log(item);
					return (
						<Fragment key={link}>
							{!shared || link !== '/' ? <span>/</span> : null}
							{index === pathArr.length - 1 ? (
								<span>{item}</span>
							) : (
								<Link
									to={`${
										shared
											? AUTH_ROUTES.DRIVE_SHARED
											: trashed
											? AUTH_ROUTES.DRIVE_TRASH
											: AUTH_ROUTES.DRIVE
									}?path=${encodeURIComponent(link)}`}
								>
									{item || (trashed ? 'Trashed' : 'Home')}
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
