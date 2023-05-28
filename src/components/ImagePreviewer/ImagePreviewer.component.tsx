import clsx from 'clsx';
import { PrimeIcons } from 'primereact/api';
import { Button } from 'primereact/button';
import { Dispatch, FC, SetStateAction, useState } from 'react';

interface IImagePreviewerProps {
	images?: string[];
	imagePerSlide?: number;
	setData?: Dispatch<SetStateAction<string[]>>;
	setFiles?: (index: number) => void;
	readOnly?: boolean;
}

const ImagePreviewer: FC<IImagePreviewerProps> = ({
	images = [],
	imagePerSlide = 1,
	setData,
	setFiles,
	readOnly = false,
}) => {
	const [current, setCurrent] = useState(0);
	return (
		<div className='flex flex-col gap-3'>
			<div className='flex flex-col gap-3 bg-neutral-700 border-primary border-2 rounded-lg'>
				{images.length === 0 ? (
					<p className='bg-neutral-700 p-3 rounded-lg text-center'>The list is empty</p>
				) : (
					<>
						{images.slice(current, current + imagePerSlide).map((image, index) => (
							<div
								key={index}
								className={clsx(
									'relative before:absolute before:opacity-0 before:transition-opacity duration-100 cursor-pointer before:w-full before:h-full before:top-0 before:right-0 before:bg-neutral-900/40 overflow-hidden rounded-lg hover:before:opacity-100 group',
									readOnly && 'cursor-default before:hidden'
								)}
								onClick={() => {
									if (readOnly) return;
									if (
										current + imagePerSlide === images.length &&
										imagePerSlide === 1 &&
										current !== 0
									) {
										setCurrent(current - imagePerSlide);
									}
									setData &&
										setData((prev) => {
											const index = prev.indexOf(image);
											return [...prev.slice(0, index), ...prev.slice(index + 1)];
										});
									setFiles && setFiles(index);
								}}
							>
								<div
									className={clsx(
										'absolute p-2 aspect-square group-hover:opacity-100 opacity-0 transition-opacity duration-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-lg flex items-center justify-items',
										readOnly && 'hidden'
									)}
								>
									<i className={clsx(PrimeIcons.TIMES)} />
								</div>
								<img src={image} alt='preview' className='w-full object-contain aspect-[3/4]' />
							</div>
						))}
					</>
				)}
			</div>
			<div className='flex gap-5 items-center justify-between'>
				<Button
					icon={PrimeIcons.CHEVRON_LEFT}
					className='h-11 rounded-lg'
					iconPos='left'
					onClick={() => {
						setCurrent(current - imagePerSlide);
					}}
					disabled={current === 0}
				/>
				<div>
					{imagePerSlide !== 1 && <span>{current + 1} - </span>}
					{current + imagePerSlide > images.length
						? images.length
						: current + imagePerSlide} of {images.length}
				</div>
				<Button
					icon={PrimeIcons.CHEVRON_RIGHT}
					className='h-11 rounded-lg'
					iconPos='right'
					onClick={() => {
						setCurrent(current + imagePerSlide);
					}}
					disabled={current >= images.length - imagePerSlide}
				/>
			</div>
		</div>
	);
};

export default ImagePreviewer;
