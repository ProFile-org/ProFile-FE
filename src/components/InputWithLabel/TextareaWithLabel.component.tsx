import clsx from 'clsx';
import { InputHTMLAttributes, FC } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';

interface ITextareWithLabelProps extends InputHTMLAttributes<HTMLTextAreaElement> {
	label: string;
	small?: string;
	value?: string;
	error?: boolean;
	wrapperClassName?: string;
}

const TextareaWithLabel: FC<ITextareWithLabelProps> = ({
	wrapperClassName,
	id,
	label,
	className,
	error,
	small,
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
				<InputTextarea
					className={clsx(
						className,
						'w-full bg-transparent border-2 border-primary hover:!border-primary/80',
						error && 'p-invalid'
					)}
					{...rest}
				/>
			</div>
			{error && <small className={clsx('error-input')}>{small}</small>}
		</div>
	);
};

export default TextareaWithLabel;
