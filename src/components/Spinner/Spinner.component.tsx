import { FC } from 'react';
import style from './spinner.module.scss';
import clsx from 'clsx';

interface ISpinnerProps {
	size?: string;
}

const Spinner: FC<ISpinnerProps> = ({ size = '5rem' }) => {
	const borderSize = size.includes('px')
		? +size.replace('px', '') * 0.1
		: +size.replace(/r?em/, '') * 16 * 0.1;
	return (
		<div
			className={clsx('rounded-full border-solid border-neutral-100 border-t-black', style.spinner)}
			style={{
				width: size,
				height: size,
				borderWidth: borderSize,
			}}
		/>
	);
};

export default Spinner;
