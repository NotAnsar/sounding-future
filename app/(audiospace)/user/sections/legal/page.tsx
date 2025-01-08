import BreadCrumb from '@/components/BreadCrumb';
import { CreateTermsSection } from '@/components/sections/LegalSectionDialog';
import TermsSectionsList, {
	EditContent,
} from '@/components/sections/terms/TermsSectionsList';
import { getTermsData } from '@/db/pages';

export default async function page() {
	const { data } = await getTermsData();

	return (
		<div className='mt-4'>
			<div className='flex flex-col sm:flex-row justify-between gap-2'>
				<div>
					<BreadCrumb
						items={[
							{ link: '/user/sections', text: 'Edit Sections' },

							{
								link: '/user/sections/legal',
								text: 'Legal Page',
								isCurrent: true,
							},
						]}
					/>
					<p className='text-muted mt-2'>Manage your legal page</p>
				</div>

				<CreateTermsSection />
			</div>
			<div className='mt-6 space-y-4'>
				<EditContent
					content={data?.introduction || undefined}
					type='terms'
					field='introduction'
				/>
				<TermsSectionsList sections={data?.sections || []} />
				<EditContent
					content={data?.footer || undefined}
					type='terms'
					field='footer'
				/>
			</div>
		</div>
	);
}
