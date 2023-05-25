import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

const Skeleton: FC<HTMLAttributes<HTMLDivElement>> = ({ className }) => {
	return <div className={clsx('skeleton', className)}></div>;
};

export default Skeleton;
