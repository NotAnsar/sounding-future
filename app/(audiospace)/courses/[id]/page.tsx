import Error from '@/components/Error';
import { getCourseBySlug } from '@/db/course';
import { Metadata } from 'next';
import CoursesDetailsNav from '@/components/courses/course-details/CoursesDetailsNav';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import CourseHeader from '@/components/courses/course-details/CourseHeader';
import LearningTab from '@/components/courses/course-details/LearningTab';
import InstructorTab from '@/components/courses/course-details/InstructorTab';
import CourseVideoSection from '@/components/courses/course-details/CourseVideoSection';
import CourseChapterList from '@/components/courses/course-details/CourseChapterTab';
import LikeCourseForm, { ShareCourseButton } from '@/components/LikeCourseForm';
import { auth } from '@/lib/auth';

export async function generateMetadata({
	params,
}: {
	params: { id: string };
}): Promise<Metadata> {
	const course = await getCourseBySlug(params.id);

	if (!course.data) return { title: 'Course Not Found' };

	return {
		title: `${course.data.title} - Course Details`,
		description:
			course.data.description || `Explore the course: ${course.data.title}`,
	};
}

export default async function page({
	params,
	searchParams: { tab, chapter },
}: {
	params: { id: string };
	searchParams: { tab?: string; chapter?: string };
}) {
	const [session, res] = await Promise.all([
		auth(),
		getCourseBySlug(params.id),
	]);
	const isAuthenticated = !!session?.user;

	const tabValue = ['content', 'learnings', 'instructor'].includes(tab || '')
		? tab
		: 'content';

	if (res.error || !res.data) return <Error message={res.message} />;
	const course = res.data;

	// Find current chapter by slug or default to first chapter
	const currentChapterIndex = chapter
		? course.chapters.findIndex((ch) => ch.slug === chapter)
		: 0;

	// If chapter slug not found, default to first chapter
	const activeChapterIndex = currentChapterIndex >= 0 ? currentChapterIndex : 0;
	const currentChapter = course.chapters[activeChapterIndex];

	return (
		<div className='space-y-6'>
			<CourseHeader course={course} />
			<CourseVideoSection
				course={course}
				currentChapter={currentChapter}
				currentChapterIndex={activeChapterIndex}
				isAuth={isAuthenticated}
			/>
			<Tabs value={tabValue} className='mt-4 sm:mt-8 grid gap-2 sm:gap-3'>
				<div className='flex flex-col sm:flex-row gap-2 sm:items-center justify-between'>
					<CoursesDetailsNav
						tabs={[
							{ label: 'Course Content', link: 'content' },
							{ label: 'Learnings & Skills', link: 'learnings' },
							{ label: 'Instructor & Credits', link: 'instructor' },
						]}
					/>
					<div className='flex items-center gap-2 ml-auto'>
						<LikeCourseForm
							courseId={course.id}
							liked={course.isLiked || false}
							className='text-foreground w-6'
						/>
						<ShareCourseButton
							chapterSlug={currentChapter.slug}
							courseSlug={course.slug}
						/>
					</div>
				</div>
				<TabsContent value='content'>
					<CourseChapterList
						course={course}
						currentChapterIndex={activeChapterIndex}
					/>
				</TabsContent>
				<LearningTab course={course} />
				<InstructorTab course={course} />
			</Tabs>
		</div>
	);
}
