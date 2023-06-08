import { FC } from 'react';
import clsx from 'clsx';
import { InputNumber, InputNumberProps } from 'primereact/inputnumber';
import style from './InputWithLabel.module.scss';

interface IInputNumberWithLabelProps extends InputNumberProps {
	label: string;
	small?: string;
	error?: boolean;
	value?: number;
	wrapperClassName?: string;
	sideComponent?: JSX.Element;
}

const InputNumberWithLabel: FC<IInputNumberWithLabelProps> = ({
	label,
	id,
	small,
	error = false,
	className,
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
				<InputNumber
					id={id}
					className={clsx(className, error && 'p-invalid', 'w-full h-11 flex-1', style['input'])}
					{...rest}
				/>
				{sideComponent}
			</div>
			{error && <small className={clsx('error-input')}>{small}</small>}
		</div>
	);
};

export default InputNumberWithLabel;
