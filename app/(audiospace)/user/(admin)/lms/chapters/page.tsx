import { getChapters } from '@/db/chapter';
import { getCourseById } from '@/db/course';
import { columns } from '@/components/LMS/chapter/table/columns';
import { DataTable } from '@/components/LMS/chapter/table/data-table';
import Error from '@/components/Error';
import BreadCrumb from '@/components/BreadCrumb';
import Link from 'next/link';
import { Plus, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { redirect } from 'next/navigation';

export const metadata = {
	title: 'Chapters - LMS',
	description: 'Manage course chapters in the learning management system',
};

export default async function ChaptersPage({
	searchParams,
}: {
	searchParams: { courseId?: string };
}) {
	const { courseId } = searchParams;

	// If courseId provided, validate it exists - redirect if not
	let courseDetails = null;
	if (courseId) {
		const courseResult = await getCourseById(courseId);
		if (courseResult.error || !courseResult.data) {
			// Redirect to all chapters page if course doesn't exist
			redirect('/user/lms/chapters');
		} else {
			courseDetails = courseResult.data;
		}
	}

	// Get chapters (filtered by courseId if provided)
	const chapters = await getChapters(courseId);

	if (chapters.error || !chapters.data) {
		return <Error message={chapters.message || 'Error loading chapters'} />;
	}

	return (
		<div className='mt-4'>
			<div className='flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-2'>
				<BreadCrumb
					items={[
						{ link: '/user/lms', text: 'Courses' },
						{
							link: `/user/lms/chapters?courseId=${courseId}`,
							text: 'Chapters',
							isCurrent: true,
						},
					]}
				/>

				{/* Action buttons */}
				<div className='flex items-center gap-2 flex-shrink-0'>
					{/* Show "All Chapters" button when filtering by course */}
					{courseDetails && (
						<Link
							href='/user/lms/chapters'
							className={cn(buttonVariants({ variant: 'secondary' }))}
						>
							<ArrowLeft className='w-4 h-auto aspect-square mr-2' />
							All Chapters
						</Link>
					)}

					{/* Add Chapter button - pre-fill course if filtering */}
					<Link
						href={
							courseDetails
								? `/user/lms/chapters/new?courseId=${courseId}`
								: '/user/lms/chapters/new'
						}
						className={cn(buttonVariants())}
					>
						<Plus className='w-4 h-auto aspect-square mr-2' />
						Add Chapter
					</Link>
				</div>
			</div>
			{/* Dynamic title and stats based on filter */}
			<div className='mt-3 mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-2'>
				<div>
					{courseDetails ? (
						<>
							<h1
								className='text-xl font-semibold mb-1 truncate'
								title={courseDetails.title}
							>
								{courseDetails.title} - Chapters
							</h1>
							<p className='text-muted-foreground font-medium text-[15px]'>
								{chapters.data.length} chapters in this course
							</p>
						</>
					) : (
						<>
							<h1 className='text-xl font-semibold mb-1'>All Chapters</h1>
							<p className='text-muted-foreground font-medium text-[15px]'>
								Total chapters: {chapters.data.length}
							</p>
						</>
					)}
				</div>

				{courseDetails && (
					<div className='mb-4'>
						<div className='inline-flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-sm border'>
							<span className='font-medium'>Filtered by course:</span>
							<span
								className='text-muted-foreground truncate max-w-[200px]'
								title={courseDetails.title}
							>
								{courseDetails.title}
							</span>
							<Link
								href='/user/lms/chapters'
								className='ml-2 text-xs text-primary hover:underline font-medium flex-shrink-0'
							>
								Clear filter
							</Link>
						</div>
					</div>
				)}
			</div>

			{/* Show empty state for course with no chapters */}
			{courseDetails && chapters.data.length === 0 ? (
				<div className='flex flex-col items-center justify-center py-12 text-center'>
					<div className='rounded-full bg-muted p-3 mb-2'>
						<Plus className='w-6 h-6 text-secondary' />
					</div>
					<h3 className='text-lg font-semibold '>No chapters yet</h3>
					<p className='text-muted-foreground mb-2 max-w-sm'>
						{
							"This course doesn't have any chapters yet. Create the first chapter to get started."
						}
					</p>
					<Link
						href={`/user/lms/chapters/new?courseId=${courseId}`}
						className={cn(buttonVariants())}
					>
						<Plus className='w-4 h-auto aspect-square mr-2' />
						Create First Chapter
					</Link>
				</div>
			) : (
				<DataTable columns={columns} data={chapters.data || []} />
			)}
		</div>
	);
}
