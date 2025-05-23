import { buttonVariants } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourses } from '@/db/course';
import Error from '@/components/Error';
import { columns } from '@/components/LMS/course/table/columns';
import { DataTable } from '@/components/LMS/course/table/data-table';

export default async function page() {
	const [session, courses] = await Promise.all([auth(), getCourses()]);

	if (!session) notFound();

	if (courses.error) {
		return <Error message={courses.message} />;
	}

	return (
		<>
			<div className='flex flex-col lg:flex-row lg:items-center justify-between mt-4 mb-6 gap-2'>
				<div>
					<h2 className='text-3xl md:text-5xl font-semibold'>Courses</h2>
					<p className='text-muted-foreground mt-1 font-medium text-[15px]'>
						Total courses: {courses.data.length}
					</p>
				</div>

				<Link href={'/user/lms/new'} className={cn(buttonVariants())}>
					<Plus className='w-4 h-auto aspect-square mr-2' /> Add Course
				</Link>
			</div>

			<div className='flex flex-row gap-2 mb-6'>
				<Link
					href={'/user/lms/course-topics'}
					className={cn(buttonVariants({ variant: 'outline' }))}
				>
					Course Topics
				</Link>
				<Link
					href={'/user/lms/course-series'}
					className={cn(buttonVariants({ variant: 'outline' }))}
				>
					Course Series
				</Link>
				<Link
					href={'/user/lms/chapters'}
					className={cn(buttonVariants({ variant: 'outline' }))}
				>
					Chapters
				</Link>
				<Link
					href={'/user/lms/intructors'}
					className={cn(buttonVariants({ variant: 'outline' }))}
				>
					Instructors
				</Link>
			</div>

			<DataTable columns={columns} data={courses.data} />
		</>
	);
}
