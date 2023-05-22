import { FC } from 'react';
import { ProgressBar, ProgressBarProps } from 'primereact/progressbar';
import clsx from 'clsx';

interface IProcessProps extends ProgressBarProps {
	label?: string;
	current?: number;
	max?: number;
	wrapperClassName?: string;
	showPercentage?: boolean;
}

const Progress: FC<IProcessProps> = ({
	label,
	className,
	current = 0,
	max = 0,
	value: _,
	wrapperClassName,
	showValue = false,
	showPercentage = false,
	...rest
}) => {
	return (
		<div className={clsx('flex flex-col gap-3', wrapperClassName)}>
			{label && <label className='header'>{label}</label>}
			<ProgressBar
				showValue={showValue}
				className={clsx(className, 'h-2 rounded-lg')}
				{...rest}
				value={(current / max) * 100}
			/>
			{max !== 0 && showPercentage && (
				<small className='text-right text-sm'>
					{current} / {max} ({((current / max) * 100).toFixed(2)}%)
				</small>
			)}
		</div>
	);
};

export default Progress;
