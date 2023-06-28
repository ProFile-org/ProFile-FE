import ImportDocumentContainer from '@/containers/ImportDocumentContainer/ImportDocumentContainer';

const StaffImportCreatePage = () => {
	return (
		<div className='flex flex-col gap-5'>
			<div className='card py-3'>
				<h2 className='title'>Importing documents</h2>
			</div>
			<ImportDocumentContainer />
		</div>
	);
};

export default StaffImportCreatePage;
