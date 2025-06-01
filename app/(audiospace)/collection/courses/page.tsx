import Error from '@/components/Error';
import { Icons } from '@/components/icons/audio-player';
import { buttonVariants } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
	CourseDetails,
	getUserFavoriteCoursesWithDetails,
	getUserLearningCourses,
} from '@/db/course';
import CoursesCard, { CoursesListCard } from '@/components/courses/CoursesCard';

export default async function page({
	searchParams: { type, tab },
}: {
	searchParams: { type?: string; tab?: string };
}) {
	const isTable = type === 'table';
	const activeTab = tab === 'learning' ? 'learning' : 'liked';

	// Fetch both liked courses and learning courses in parallel
	const [likedCoursesResult, learningCoursesResult] = await Promise.all([
		getUserFavoriteCoursesWithDetails(),
		getUserLearningCourses(),
	]);

	// Handle errors
	if (likedCoursesResult.error && learningCoursesResult.error) {
		return <Error message='Unable to load your courses' />;
	}

	const likedCourses = likedCoursesResult.data || [];
	const learningCourses = learningCoursesResult.data || [];

	const handleTabChange = (newTab: string) => {
		const params = new URLSearchParams();
		if (type) params.set('type', type);
		params.set('tab', newTab);
		return `?${params.toString()}`;
	};

	const ViewToggle = () => (
		<div className='flex gap-1'>
			<Link
				href={`?tab=${activeTab}&type=table`}
				className={cn(
					buttonVariants(),
					'bg-transparent p-1.5 sm:p-2 hover:bg-button group h-fit duration-200 transition-all shadow-none',
					isTable ? 'bg-button' : ''
				)}
			>
				<Icons.table
					className={cn(
						'w-5 sm:w-6 h-auto aspect-square text-foreground group-hover:text-white',
						isTable ? 'text-white' : ''
					)}
				/>
			</Link>
			<Link
				href={`?tab=${activeTab}&type=grid`}
				className={cn(
					buttonVariants(),
					'bg-transparent p-1.5 sm:p-2 hover:bg-button h-fit group shadow-none duration-200 transition-all',
					!isTable ? 'bg-button' : ''
				)}
			>
				<Icons.grid
					className={cn(
						'w-5 sm:w-6 h-auto aspect-square text-foreground group-hover:text-white shadow-none',
						!isTable ? 'text-white' : ''
					)}
				/>
			</Link>
		</div>
	);

	const CourseGrid = ({
		courses,
		emptyTitle,
		emptyMessage,
		emptyLinkText,
		emptyLinkHref,
		showProgress = false,
	}: {
		courses: CourseDetails[];
		emptyTitle: string;
		emptyMessage: string;
		emptyLinkText: string;
		emptyLinkHref: string;
		showProgress?: boolean;
	}) => {
		if (courses.length === 0) {
			return (
				<div className='flex flex-col items-center justify-center h-96'>
					<h2 className='text-2xl font-semibold'>{emptyTitle}</h2>
					<p className='text-muted text-center max-w-md'>
						{emptyMessage}{' '}
						<Link
							href={emptyLinkHref}
							className='text-primary hover:underline font-medium'
						>
							{emptyLinkText}
						</Link>
					</p>
				</div>
			);
		}

		return (
			<div>
				{isTable ? (
					<div className='grid grid-cols-1 gap-4'>
						{courses.map((course) => (
							<CoursesListCard
								course={course}
								key={course.id}
								showProgress={showProgress}
							/>
						))}
					</div>
				) : (
					<div className='grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-6 sm:gap-y-10 2xl:gap-x-10'>
						{courses.map((course) => (
							<CoursesCard
								course={course}
								key={course.id}
								showProgress={showProgress}
							/>
						))}
					</div>
				)}
			</div>
		);
	};

	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-4xl sm:text-5xl font-semibold'>My Collection</h1>
				<ViewToggle />
			</div>

			<Tabs value={activeTab} className='w-full'>
				<div className='flex justify-between items-center mb-6'>
					<TabsList className='grid w-fit grid-cols-2 bg-secondary gap-2'>
						<TabsTrigger value='liked' asChild>
							<Link
								href={handleTabChange('liked')}
								className='flex items-center gap-2'
							>
								Liked Courses
								{likedCourses.length > 0 && (
									<span
										className={cn(
											'ml-1 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full',
											activeTab === 'liked' && 'bg-player'
										)}
									>
										{likedCourses.length}
									</span>
								)}
							</Link>
						</TabsTrigger>
						<TabsTrigger value='learning' asChild>
							<Link
								href={handleTabChange('learning')}
								className='flex items-center gap-2'
							>
								My Learning
								{learningCourses.length > 0 && (
									<span
										className={cn(
											'ml-1 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full',
											activeTab === 'learning' && 'bg-player'
										)}
									>
										{learningCourses.length}
									</span>
								)}
							</Link>
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value='liked' className='mt-0'>
					<CourseGrid
						courses={likedCourses}
						emptyTitle='No liked courses found'
						emptyMessage="You haven't liked any courses yet. Explore our courses and start liking them!"
						emptyLinkText='Browse Courses'
						emptyLinkHref='/courses'
						showProgress={false}
					/>
				</TabsContent>

				<TabsContent value='learning' className='mt-0'>
					<CourseGrid
						courses={learningCourses}
						emptyTitle='No courses in progress'
						emptyMessage="You haven't started any courses yet. Begin your learning journey today!"
						emptyLinkText='Start Learning'
						emptyLinkHref='/courses'
						showProgress={true}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
