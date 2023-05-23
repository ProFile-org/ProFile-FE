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
	wrapperClassName?: string;
	sideComponent?: JSX.Element;
}

const InputWithLabel: FC<IInputWithLabelProps> = ({
	label,
	id,
	small,
	error = false,
	className,
	type,
	wrapperClassName,
	sideComponent,
	...rest
}) => {
	return (
		<div
			className={clsx('input-with-label-wrapper flex flex-col gap-3 text-white', wrapperClassName)}
		>
			<label className='header' htmlFor={id}>
				{label}
			</label>
			<div className='flex gap-3'>
				{type === 'password' ? (
					<Password
						inputClassName={clsx(
							className,
							error && 'p-invalid',
							'input w-full h-11 flex-1',
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
							'input w-full h-11 flex-1',
							style['input']
						)}
						{...rest}
					/>
				)}
				{sideComponent}
			</div>
			{error && <small className={clsx('error-input')}>{small}</small>}
		</div>
	);
};

export default InputWithLabel;
