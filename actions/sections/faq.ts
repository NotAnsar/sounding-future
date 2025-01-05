'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface FaqInput {
	question: string;
	answer: string;
	link?: string;
}

export async function getFaqs() {
	try {
		const faqs = await prisma.fAQ.findMany({
			orderBy: { displayOrder: 'asc' },
		});

		return { data: faqs };
	} catch (error) {
		console.error('Error fetching FAQs:', error);
		return { data: [], error: 'Failed to fetch FAQs' };
	}
}

export async function createFaq(data: FaqInput) {
	try {
		const faq = await prisma.fAQ.create({
			data: {
				question: data.question,
				answer: data.answer,
				link: data.link,
			},
		});

		revalidatePath('/');
		return faq;
	} catch (error) {
		console.error('Error creating FAQ:', error);
		throw new Error('Failed to create FAQ');
	}
}

export async function updateFaq(id: string, data: FaqInput) {
	try {
		const faq = await prisma.fAQ.update({
			where: { id },
			data: {
				question: data.question,
				answer: data.answer,
				link: data.link,
			},
		});

		revalidatePath('/');
		return faq;
	} catch (error) {
		console.error('Error updating FAQ:', error);
		throw new Error('Failed to update FAQ');
	}
}

export async function deleteFaq(id: string) {
	try {
		await prisma.fAQ.delete({
			where: { id },
		});

		revalidatePath('/');
		return true;
	} catch (error) {
		console.error('Error deleting FAQ:', error);
		throw new Error('Failed to delete FAQ');
	}
}

interface OrderUpdate {
	id: string;
	displayOrder: number;
}

export async function updateFaqOrder(updates: OrderUpdate[]) {
	try {
		await prisma.$transaction(
			updates.map((update) =>
				prisma.fAQ.update({
					where: { id: update.id },
					data: { displayOrder: update.displayOrder },
				})
			)
		);

		revalidatePath('/');
		return true;
	} catch (error) {
		console.error('Error updating FAQ order:', error);
		throw new Error('Failed to update FAQ order');
	}
}
