'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export default function UploadTrackForm() {
	const [step, setStep] = useState(1);

	const prevStep = () => {
		if (step > 1 && step <= 3) {
			setStep((prevStep) => prevStep - 1);
		}
	};

	const nextStep = () => {
		setStep((prevStep) => prevStep + 1);
	};

	return (
		<div>
			<p>{step}</p>

			{step > 1 && (
				<Button type='button' variant='outline' onClick={prevStep}>
					Précédent
				</Button>
			)}

			<Button
				type='button'
				onClick={nextStep}
				className={cn(step < 3 ? 'block' : 'hidden')}
			>
				Suivant
			</Button>
		</div>
	);
}
