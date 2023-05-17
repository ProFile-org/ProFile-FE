import { InputHTMLAttributes, FC } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import clsx from 'clsx';

import style from './InputWithLabel.module.scss';

interface IInputWithLabelProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	small?: string;
	value?: string;
	error?: boolean;
}

const InputWithLabel: FC<IInputWithLabelProps> = ({
	label,
	id,
	small,
	error = false,
	className,
	type,
	...rest
}) => {
	return (
		<div className={clsx('input-with-label-wrapper flex flex-col gap-3 text-white')}>
			<label className='text-xl font-bold' htmlFor={id}>
				{label}
			</label>
			{type === 'password' ? (
				<Password
					inputClassName={clsx(
						className,
						error && 'p-invalid',
						'w-full bg-transparent !border-2 transition-shadow text-white disabled:bg-neutral-800 border-primary hover:!border-primary hover:!border-opacity-80 rounded-lg',
						style['input']
					)}
					feedback={false}
					toggleMask
					id={id}
					{...rest}
				/>
			) : (
				<InputText
					id={id}
					className={clsx(
						className,
						error && 'p-invalid',
						'bg-transparent !border-2 transition-shadow text-white disabled:bg-neutral-800 border-primary hover:!border-primary hover:!border-opacity-80 rounded-lg',
						style['input']
					)}
					{...rest}
				/>
			)}
			{small && <small className={clsx(error && 'text-red-500 text-sm')}>{small}</small>}
		</div>
	);
};

export default InputWithLabel;
