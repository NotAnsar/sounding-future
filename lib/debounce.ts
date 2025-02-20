export function debounce<F extends (...args: never[]) => void>(
	func: F,
	wait: number
) {
	let timeout: NodeJS.Timeout | null = null;

	const debounced = (...args: Parameters<F>) => {
		const later = () => {
			timeout = null;
			func(...args);
		};

		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};

	debounced.cancel = () => {
		if (timeout) clearTimeout(timeout);
		timeout = null;
	};

	return debounced;
}
