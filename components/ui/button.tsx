import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50  duration-200 transition-all ease-out',
	{
		variants: {
			variant: {
				default:
					'bg-primary text-white shadow hover:bg-primary/80 duration-200 ',
				destructive:
					'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
				outline:
					'border border-transparent bg-player shadow-sm hover:bg-player/40 hover:text-accent-foreground',
				input:
					'border border-transparent shadow-sm hover:bg-player/40 hover:text-accent-foreground bg-player',
				secondary:
					'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
				sideNav: 'bg-primary hover:bg-primary/95',
				sideNavForeground: 'hover:bg-primary',
				submit:
					'text-white shadow bg-[#713C96] hover:bg-[#713C96]/90 duration-200  ',
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				xl: 'h-12 rounded-md px-8',
				icon: 'h-9 w-9',
				submit:
					'h-7 sm:h-8 text-sm sm:text-[15px] px-3 sm:px-5 py-1.5 uppercase',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
