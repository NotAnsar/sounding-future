export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='mt-4'>
			<h2 className='text-6xl font-semibold'>Profile</h2>
			{children}
		</div>
	);
}
