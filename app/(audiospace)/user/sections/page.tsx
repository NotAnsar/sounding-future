import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	FileText,
	Heart,
	HelpCircle,
	Info,
	Mail,
	Share,
	Shield,
	Star,
	ChevronRight,
	Layout,
	Layers,
} from 'lucide-react';
import Link from 'next/link';

const pages = [
	{ title: 'Legal', link: '/user/legal', icon: FileText },
	{ title: 'Privacy', link: '/user/privacy', icon: Shield },
	{ title: 'About', link: '/user/privacy', icon: Info },
	{ title: 'Support Us', link: '/user/privacy', icon: Heart },
];

const sections = [
	{ title: 'Social Media', link: '/user/social-media', icon: Share },
	{ title: 'Newsletter', link: '/user/newsletter', icon: Mail },
	{ title: 'Support Us', link: '/user/support', icon: Heart },
	{ title: 'Become Supporter', link: '/user/supporter', icon: Star },
	{ title: 'FAQ', link: '/user/faq', icon: HelpCircle },
];

export default function SectionsPage() {
	return (
		<>
			<div className='mt-4 mb-4 sm:mb-12 gap-2'>
				<h2 className='text-3xl md:text-5xl font-semibold'>Edit Sections</h2>
				<p className='text-muted mt-2'>
					Manage and customize your website sections
				</p>
			</div>

			<div className='space-y-12'>
				<section>
					<h2 className='text-2xl font-semibold mb-6 flex items-center gap-2'>
						<Layout className='w-6 h-6' />
						Pages
					</h2>
					<div className='grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{pages.map((page) => (
							<Link
								key={page.title}
								href={page.link}
								className={cn(
									buttonVariants({ variant: 'outline' }),
									'group hover:border-primary hover:bg-primary/5 transition-all duration-200 h-auto py-6'
								)}
							>
								<div className='flex items-center gap-3 w-full'>
									{page.icon && (
										<page.icon className='w-5 h-5 group-hover:text-primary transition-colors' />
									)}
									<span className='font-medium'>{page.title}</span>
									<ChevronRight className='w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity' />
								</div>
							</Link>
						))}
					</div>
				</section>

				<section>
					<h2 className='text-2xl font-semibold mb-6 flex items-center gap-2'>
						<Layers className='w-6 h-6' />
						Sections
					</h2>

					<div className='grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{sections.map((section) => (
							<Link
								key={section.title}
								href={section.link}
								className={cn(
									buttonVariants({ variant: 'outline' }),
									'group hover:border-primary hover:bg-primary/5 transition-all duration-200 h-auto py-6'
								)}
							>
								<div className='flex items-center gap-3 w-full'>
									{section.icon && (
										<section.icon className='w-5 h-5 group-hover:text-primary transition-colors' />
									)}
									<span className='font-medium'>{section.title}</span>
									<ChevronRight className='w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity' />
								</div>
							</Link>
						))}
					</div>
				</section>
			</div>
		</>
	);
}
