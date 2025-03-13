import BreadCrumb from '@/components/BreadCrumb';
import Error from '@/components/Error';
import HelpCenterForm from '@/components/helpcenter-crud/helpcenter-form';
import { getHelpCenterById } from '@/db/help-center';

export default async function Page({
	params: { id },
}: {
	params: { id: string };
}) {
	const videoContent = await getHelpCenterById(id);

	if (videoContent.error || !videoContent.data) {
		return <Error message={videoContent?.message} />;
	}

	return (
		<div className='mt-4'>
			<BreadCrumb
				items={[
					{
						link: '/user/sections/help-center',
						text: 'Help Center',
					},
					{
						link: '/user/sections/help-center/edit',
						text: 'Edit Video',
						isCurrent: true,
					},
				]}
			/>
			<HelpCenterForm initialData={videoContent.data} />
		</div>
	);
}
