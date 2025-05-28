import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const formatTime = (time: number): string => {
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60);
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export function convertDateFormat(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function formatTimestamp(
	timestamp: string,
	showTime: boolean = false
): string {
	const dateObj = new Date(timestamp);

	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	let formattedDate = `
	${dateObj.getDate().toString().padStart(2, '0')} ${
		months[dateObj.getMonth()]
	} ${dateObj.getFullYear()}
	`;

	if (showTime) {
		const hours = dateObj.getHours().toString().padStart(2, '0');
		const minutes = dateObj.getMinutes().toString().padStart(2, '0');
		formattedDate += ` ${hours}:${minutes}`;
	}

	return formattedDate;
}

export function formatCourseDuration(seconds: number): string {
	if (seconds < 60) {
		return `${seconds} second${seconds !== 1 ? 's' : ''}`;
	}

	if (seconds < 3600) {
		const minutes = Math.floor(seconds / 60);
		return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
	}

	const hours = Math.floor(seconds / 3600);
	return `${hours} hour${hours !== 1 ? 's' : ''}`;
}
