import BreadCrumb from '@/components/BreadCrumb';
import Error from '@/components/Error';
import InstructorForm from '@/components/LMS/instructor/InstructorForm';
import { getInstructorById } from '@/db/instructor';

export default async function Page({
	params: { id },
}: {
	params: { id: string };
}) {
	const instructors = await getInstructorById(id);

	if (instructors.error || !instructors.data) {
		return <Error message={instructors?.message} />;
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
			<InstructorForm initialData={instructors?.data} />
		</div>
	);
}
