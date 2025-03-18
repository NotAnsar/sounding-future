'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils/utils';
import { redirect } from 'next/navigation';

const featureSchema = z.string().min(1, "Feature can't be empty").trim();

// Schema for a pricing section
const sectionSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(1, 'Section title is required').trim(),
	features: z.array(featureSchema).min(1, 'At least one feature is required'),
});

// Main form schema
const pricingPlanSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters').trim(),
	description: z.string().min(2, 'Description is required').trim(),
	priceAmount: z.coerce.number().nonnegative('Price must be 0 or greater'),
	priceCurrency: z.string().min(1, 'Currency symbol is required').trim(),
	pricePeriod: z.string().min(1, 'Period is required').trim(),
	pageId: z.string(),
	buttonText: z.string().optional(),
	// buttonLink: z.string().url('Must be a valid URL').optional(),
	buttonLink: z
		.union([
			z.string().url('Must be a valid URL'),
			z.string().max(0), // Empty string
		])
		.optional(),
	published: z.boolean().default(false),
	sections: z.array(sectionSchema),
});

type PricingPlanData = z.infer<typeof pricingPlanSchema>;

// export type PricingPlanState = State<PricingPlanData>;

export type PricingPlanState = State<PricingPlanData> & {
	errors?: Record<string, string[]>;
};

export async function createPricingPlan(
	prevState: PricingPlanState,
	formData: FormData
): Promise<PricingPlanState> {
	// Parse and extract sections data from form data
	const sectionsData = [];
	let i = 0;
	while (formData.has(`section-${i}-title`)) {
		const title = formData.get(`section-${i}-title`) as string;
		const features = [];

		let j = 0;
		while (formData.has(`section-${i}-feature-${j}`)) {
			const feature = formData.get(`section-${i}-feature-${j}`) as string;
			if (feature.trim()) {
				features.push(feature);
			}
			j++;
		}

		sectionsData.push({
			title,
			features,
		});
		i++;
	}

	// Validate form data
	const validatedFields = pricingPlanSchema.safeParse({
		name: formData.get('name'),
		description: formData.get('description'),
		priceAmount: formData.get('priceAmount'),
		priceCurrency: formData.get('priceCurrency'),
		pricePeriod: formData.get('pricePeriod'),
		pageId: formData.get('pageId') || '1',
		buttonText: formData.get('buttonText'),
		buttonLink: formData.get('buttonLink') || undefined,
		published: formData.get('published') === 'true',
		sections: sectionsData,
	});

	console.log(formData.get('buttonLink'));

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid data. Unable to create pricing plan.',
		};
	}

	try {
		const { sections, ...planData } = validatedFields.data;

		// Create the pricing plan
		const plan = await prisma.pricingPlan.create({
			data: planData,
		});

		// Create the sections for this plan
		if (sections && sections.length > 0) {
			await Promise.all(
				sections.map(async (section, index) => {
					await prisma.pricingPlanSection.create({
						data: {
							title: section.title,
							planId: plan.id,
							order: index + 1,
							features: section.features,
						},
					});
				})
			);
		}

		revalidatePath('/user/sections/pricing');
	} catch (error) {
		console.error('Error creating pricing plan:', error);
		return { message: 'Failed to create pricing plan' };
	}

	redirect('/user/sections/support-us');
}

export async function updatePricingPlan(
	id: string,
	prevState: PricingPlanState,
	formData: FormData
): Promise<PricingPlanState> {
	// Parse sections data similar to create function
	const sectionsData = [];
	let i = 0;
	while (formData.has(`section-${i}-title`)) {
		const sectionId = formData.get(`section-${i}-id`) as string;
		const title = formData.get(`section-${i}-title`) as string;
		const features = [];

		let j = 0;
		while (formData.has(`section-${i}-feature-${j}`)) {
			const feature = formData.get(`section-${i}-feature-${j}`) as string;
			if (feature.trim()) {
				features.push(feature);
			}
			j++;
		}

		sectionsData.push({
			id: sectionId || undefined,
			title,
			features,
		});
		i++;
	}

	// Validate form data
	const validatedFields = pricingPlanSchema.safeParse({
		name: formData.get('name'),
		description: formData.get('description'),
		priceAmount: formData.get('priceAmount'),
		priceCurrency: formData.get('priceCurrency'),
		pricePeriod: formData.get('pricePeriod'),
		pageId: formData.get('pageId') || '1',
		buttonText: formData.get('buttonText'),
		buttonLink: formData.get('buttonLink'),
		published: formData.get('published') === 'true',
		sections: sectionsData,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Invalid data. Unable to update pricing plan.',
		};
	}

	try {
		const { sections, ...planData } = validatedFields.data;

		// Update the plan
		await prisma.pricingPlan.update({
			where: { id },
			data: planData,
		});

		// Get existing sections
		const existingSections = await prisma.pricingPlanSection.findMany({
			where: { planId: id },
		});

		// Identify sections to update or delete
		const sectionsToUpdate = sections.filter((section) => section.id);
		const sectionsToCreate = sections.filter((section) => !section.id);
		const sectionIdsToKeep = new Set(
			sectionsToUpdate.map((section) => section.id)
		);
		const sectionsToDelete = existingSections.filter(
			(section) => !sectionIdsToKeep.has(section.id)
		);

		// Delete sections that are no longer present
		if (sectionsToDelete.length > 0) {
			await Promise.all(
				sectionsToDelete.map((section) =>
					prisma.pricingPlanSection.delete({
						where: { id: section.id },
					})
				)
			);
		}

		// Update existing sections
		await Promise.all(
			sectionsToUpdate.map(async (section, index) => {
				await prisma.pricingPlanSection.update({
					where: { id: section.id },
					data: {
						title: section.title,
						order: index + 1,
						features: section.features,
					},
				});
			})
		);

		// Create new sections
		await Promise.all(
			sectionsToCreate.map(async (section, index) => {
				await prisma.pricingPlanSection.create({
					data: {
						title: section.title,
						planId: id,
						order: sectionsToUpdate.length + index + 1,
						features: section.features,
					},
				});
			})
		);

		revalidatePath('/user/sections/pricing');
	} catch (error) {
		console.error('Error updating pricing plan:', error);
		return { message: 'Failed to update pricing plan' };
	}

	redirect('/user/sections/support-us');
}

export async function deletePricingPlan(id: string) {
	try {
		// Delete the pricing plan (sections will cascade delete)
		await prisma.pricingPlan.delete({
			where: { id },
		});

		revalidatePath('/user/sections/pricing');
		return { success: true, message: 'Pricing plan deleted successfully' };
	} catch (error) {
		console.error('Delete error:', error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				success: false,
				message: 'Pricing plan not found or cannot be deleted',
			};
		}

		return { success: false, message: 'Failed to delete pricing plan' };
	}
}

export async function updatePricingPlanOrder(
	updates: { id: string; displayOrder: number }[]
) {
	try {
		await prisma.$transaction(
			updates.map((update) =>
				prisma.pricingPlan.update({
					where: { id: update.id },
					data: { displayOrder: update.displayOrder },
				})
			)
		);

		revalidatePath('/user/sections/pricing');
		return { success: true };
	} catch (error) {
		console.error('Failed to reorder pricing plans:', error);
		return { success: false, error: 'Failed to reorder pricing plans' };
	}
}
