import BreadCrumb from '@/components/BreadCrumb';

import Error from '@/components/Error';
import { getUserbyId } from '@/db/user';
import UserForm from '@/components/UsersCrud/UserForm';
import { getUnlinkedArtists } from '@/db/artist';

export default async function Page({
	params: { id },
}: {
	params: { id: string };
}) {
	const [user, artists] = await Promise.all([
		getUserbyId(id),
		getUnlinkedArtists(id),
	]);

	if (user.error) return <Error message={user.message} />;
	if (artists.error) return <Error message={artists.message} />;

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
			/>
			<UserForm
				initialData={user.data || undefined}
				artistsData={artists.data}
			/>
		</div>
	);
}
