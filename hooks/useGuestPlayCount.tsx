import { useState, useEffect, useCallback } from 'react';

export const useGuestPlayCount = (isAuth: boolean) => {
	const [guestPlayCount, setGuestPlayCount] = useState(() => {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem('guestPlayCount');
			return stored ? parseInt(stored, 10) : 0;
		}
		return 0;
	});

	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('guestPlayCount', guestPlayCount.toString());
		}
	}, [guestPlayCount]);

	useEffect(() => {
		if (isAuth) {
			localStorage.removeItem('guestPlayCount');
			setGuestPlayCount(0);
		}
	}, [isAuth]);

	const incrementPlayCount = useCallback(() => {
		if (!isAuth) {
			setGuestPlayCount((prev) => prev + 1);
		}
	}, [isAuth]); // Only depends on isAuth

	return {
		guestPlayCount,
		incrementPlayCount,
	};
};
