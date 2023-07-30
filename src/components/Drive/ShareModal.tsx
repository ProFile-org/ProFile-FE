/* eslint-disable no-mixed-spaces-and-tabs */
import { Button } from 'primereact/button';
import { FormEvent, useState } from 'react';
import { IUser } from '@/types/item';
import Overlay from '../Overlay/Overlay.component';
import CustomDropdown from '../Dropdown/Dropdown.component';
import { PrimeIcons } from 'primereact/api';
import { InputSwitch } from 'primereact/inputswitch';
import InputWithLabel from '../InputWithLabel/InputWithLabel.component';

type UserWithPermission = { canView: boolean; canEdit: boolean; employee: IUser };

const ShareModal = ({
	onShare,
	handleClose,
	users,
	sharedUsers,
}: {
	onShare: (
		e: FormEvent<HTMLFormElement>,
		perms: { userId: string; canEdit: boolean; canView: boolean; expiryDate?: Date }
	) => void;
	handleClose: () => void;
	users: IUser[];
	sharedUsers: UserWithPermission[];
}) => {
	const [shareModal, setShareModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState<UserWithPermission | null>(null);
	const [selectedId, setSelectedId] = useState<string>('');
	const [edit, setEdit] = useState<boolean>(false);
	return (
		<>
			<form
				className='bg-neutral-800 rounded-lg p-5 w-[50vw]'
				onSubmit={(e) => e.preventDefault()}
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className='title'>Changing permission</h2>
				{sharedUsers.map((user) => (
					<div className='flex items-center mt-5' key={user.employee.id}>
						<div>{user.employee.email}</div>
						<div className='ml-auto'>
							<Button
								type='button'
								label='Change'
								className='h-11 rounded-lg bg-primary'
								onClick={() => {
									setShareModal(true);
									setSelectedUser(user);
									setSelectedId(user.employee.id);
									setEdit(true);
								}}
							/>
						</div>
					</div>
				))}
				<Button
					label='Add user'
					className='h-11 rounded-lg bg-primary w-full mt-5 btn-outlined items-center justify-center'
					onClick={() => {
						setShareModal(true);
						setEdit(false);
					}}
					outlined
					icon={PrimeIcons.PLUS}
					type='button'
				/>
				<div className='flex justify-end mt-5'>
					<Button
						type='button'
						label='Close'
						className='h-11 rounded-lg bg-primary'
						onClick={() => {
							handleClose();
							setShareModal(false);
							setSelectedUser(null);
							setSelectedId('');
							setEdit(false);
						}}
					/>
				</div>
			</form>
			{shareModal && (
				<Overlay
					onClick={(e) => e.stopPropagation()}
					onExit={() => {
						setShareModal(false);
						setSelectedUser(null);
						setSelectedId('');
						setEdit(false);
					}}
					className='flex items-center justify-center'
				>
					<form
						onSubmit={(e) =>
							onShare(e, {
								userId: selectedId,
								canEdit: selectedUser?.canEdit || false,
								canView: selectedUser?.canView || false,
							})
						}
						onClick={(e) => e.stopPropagation()}
						className='bg-neutral-800 rounded-lg p-5 w-[50vw]'
					>
						<h2 className='title mb-5'>Edit permission</h2>
						{edit ? (
							<InputWithLabel label='User' value={selectedUser?.employee.email} readOnly />
						) : (
							<CustomDropdown
								options={users}
								optionLabel='email'
								optionValue='id'
								value={selectedId}
								onChange={(e) => {
									const user = users.find((user) => user.id === e.value);
									setSelectedId(e.value);
									setSelectedUser(user ? { employee: user, canEdit: false, canView: false } : null);
								}}
								label='User'
							/>
						)}
						<div className='grid grid-cols-4 mt-5'>
							<div>Can view</div>
							<InputSwitch
								checked={selectedUser?.canView || false}
								onChange={(e) =>
									setSelectedUser((user) =>
										user
											? {
													...user,
													canView: e.value as boolean,
													canEdit: e.value ? user.canEdit : false,
											  }
											: null
									)
								}
								disabled={!selectedUser}
							/>
							<div>Can edit</div>
							<InputSwitch
								checked={selectedUser?.canEdit || false}
								onChange={(e) =>
									setSelectedUser((user) =>
										user ? { ...user, canEdit: e.value as boolean } : null
									)
								}
								disabled={!selectedUser || !selectedUser.canView}
							/>
						</div>
						<div className='flex justify-end mt-5'>
							<Button
								label='Cancel'
								className='h-11 rounded-lg mr-3 btn-outlined !border-red-600'
								onClick={() => {
									setShareModal(false);
									setSelectedUser(null);
									setSelectedId('');
									setEdit(false);
								}}
								severity='danger'
								outlined
							/>
							<Button label='Share' className='h-11 rounded-lg' disabled={!selectedId} />
						</div>
					</form>
				</Overlay>
			)}
		</>
	);
};

export default ShareModal;
