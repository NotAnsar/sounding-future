import BreadCrumb from '@/components/BreadCrumb';
import UserForm from '@/components/UsersCrud/UserForm';

export default function Page() {
	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: '/user/users', text: 'Users' },

					{
						link: '/user/users/new',
						text: 'Add User',
						isCurrent: true,
					},
				]}
			/>
			<UserForm />
		</div>
	);
}
