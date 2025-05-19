import BreadCrumb from '@/components/BreadCrumb';
import UserForm from '@/components/UsersCrud/UserForm';
import { getUnlinkedArtists } from '@/db/artist';
import Error from '@/components/Error';

export default async function Page() {
	const { data, error, message } = await getUnlinkedArtists();

	if (error || !data) {
		return <Error message={message} />;
	}

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
			<UserForm artistsData={data} />
		</div>
	);
}
