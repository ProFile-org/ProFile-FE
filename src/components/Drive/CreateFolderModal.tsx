import { Button } from 'primereact/button';
import InputWithLabel from '../InputWithLabel/InputWithLabel.component';
import { FormEvent } from 'react';

const CreateFolderModal = ({
	onCreateFolder,
	setModal,
}: {
	onCreateFolder: (e: FormEvent<HTMLFormElement>) => void;
	setModal: (value: string) => void;
}) => {
	return (
		<form
			className='bg-neutral-800 rounded-lg p-5 w-[50vw]'
			onSubmit={onCreateFolder}
			onClick={(e) => e.stopPropagation()}
		>
			<h2 className='title'>Creating folder</h2>
			<InputWithLabel
				wrapperClassName='mt-5'
				label='Folder name'
				id='folderName'
				name='folderName'
			/>
			<div className='flex justify-end'>
				<Button
					label='Cancel'
					className='mt-5 h-11 rounded-lg mr-3 btn-outlined !border-red-600'
					onClick={() => setModal('')}
					severity='danger'
					outlined
				/>
				<Button label='Create' className='mt-5 h-11 rounded-lg' />
			</div>
		</form>
	);
};

export default CreateFolderModal;
