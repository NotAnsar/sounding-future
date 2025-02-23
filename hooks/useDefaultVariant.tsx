// import { useState, useEffect, useCallback } from 'react';

// export type VariantType = 'variant1' | 'variant2' | 'variant3' | undefined;

// export const isValidVariant = (variant: string | null): boolean =>
// 	variant === 'variant1' || variant === 'variant2' || variant === 'variant3';

// export const useDefaultVariant = (isAuth: boolean) => {
// 	const [defaultVariant, setDefaultVariant] = useState<VariantType>(() => {
// 		if (typeof window === 'undefined') return undefined;

// 		const stored = localStorage.getItem('defaultVariant');
// 		if (isValidVariant(stored)) return stored as VariantType;

// 		return undefined;
// 	});

// 	const updateDefaultVariant = useCallback(
// 		(newVariant: VariantType) => {
// 			if (!isAuth) {
// 				setDefaultVariant(undefined);
// 				return;
// 			}
// 			try {
// 				if (typeof window !== 'undefined') {
// 					if (newVariant) {
// 						localStorage.setItem('defaultVariant', newVariant);
// 					} else {
// 						localStorage.removeItem('defaultVariant');
// 					}
// 				}
// 				setDefaultVariant(newVariant);
// 			} catch (error) {
// 				console.error('Error updating default variant:', error);
// 			}
// 		},
// 		[isAuth]
// 	);

// 	useEffect(() => {
// 		if (!isAuth) updateDefaultVariant(undefined);
// 	}, [isAuth, updateDefaultVariant]);

// 	return {
// 		defaultVariant,
// 		setDefaultVariant: updateDefaultVariant,
// 	};
// };

import { useState, useEffect, useCallback, startTransition } from 'react';
import { useOptimistic } from 'react';
import {
	updatePreferredVariant,
	getPreferredVariant,
} from '@/actions/updateVariant';
import { toast } from './use-toast';

export type VariantType = 'variant1' | 'variant2' | 'variant3' | undefined;

export const useDefaultVariant = (
	isAuth: boolean,
	initialVariant?: VariantType
) => {
	const [defaultVariant, setDefaultVariant] =
		useState<VariantType>(initialVariant);
	const [optimisticVariant, setOptimisticVariant] = useOptimistic<
		VariantType | undefined,
		VariantType | undefined
	>(defaultVariant, (_, newVariant) => newVariant);

	useEffect(() => {
		const loadPreferredVariant = async () => {
			if (!isAuth) {
				setDefaultVariant(undefined);
				return;
			}

			try {
				const variant = await getPreferredVariant();
				setDefaultVariant(variant || undefined);
			} catch (error) {
				console.error('Failed to fetch preferred variant:', error);
				setDefaultVariant(undefined);
			}
		};

		loadPreferredVariant();
	}, [isAuth]);

	const updateDefaultVariant = useCallback(
		async (newVariant: VariantType) => {
			if (!isAuth) return;

			startTransition(() => {
				setOptimisticVariant(newVariant);
			});

			try {
				const result = await updatePreferredVariant(newVariant || null);

				toast({
					description: result.message,
					variant: result.success ? 'default' : 'destructive',
					duration: 5000,
				});

				if (result.success) {
					setDefaultVariant(newVariant);
				} else {
					setDefaultVariant(defaultVariant);
				}
			} catch (error) {
				console.error('Error updating default variant:', error);
				// Revert on error
				setDefaultVariant(defaultVariant);
			}
		},
		[isAuth, defaultVariant, setOptimisticVariant]
	);

	return {
		defaultVariant: optimisticVariant,
		setDefaultVariant: updateDefaultVariant,
	};
};
