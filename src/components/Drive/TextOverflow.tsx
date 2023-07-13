import { Tooltip } from 'primereact/tooltip';

const TextOverflow = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			className='text-overflow-target text-right text-ellipsis overflow-hidden col-span-1'
			data-pr-position='top'
			data-pr-at='center top-8'
			data-pr-tooltip={children?.toString()}
		>
			{children}
			<Tooltip target='.text-overflow-target' />
		</div>
	);
};

export default TextOverflow;
