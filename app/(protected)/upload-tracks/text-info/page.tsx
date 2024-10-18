'use client';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import SettingsNav from '@/components/settings/SettingsNav';
import { useForm } from 'react-hook-form';
import {
	FormControl,
	FormMessage,
	FormField,
	FormItem,
	Form,
	FormLabel,
	FormDescription,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { Label } from '@/components/ui/label';

const appearanceFormSchema = z.object({
	theme: z.enum(['light', 'dark'], {
		required_error: 'Please select a theme.',
	}),
});

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

const defaultValues: Partial<AppearanceFormValues> = {
	theme: 'dark',
};

export default function AppearanceForm() {
	const { theme, setTheme } = useTheme();

	const form = useForm<AppearanceFormValues>({
		resolver: zodResolver(appearanceFormSchema),
		defaultValues,
	});

	useEffect(() => {
		if (theme === 'light' || theme === 'dark') form.reset({ theme: theme });
	}, [theme, form]);

	function onSubmit(data: AppearanceFormValues) {
		setTheme(data.theme);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<Tabs value='appearance' className='mt-4 sm:mt-8 grid sm:gap-3'>
					<SettingsNav />
					<TabsContent value='appearance' className='lg:w-2/3 mt-2 grid gap-6'>
						<FormField
							control={form.control}
							name='theme'
							render={({ field }) => (
								<FormItem className='space-y-1'>
									<Label>Theme</Label>
									<FormDescription>
										Select your favourite screen mode
									</FormDescription>
									<FormMessage />
									<RadioGroup
										onValueChange={field.onChange}
										value={field.value}
										className='grid max-w-md grid-cols-2 gap-8 pt-2'
									>
										<FormItem>
											<FormLabel className='[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>span]:bg-[#ddd] dark:[&:has([data-state=checked])>span]:bg-[#646870]'>
												<FormControl>
													<RadioGroupItem value='light' className='sr-only' />
												</FormControl>
												<div className='items-center rounded-md border-2 border-muted p-1 hover:border-accent'>
													<div className='space-y-2 rounded-sm bg-[#ecedef] p-2'>
														<div className='space-y-2 rounded-md bg-white p-2 shadow-sm'>
															<div className='h-2 w-[80px] rounded-lg bg-[#ecedef]' />
															<div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
														</div>
														<div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm'>
															<div className='h-4 w-4 rounded-full bg-[#ecedef]' />
															<div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
														</div>
														<div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm'>
															<div className='h-4 w-4 rounded-full bg-[#ecedef]' />
															<div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
														</div>
													</div>
												</div>

												<span className='block w-fit py-1.5 px-2.5 text-center font-normal border border-foreground mt-2 mx-auto rounded-md'>
													Light
												</span>
											</FormLabel>
										</FormItem>

										<FormItem>
											<FormLabel className='[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>span]:bg-[#ddd]  dark:[&:has([data-state=checked])>span]:bg-[#646870]'>
												<FormControl>
													<RadioGroupItem value='dark' className='sr-only' />
												</FormControl>
												<div className='items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground'>
													<div className='space-y-2 rounded-sm bg-slate-950 p-2'>
														<div className='space-y-2 rounded-md bg-slate-800 p-2 shadow-sm'>
															<div className='h-2 w-[80px] rounded-lg bg-slate-400' />
															<div className='h-2 w-[100px] rounded-lg bg-slate-400' />
														</div>
														<div className='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm'>
															<div className='h-4 w-4 rounded-full bg-slate-400' />
															<div className='h-2 w-[100px] rounded-lg bg-slate-400' />
														</div>
														<div className='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm'>
															<div className='h-4 w-4 rounded-full bg-slate-400' />
															<div className='h-2 w-[100px] rounded-lg bg-slate-400' />
														</div>
													</div>
												</div>
												<span className='block w-fit py-1.5 px-2.5 text-center font-normal border border-foreground mt-2 mx-auto rounded-md'>
													Dark
												</span>
											</FormLabel>
										</FormItem>
									</RadioGroup>
								</FormItem>
							)}
						/>
					</TabsContent>
				</Tabs>
			</form>
		</Form>
	);
}
