'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface PricingPlanInput {
	name: string;
	description: string;
	priceAmount: number;
	priceCurrency: string;
	pricePeriod: string;
	published?: boolean;
	pageId: string;
	buttonText?: string;
	buttonLink?: string;
}

interface PricingPlanSectionInput {
	title: string;
	planId: string;
	features: string[];
}

interface OrderUpdate {
	id: string;
	displayOrder: number;
}

export async function getPricingPlans(pageId: string) {
	try {
		const plans = await prisma.pricingPlan.findMany({
			where: { pageId },
			orderBy: { displayOrder: 'asc' },
			include: {
				sections: {
					orderBy: { order: 'asc' },
				},
			},
		});

		return { data: plans };
	} catch (error) {
		console.error('Error fetching pricing plans:', error);
		return { data: [], error: 'Failed to fetch pricing plans' };
	}
}

export async function createPricingPlan(data: PricingPlanInput) {
	try {
		const plan = await prisma.pricingPlan.create({
			data: {
				name: data.name,
				description: data.description,
				priceAmount: data.priceAmount,
				priceCurrency: data.priceCurrency,
				pricePeriod: data.pricePeriod,
				published: data.published || false,
				pageId: data.pageId,
				buttonText: data.buttonText,
				buttonLink: data.buttonLink,
			},
		});

		revalidatePath('/admin/pricing');
		return plan;
	} catch (error) {
		console.error('Error creating pricing plan:', error);
		throw new Error('Failed to create pricing plan');
	}
}

export async function updatePricingPlan(id: string, data: PricingPlanInput) {
	try {
		const plan = await prisma.pricingPlan.update({
			where: { id },
			data: {
				name: data.name,
				description: data.description,
				priceAmount: data.priceAmount,
				priceCurrency: data.priceCurrency,
				pricePeriod: data.pricePeriod,
				published: data.published,
				pageId: data.pageId,
				buttonText: data.buttonText,
				buttonLink: data.buttonLink,
			},
		});

		revalidatePath('/admin/pricing');
		return plan;
	} catch (error) {
		console.error('Error updating pricing plan:', error);
		throw new Error('Failed to update pricing plan');
	}
}

export async function deletePricingPlan(id: string) {
	try {
		await prisma.pricingPlan.delete({
			where: { id },
		});

		revalidatePath('/admin/pricing');
		return true;
	} catch (error) {
		console.error('Error deleting pricing plan:', error);
		throw new Error('Failed to delete pricing plan');
	}
}

export async function updatePricingPlanOrder(updates: OrderUpdate[]) {
	try {
		await prisma.$transaction(
			updates.map((update) =>
				prisma.pricingPlan.update({
					where: { id: update.id },
					data: { displayOrder: update.displayOrder },
				})
			)
		);

		revalidatePath('/admin/pricing');
		return true;
	} catch (error) {
		console.error('Error updating pricing plan order:', error);
		throw new Error('Failed to update pricing plan order');
	}
}

export async function createPricingPlanSection(data: PricingPlanSectionInput) {
	try {
		const section = await prisma.pricingPlanSection.create({
			data: {
				title: data.title,
				planId: data.planId,
				features: data.features,
			},
		});

		revalidatePath('/admin/pricing');
		return section;
	} catch (error) {
		console.error('Error creating pricing plan section:', error);
		throw new Error('Failed to create pricing plan section');
	}
}

export async function deletePricingPlanSection(id: string) {
	try {
		await prisma.pricingPlanSection.delete({
			where: { id },
		});

		revalidatePath('/admin/pricing');
		return true;
	} catch (error) {
		console.error('Error deleting pricing plan section:', error);
		throw new Error('Failed to delete pricing plan section');
	}
}
