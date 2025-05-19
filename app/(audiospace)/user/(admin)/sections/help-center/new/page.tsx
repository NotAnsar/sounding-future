import BreadCrumb from '@/components/BreadCrumb';
import HelpCenterForm from '@/components/helpcenter-crud/helpcenter-form';

export default function Page() {
	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{
						link: '/user/sections/help-center',
						text: 'Help Center',
					},
					{
						link: '/user/sections/help-center/new',
						text: 'Add Video',
						isCurrent: true,
					},
				]}
			/>
			<HelpCenterForm />
		</div>
	);
}
