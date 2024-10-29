'use client';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function CollapsibleText({
	text,
	maxLength = 600,
	className,
}: {
	text: string;
	maxLength?: number;
	className?: string;
}) {
	const [isExpanded, setIsExpanded] = useState(false);
	const shouldCollapse = text.length > maxLength;

	const displayText =
		shouldCollapse && !isExpanded
			? text.substring(0, maxLength).trim() + '...'
			: text;

	return (
		<div className={cn('space-y-2', className)}>
			<p className='text-pretty leading-7'>{displayText}</p>
			{shouldCollapse && (
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className='text-primary-foreground hover:text-primary-foreground/80 font-medium transition-colors text-sm'
				>
					{isExpanded ? '[-] Show less' : '[+] Show more'}
				</button>
			)}
		</div>
	);
}
