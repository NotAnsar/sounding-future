import { EditNewsLetterButton } from '@/components/sections/NewsLetterDialog';
import { EditSocialsButton } from '@/components/sections/SocialMediaDialog';
import { buttonVariants } from '@/components/ui/button';
import { getNewsLetter, getSocialLinks } from '@/db/section';
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
	List,
} from 'lucide-react';
import Link from 'next/link';

const pages = [
	{ title: 'Legal', link: '/user/legal', icon: FileText },
	{ title: 'Privacy', link: '/user/privacy', icon: Shield },
	{ title: 'About', link: '/user/privacy', icon: Info },
	{ title: 'Support Us', link: '/user/privacy', icon: Heart },
];

const sections = [
	{ title: 'FAQ', link: '/user/sections/faq', icon: HelpCircle },
	// { title: 'Newsletter', link: '/user/newsletter', icon: Mail },
	{ title: 'Banners', link: '/user/banners', icon: List },
	{ title: 'Become Supporter', link: '/user/supporter', icon: Star },
];

export async function generateMetadata() {
	return {
		title: 'Edit Sections',
		description: 'Manage and customize your website pages and sections.',
	};
}

export default async function SectionsPage() {
	const [{ data: socialLinks }, { data: newsletter }] = await Promise.all([
		getSocialLinks(),
		getNewsLetter(),
	]);

	return (
		<>
			<div className='mt-4 mb-4 sm:mb-12 gap-2'>
				<h2 className='text-3xl md:text-5xl font-semibold'>Edit Sections</h2>
				<p className='text-muted mt-2'>
					Manage and customize your website pages and sections.
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
						<EditSocialsButton data={socialLinks || undefined}>
							<div
								className={cn(
									buttonVariants({ variant: 'outline' }),
									'group hover:border-primary hover:bg-primary/5 transition-all duration-200 h-auto py-6 w-full'
								)}
							>
								<div className='flex items-center gap-3 w-full'>
									<Share className='w-5 h-5 group-hover:text-primary transition-colors' />

									<span className='font-medium'>Social Links</span>
									<ChevronRight className='w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity' />
								</div>
							</div>
						</EditSocialsButton>
						<EditNewsLetterButton data={newsletter || undefined}>
							<div
								className={cn(
									buttonVariants({ variant: 'outline' }),
									'group hover:border-primary hover:bg-primary/5 transition-all duration-200 h-auto py-6 w-full'
								)}
							>
								<div className='flex items-center gap-3 w-full'>
									<Mail className='w-5 h-5 group-hover:text-primary transition-colors' />

									<span className='font-medium'>Newsletter</span>
									<ChevronRight className='w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity' />
								</div>
							</div>
						</EditNewsLetterButton>
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
