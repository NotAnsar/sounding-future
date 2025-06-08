import Error from '@/components/Error';
import {
	checkUserAccess,
	getCourseBySlug,
	getCourseProgress,
} from '@/db/course';
import { Metadata } from 'next';
import CoursesDetailsNav from '@/components/courses/course-details/CoursesDetailsNav';
import { Tabs } from '@/components/ui/tabs';
import CourseHeader from '@/components/courses/course-details/CourseHeader';
import LearningTab from '@/components/courses/course-details/LearningTab';
import InstructorTab from '@/components/courses/course-details/InstructorTab';
import CourseVideoSection from '@/components/courses/course-details/CourseVideoSection';
import LikeCourseForm, { ShareCourseButton } from '@/components/LikeCourseForm';

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
	searchParams,
}: {
	params: { id: string };
	searchParams: { tab?: string; chapter?: string };
}) {
	const { tab, chapter } = searchParams;
	const [userAccess, res] = await Promise.all([
		checkUserAccess(),
		getCourseBySlug(params.id),
	]);

	const tabValue = ['learnings', 'instructor'].includes(tab || '')
		? tab
		: 'learnings';

	if (res.error || !res.data) return <Error message={res.message} />;
	const course = res.data;

	const progressData = await getCourseProgress(course.id);

	// Find current chapter by slug or default to first chapter
	const currentChapterIndex = chapter
		? course.chapters.findIndex((ch) => ch.slug === chapter)
		: 0;

	// If chapter slug not found, default to first chapter
	const activeChapterIndex = currentChapterIndex >= 0 ? currentChapterIndex : 0;
	const currentChapter = course.chapters[activeChapterIndex];

	return (
		<div className='space-y-6'>
			<CourseHeader
				course={course}
				progressData={progressData}
				isAuthenticated={userAccess.isAuthenticated}
			/>
			<CourseVideoSection
				course={course}
				currentChapter={currentChapter}
				currentChapterIndex={activeChapterIndex}
				isAuth={userAccess.isAuthenticated}
				canAccessPro={userAccess.canAccessPro} // ADD THIS LINE
				completedChapters={progressData.completedChapters || []} // NEW PROP
			/>

			<Tabs value={tabValue} className='mt-4 sm:mt-8 grid gap-2 sm:gap-3'>
				<div className='flex flex-col sm:flex-row gap-2 sm:items-center justify-between'>
					<CoursesDetailsNav
						tabs={[
							{ label: 'Learnings & Skills', link: 'learnings' },
							{ label: 'Instructor & Credits', link: 'instructor' },
						]}
						searchParams={searchParams}
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

				<LearningTab course={course} />
				<InstructorTab course={course} currentChapterId={currentChapter.id} />
			</Tabs>
		</div>
	);
}
