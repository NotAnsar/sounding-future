import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { Fragment } from 'react';

type BreadcrumbItem = { text: string; link: string; isCurrent?: boolean };
type Props = { items: BreadcrumbItem[] };

export default function BreadCrumb({ items }: Props) {
	return (
		<Breadcrumb>
			<BreadcrumbList className='h-10 flex items-center'>
				{items.map((item, i) => (
					<Fragment key={i}>
						<BreadcrumbItem>
							<BreadcrumbLink
								className={cn(
									'text-3xl md:text-5xl font-semibold',
									item.isCurrent ? 'text-foreground' : ''
								)}
								href={item.link}
							>
								{item.text}
							</BreadcrumbLink>
						</BreadcrumbItem>
						{i < items.length - 1 && (
							<BreadcrumbSeparator className='[&>svg]:size-5' />
						)}
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
