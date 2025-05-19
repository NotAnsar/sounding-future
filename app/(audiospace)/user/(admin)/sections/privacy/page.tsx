import BreadCrumb from '@/components/BreadCrumb';
import { CreateTermsSection } from '@/components/sections/LegalSectionDialog';
import TermsSectionsList, {
	EditContent,
} from '@/components/sections/terms/TermsSectionsList';
import { getTermsData } from '@/db/pages';

export default async function page() {
	const { data } = await getTermsData('privacy');

	return (
		<div className='mt-4'>
			<div className='flex flex-col sm:flex-row justify-between gap-2'>
				<div>
					<BreadCrumb
						items={[
							{ link: '/user/sections', text: 'Edit Sections' },

							{
								link: '/user/sections/legal',
								text: 'Privacy Page',
								isCurrent: true,
							},
						]}
					/>
					<p className='text-muted mt-2'>Manage your privacy page</p>
				</div>

				<CreateTermsSection />
			</div>
			<div className='mt-6 space-y-4'>
				<EditContent
					content={data?.introduction || undefined}
					type='privacy'
					field='introduction'
				/>
				<TermsSectionsList sections={data?.sections || []} />
				<EditContent
					content={data?.footer || undefined}
					type='privacy'
					field='footer'
				/>
			</div>
		</div>
	);
}
