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
