import { FC } from 'react';
import style from './Spinner.module.scss';
import clsx from 'clsx';

interface ISpinnerProps {
	size?: string;
	borderColor?: string;
	borderTopColor?: string;
}

const Spinner: FC<ISpinnerProps> = ({
	size = '5rem',
	borderColor = 'border-neutral-100',
	borderTopColor = 'border-t-black',
}) => {
	const borderSize = size.includes('px')
		? +size.replace('px', '') * 0.1
		: +size.replace(/r?em/, '') * 16 * 0.1;
	return (
		<div
			className={clsx('rounded-full border-solid', style.spinner, borderColor, borderTopColor)}
			style={{
				width: size,
				height: size,
				borderWidth: borderSize,
			}}
		/>
	);
};

export default Spinner;
