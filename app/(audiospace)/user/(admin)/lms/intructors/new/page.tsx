import BreadCrumb from '@/components/BreadCrumb';
import InstructorForm from '@/components/LMS/instructor/InstructorForm';

export default async function Page() {
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
			<InstructorForm />
		</div>
	);
}
