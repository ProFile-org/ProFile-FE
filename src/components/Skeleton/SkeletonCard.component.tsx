const SkeletonCard = () => {
	return (
		<div className='card flex-1 h-40 animate-pulse p-5 flex flex-col gap-5'>
			<div className='w-1/2 h-5 rounded-lg animate-pulse bg-neutral-700'></div>
			<div className='w-full h-5 rounded-lg animate-pulse bg-neutral-700'></div>
			<div className='w-full h-5 rounded-lg animate-pulse bg-neutral-700'></div>
		</div>
	);
};

export default SkeletonCard;
