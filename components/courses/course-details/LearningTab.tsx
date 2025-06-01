import { CourseDetails } from '@/db/course';
import { TabsContent } from '@/components/ui/tabs';
import { Icons } from '@/components/icons/audio-player';
import { Check } from 'lucide-react';

export default function LearningTab({ course }: { course: CourseDetails }) {
	return (
		<TabsContent value='learnings' className='space-y-10'>
			<div className='p-6 pb-9 bg-secondary rounded-lg mb-4'>
				<div className='flex gap-3 items-center'>
					<Icons.learning className='w-7 h-auto aspect-square text-primary-foreground min-w-7 max-w-7' />
					<h1 className='text-xl sm:text-2xl font-bold text-primary-foreground'>
						What you will learn in this course
					</h1>
				</div>
				<div className='grid md:grid-cols-2 gap-x-5	gap-y-8 mt-8'>
					{course.learnings.map((learning, index) => (
						<div key={index} className='flex gap-3.5 text-foreground'>
							<div className='w-8 h-8 rounded-md bg-white flex items-center justify-center flex-shrink-0'>
								<Check className='w-6 h-6 text-black' />
							</div>
							<span>{learning}</span>
						</div>
					))}
				</div>
			</div>
			{course.skills && (
				<div className='p-6 pb-9 bg-secondary rounded-lg mb-4'>
					<div className='flex gap-3 items-center'>
						<Icons.skills className='w-7 h-auto aspect-square text-primary-foreground min-w-7 max-w-7' />
						<h1 className='text-xl sm:text-2xl font-bold text-primary-foreground'>
							What skills and tools you need for this course
						</h1>
					</div>
					<p className='mt-8 text-pretty leading-7 whitespace-pre-line'>
						{course.skills}
					</p>
				</div>
			)}
		</TabsContent>
	);
}
