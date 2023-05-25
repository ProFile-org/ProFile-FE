import clsx from 'clsx';
import { FC, HTMLAttributes } from 'react';

interface IOverlayProps extends HTMLAttributes<HTMLDivElement> {
	onExit: () => void;
}

const Overlay: FC<IOverlayProps> = ({ children, className, onExit, onClick, ...rest }) => {
	return (
		<div
			className={clsx(className, 'fixed top-0 left-0 w-screen h-screen bg-black/40')}
			onClick={(e) => {
				onExit();
				onClick?.(e);
			}}
			{...rest}
		>
			{children}
		</div>
	);
};

export default Overlay;
