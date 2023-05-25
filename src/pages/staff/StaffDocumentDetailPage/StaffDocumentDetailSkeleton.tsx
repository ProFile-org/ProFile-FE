import InformationPanel from '@/components/InformationPanel/InformationPanel.component';
import Skeleton from '@/components/Skeleton/Skeleton.component';

const StaffDocumentDetailSkeleton = () => {
	return (
		<div className='flex flex-col gap-5'>
			<div className='card'>
				<h2 className='title flex gap-2'>
					<Skeleton className='w-1/2' />
				</h2>
			</div>
			<div className='flex gap-5 md:flex-row flex-col'>
				<div className='flex flex-col gap-5 flex-1'>
					<InformationPanel header='Employee information'>
						<div className='flex gap-3'>
							<Skeleton />
							<Skeleton className='w-1/4' />
						</div>
						<Skeleton />
						<Skeleton />
					</InformationPanel>
					<InformationPanel header='Document information'>
						<Skeleton />
						<Skeleton />
						<Skeleton />
						<div className='flex gap-5'>
							<Skeleton />
							<Skeleton />
						</div>
					</InformationPanel>
				</div>
				<div className='flex flex-col gap-5'>
					<InformationPanel direction='row'>
						<div className='w-48 aspect-square bg-neutral-600 animate-pulse rounded-lg' />
						<div className='flex flex-col justify-between flex-1 w-40'>
							<Skeleton />
							<Skeleton />
							<Skeleton />
						</div>
					</InformationPanel>
				</div>
			</div>
		</div>
	);
};

export default StaffDocumentDetailSkeleton;
