import BreadCrumb from '@/components/BreadCrumb';
import Error from '@/components/Error';
import InstructorForm from '@/components/LMS/instructor/InstructorForm';
import { getAllArtists } from '@/db/artist';

export default async function Page() {
	const artists = await getAllArtists();

	if (artists.error || !artists.data) {
		return <Error message='Unable to retrieve data. Please try again later.' />;
	}
	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: '/user/lms/intructors', text: 'Instructors' },

					{
						link: '/user/lms/intructors/new',
						text: 'Add Instructors',
						isCurrent: true,
					},
				]}
			/>
			<InstructorForm artists={artists?.data} />
		</div>
	);
}
