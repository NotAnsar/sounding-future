import BreadCrumb from '@/components/BreadCrumb';

export default async function page() {
	return (
		<>
			<BreadCrumb
				items={[
					{ link: '/user/tracks', text: 'Tracks' },

					{
						link: '/user/tracks/upload',
						text: 'Upload Track',
						isCurrent: true,
					},
				]}
			/>
			<h1>New Upload Page</h1>;
		</>
	);
}
