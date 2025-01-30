import BreadCrumb from '@/components/BreadCrumb';

import Error from '@/components/Error';
import { getUserbyId } from '@/db/user';
import UserForm from '@/components/UsersCrud/UserForm';

export default async function Page({
	params: { id },
}: {
	params: { id: string };
}) {
	const user = await getUserbyId(id);

	if (user.error) {
		return <Error message={user.message} />;
	}

	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: '/user/users', text: 'Users' },

					{
						link: '/user/users/new',
						text: 'Edit User',
						isCurrent: true,
					},
				]}
			/>{' '}
			<UserForm initialData={user.data || undefined} />
		</div>
	);
}
