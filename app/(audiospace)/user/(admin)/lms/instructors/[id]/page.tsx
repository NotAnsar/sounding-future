import BreadCrumb from '@/components/BreadCrumb';
import Error from '@/components/Error';
import InstructorForm from '@/components/LMS/instructor/InstructorForm';
import { getAllArtists } from '@/db/artist';
import { getInstructorById } from '@/db/instructor';

export default async function Page({
	params: { id },
}: {
	params: { id: string };
}) {
	const [instructors, artists] = await Promise.all([
		getInstructorById(id),
		getAllArtists(),
	]);

	if (instructors.error || !instructors.data) {
		return <Error message={instructors?.message} />;
	}

	if (artists.error || !artists.data) {
		return <Error message='Unable to retrieve data. Please try again later.' />;
	}

	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{ link: '/user/lms/instructors', text: 'Instructors' },

					{
						link: '/user/lms/instructors/new',
						text: 'Add Instructors',
						isCurrent: true,
					},
				]}
			/>
			<InstructorForm initialData={instructors?.data} artists={artists?.data} />
		</div>
	);
}
