import { useState, useEffect, useCallback } from 'react';

export type VariantType = 'variant1' | 'variant2' | 'variant3' | undefined;

const isValidVariant = (variant: string | null): boolean =>
	variant === 'variant1' || variant === 'variant2' || variant === 'variant3';

export const useDefaultVariant = (isAuth: boolean) => {
	const [defaultVariant, setDefaultVariant] = useState<VariantType>(() => {
		if (typeof window === 'undefined') return undefined;

		const stored = localStorage.getItem('defaultVariant');
		if (isValidVariant(stored)) return stored as VariantType;

		return undefined;
	});

	const updateDefaultVariant = useCallback(
		(newVariant: VariantType) => {
			if (!isAuth) {
				setDefaultVariant(undefined);
				return;
			}
			try {
				if (typeof window !== 'undefined') {
					if (newVariant) {
						localStorage.setItem('defaultVariant', newVariant);
					} else {
						localStorage.removeItem('defaultVariant');
					}
				}
				setDefaultVariant(newVariant);
			} catch (error) {
				console.error('Error updating default variant:', error);
			}
		},
		[isAuth]
	);

	useEffect(() => {
		if (!isAuth) updateDefaultVariant(undefined);
	}, [isAuth, updateDefaultVariant]);

	return {
		defaultVariant,
		setDefaultVariant: updateDefaultVariant,
	};
};
