import { IItem } from '@/types/item';
import clsx from 'clsx';
import { Dispatch, FC, SetStateAction } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface IMenuItemProps {
	item: IItem;
	setOpen?: Dispatch<SetStateAction<number>>;
	index: number;
}

const MenuItem: FC<IMenuItemProps> = ({ item }) => {
	const location = useLocation();

	const { label, items, type = 'item', path = '', icon } = item;
	const open = path === '/' ? location.pathname === path : path && location.pathname.includes(path);

	if (type === 'item')
		return (
			<div className='flex flex-col gap-5'>
				<Link
					className={clsx(
						'text-white text-lg px-3 py-2 bg-neutral-800 rounded-lg cursor-pointer hover:opacity-80 flex items-center whitespace-nowrap',
						open && 'bg-primary'
					)}
					to={path}
				>
					{icon && <i className={clsx(icon, 'mr-3 ml-1')} />}
					{label}
				</Link>
				{open && items && (
					<ul className={'flex flex-col gap-3 pl-5 transition-all duration-300'}>
						{items?.map(({ label, path, icon }) => (
							<li key={label}>
								<Link
									to={path || ''}
									className={clsx(
										'bg-neutral-800 px-3 py-2 rounded-lg relative before:absolute before:h-full before:w-1 before:bg-primary before:top-0 before:-left-3 text-white w-full text-left hover:bg-opacity-80 flex items-center',
										path && location.pathname.includes(path) && 'bg-primary'
									)}
								>
									{icon && <i className={clsx(icon, 'mr-3 ml-1')} />}
									{label}
								</Link>
							</li>
						))}
					</ul>
				)}
			</div>
		);
	return <div className='bg-transparent font-bold text-lg text-white'>{label}</div>;
};

export default MenuItem;
