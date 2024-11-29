export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='mt-4 max-w-screen-lg'>
			<h2 className='text-[42px] md:text-5xl lg:text-6xl font-semibold'>
				Artist Profile
			</h2>
			{children}
		</div>
	);
}
