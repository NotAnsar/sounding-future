import { buttonVariants } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function page() {
	const [session] = await Promise.all([auth()]);

	if (!session) notFound();

	// if (courses.error) {
	// 	return <Error message={courses.message} />;
	// }

	return (
		<>
			<div className='flex flex-col lg:flex-row lg:items-center justify-between mt-4 mb-4 sm:mb-12 gap-2'>
				<div>
					<h2 className='text-3xl md:text-5xl font-semibold'>Courses</h2>
					{/* <p className='text-muted-foreground mt-1 font-medium text-[15px]'>
						Total courses: {courses.data.length}
					</p> */}
				</div>

				<div className='flex flex-row gap-2'>
					<Link href={'/user/lms/chapters'} className={cn(buttonVariants())}>
						Chapters
					</Link>
					<Link href={'/user/lms/intructors'} className={cn(buttonVariants())}>
						Intructors
					</Link>
					<Link href={'/user/lms/new'} className={cn(buttonVariants())}>
						<Plus className='w-4 h-auto aspect-square mr-2' /> Add Course
					</Link>
				</div>
			</div>
			{/* <DataTable columns={columns} data={courses.data} /> */}
		</>
	);
}
