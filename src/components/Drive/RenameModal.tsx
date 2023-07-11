import { Button } from 'primereact/button';
import InputWithLabel from '../InputWithLabel/InputWithLabel.component';
import { FormEvent } from 'react';

const RenameModal = ({
	onRename,
	setModal,
}: {
	onRename: (e: FormEvent<HTMLFormElement>) => void;
	setModal: (value: string) => void;
}) => {
	return (
		<form
			className='bg-neutral-800 rounded-lg p-5 w-[50vw]'
			onSubmit={onRename}
			onClick={(e) => e.stopPropagation()}
		>
			<h2 className='title'>Renaming</h2>
			<InputWithLabel wrapperClassName='mt-5' label='New name' id='newName' name='newName' />
			<div className='flex justify-end mt-5'>
				<Button
					label='Cancel'
					className='h-11 rounded-lg mr-3 btn-outlined !border-red-600'
					onClick={() => setModal('')}
					severity='danger'
					outlined
				/>
				<Button label='Create' className='h-11 rounded-lg' />
			</div>
		</form>
	);
};

export default RenameModal;
