'use client';
import { useState } from 'react';

export default function CollapsibleText({
	text,
	maxLength = 300,
}: {
	text: string;
	maxLength?: number;
}) {
	const [isExpanded, setIsExpanded] = useState(false);
	const shouldCollapse = text.length > maxLength;

	const displayText =
		shouldCollapse && !isExpanded
			? text.substring(0, maxLength).trim() + '...'
			: text;

	return (
		<div className='space-y-2'>
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
