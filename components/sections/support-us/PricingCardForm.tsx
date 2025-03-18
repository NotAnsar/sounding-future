'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import ErrorMessage from '@/components/ErrorMessage';
import SaveButton from '@/components/profile/SaveButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { PublishToggle } from '@/components/PublishToggle';
import { SubscriptionCardData } from '@/db/support-us';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, X } from 'lucide-react';
import {
	PricingPlanState,
	createPricingPlan,
	updatePricingPlan,
} from '@/actions/sections/pricing';

export default function PricingCardForm({
	initialData,
	pageId = '1',
}: {
	initialData?: SubscriptionCardData;
	pageId?: string;
}) {
	const initialState: PricingPlanState = { errors: {}, message: null };

	const [state, action] = useFormState(
		initialData?.id
			? updatePricingPlan.bind(null, initialData.id)
			: createPricingPlan,
		initialState
	);

	const [sections, setSections] = useState<
		{ id?: string; title: string; features: string[] }[]
	>(
		initialData?.sections?.map((section) => ({
			id: section.id,
			title: section.title,
			features: section.features,
		})) || []
	);

	const handleAddSection = () => {
		setSections([...sections, { title: '', features: [''] }]);
	};

	const handleRemoveSection = (index: number) => {
		const newSections = [...sections];
		newSections.splice(index, 1);
		setSections(newSections);
	};

	const handleSectionTitleChange = (index: number, title: string) => {
		const newSections = [...sections];
		newSections[index].title = title;
		setSections(newSections);
	};

	const handleAddFeature = (sectionIndex: number) => {
		const newSections = [...sections];
		newSections[sectionIndex].features.push('');
		setSections(newSections);
	};

	const handleRemoveFeature = (sectionIndex: number, featureIndex: number) => {
		const newSections = [...sections];
		newSections[sectionIndex].features.splice(featureIndex, 1);
		setSections(newSections);
	};

	const handleFeatureChange = (
		sectionIndex: number,
		featureIndex: number,
		value: string
	) => {
		const newSections = [...sections];
		newSections[sectionIndex].features[featureIndex] = value;
		setSections(newSections);
	};

	return (
		<form action={action} className='mt-4 sm:mt-8 grid'>
			<div className='w-full flex justify-end'>
				<SaveButton />
			</div>

			<div className='grid gap-4 max-w-2xl'>
				<ErrorMessage errors={state?.message ? [state.message] : undefined} />

				<input type='hidden' name='pageId' value={pageId} />

				<div className='grid gap-2'>
					<Label
						htmlFor='name'
						className={cn(state?.errors?.name ? 'text-destructive' : '')}
					>
						Plan Name
					</Label>
					<Input
						type='text'
						name='name'
						id='name'
						defaultValue={initialData?.name || ''}
						className={cn(
							state?.errors?.name
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>
					<ErrorMessage errors={state?.errors?.name} />
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='description'
						className={cn(state?.errors?.description ? 'text-destructive' : '')}
					>
						Description
					</Label>
					<Textarea
						className={cn(
							'min-h-20',
							state?.errors?.description
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
						defaultValue={initialData?.description || ''}
						name='description'
						id='description'
					/>
					<ErrorMessage errors={state?.errors?.description} />
				</div>

				<div className='grid grid-cols-3 gap-4'>
					<div className='grid gap-2'>
						<Label
							htmlFor='priceAmount'
							className={cn(
								state?.errors?.priceAmount ? 'text-destructive' : ''
							)}
						>
							Price Amount
						</Label>
						<Input
							type='number'
							name='priceAmount'
							id='priceAmount'
							defaultValue={initialData?.priceAmount ?? 0}
							className={cn(
								state?.errors?.priceAmount
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
							min='0'
							step='0.01'
						/>
						<ErrorMessage errors={state?.errors?.priceAmount} />
					</div>

					<div className='grid gap-2'>
						<Label
							htmlFor='priceCurrency'
							className={cn(
								state?.errors?.priceCurrency ? 'text-destructive' : ''
							)}
						>
							Currency
						</Label>
						<Input
							type='text'
							name='priceCurrency'
							id='priceCurrency'
							defaultValue={initialData?.priceCurrency || '€'}
							className={cn(
								state?.errors?.priceCurrency
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
							maxLength={3}
						/>
						<ErrorMessage errors={state?.errors?.priceCurrency} />
					</div>

					<div className='grid gap-2'>
						<Label
							htmlFor='pricePeriod'
							className={cn(
								state?.errors?.pricePeriod ? 'text-destructive' : ''
							)}
						>
							Period
						</Label>
						<Input
							type='text'
							name='pricePeriod'
							id='pricePeriod'
							defaultValue={initialData?.pricePeriod || 'year'}
							className={cn(
								state?.errors?.pricePeriod
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
						/>
						<ErrorMessage errors={state?.errors?.pricePeriod} />
					</div>
				</div>

				<div className='grid gap-4'>
					<div className='flex justify-between items-center'>
						<Label
							className={cn(state?.errors?.sections ? 'text-destructive' : '')}
						>
							Plan Features
						</Label>
						<Button
							type='button'
							variant='outline'
							size='sm'
							onClick={handleAddSection}
							className='flex items-center gap-1'
						>
							<Plus className='h-4 w-4' /> Add Section
						</Button>
					</div>

					{state?.errors?.sections && (
						<ErrorMessage
							errors={
								Array.isArray(state.errors.sections)
									? state.errors.sections
									: []
							}
						/>
					)}

					{sections.map((section, sectionIndex) => (
						<div key={sectionIndex} className='border rounded-md p-4 space-y-3'>
							{/* Hidden input for section ID if it exists */}
							{section.id && (
								<input
									type='hidden'
									name={`section-${sectionIndex}-id`}
									value={section.id}
								/>
							)}

							<div className='flex justify-between items-center'>
								<Label
									htmlFor={`section-${sectionIndex}-title`}
									className={cn(
										state?.errors?.[`section-${sectionIndex}-title`]
											? 'text-destructive'
											: ''
									)}
								>
									Section Title
								</Label>
								{sections.length > 1 && (
									<Button
										type='button'
										variant='ghost'
										size='sm'
										onClick={() => handleRemoveSection(sectionIndex)}
									>
										<Trash2 className='h-4 w-4' />
									</Button>
								)}
							</div>

							<Input
								type='text'
								id={`section-${sectionIndex}-title`}
								name={`section-${sectionIndex}-title`}
								value={section.title}
								onChange={(e) =>
									handleSectionTitleChange(sectionIndex, e.target.value)
								}
								placeholder='Section title'
								className={cn(
									state?.errors?.[`section-${sectionIndex}-title`]
										? 'border-destructive focus-visible:ring-destructive'
										: ''
								)}
							/>
							<ErrorMessage
								errors={state?.errors?.[`section-${sectionIndex}-title`]}
							/>

							<div className='space-y-2 pl-4 border-l-2'>
								<Label>Features</Label>

								{section.features.map((feature, featureIndex) => (
									<div key={featureIndex} className='flex items-center gap-2'>
										<Input
											type='text'
											name={`section-${sectionIndex}-feature-${featureIndex}`}
											value={feature}
											onChange={(e) =>
												handleFeatureChange(
													sectionIndex,
													featureIndex,
													e.target.value
												)
											}
											placeholder='Feature description'
											className={cn(
												state?.errors?.[
													`section-${sectionIndex}-feature-${featureIndex}`
												]
													? 'border-destructive focus-visible:ring-destructive'
													: ''
											)}
										/>
										{section.features.length > 1 && (
											<Button
												type='button'
												variant='ghost'
												size='sm'
												onClick={() =>
													handleRemoveFeature(sectionIndex, featureIndex)
												}
												className='shrink-0'
											>
												<X className='h-4 w-4' />
											</Button>
										)}
									</div>
								))}

								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={() => handleAddFeature(sectionIndex)}
									className='mt-2'
								>
									<Plus className='h-3 w-3 mr-1' /> Add Feature
								</Button>
							</div>
						</div>
					))}
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='buttonText'
						className={cn(state?.errors?.buttonText ? 'text-destructive' : '')}
					>
						Button Text (Optional)
					</Label>
					<Input
						type='text'
						name='buttonText'
						id='buttonText'
						defaultValue={initialData?.buttonText || ''}
						className={cn(
							state?.errors?.buttonText
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>
					<ErrorMessage errors={state?.errors?.buttonText} />
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='buttonLink'
						className={cn(state?.errors?.buttonLink ? 'text-destructive' : '')}
					>
						Button Link (Optional)
					</Label>
					<Input
						type='text'
						name='buttonLink'
						id='buttonLink'
						defaultValue={initialData?.buttonLink || ''}
						className={cn(
							state?.errors?.buttonLink
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>
					<ErrorMessage errors={state?.errors?.buttonLink} />
				</div>

				<PublishToggle
					defaultChecked={initialData?.published}
					label='Publish this pricing plan'
				/>
			</div>
		</form>
	);
}
