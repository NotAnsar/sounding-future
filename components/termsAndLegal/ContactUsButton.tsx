'use client';
import React, { useState } from 'react';
import ContactDialog from '../contactForm/ContactDialog';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export default function ContactUsButton({ className }: { className?: string }) {
	const [open, setopen] = useState(false);
	return (
		<ContactDialog open={open} setopen={setopen} key={open ? 'open' : 'close'}>
			<Button className={cn('font-semibold', className)}>Contact Us</Button>
		</ContactDialog>
	);
}
export function ContactUsLink({ className }: { className?: string }) {
	const [open, setopen] = useState(false);
	return (
		<ContactDialog open={open} setopen={setopen} key={open ? 'open' : 'close'}>
			<span
				className={cn(
					'underline text-primary-foreground cursor-pointer hover:text-primary-foreground/90',
					className
				)}
			>
				contact us
			</span>
		</ContactDialog>
	);
}
