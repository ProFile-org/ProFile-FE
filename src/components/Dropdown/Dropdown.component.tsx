import clsx from 'clsx';
import style from './Dropdown.module.scss';

import { FC } from 'react';
import { Dropdown, DropdownProps } from 'primereact/dropdown';

interface IDropdownProps extends DropdownProps {
	label?: string;
	error?: boolean;
	small?: string;
}

const CustomDropdown: FC<IDropdownProps> = ({ label, className, error, small, id, ...rest }) => {
	return (
		<div className='flex flex-col gap-3'>
			{label && (
				<label className='header' htmlFor={id}>
					{label}
				</label>
			)}
			<Dropdown
				id={id}
				className={clsx(
					'bg-neutral-800 rounded-lg items-center text-white h-11',
					style['dropdown'],
					error && 'p-invalid',
					className
				)}
				{...rest}
			/>
			{error && <small className={clsx('error-input')}>{small}</small>}
		</div>
	);
};

export default CustomDropdown;
