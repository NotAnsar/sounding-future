import { useAudio } from '@/context/AudioContext';
import { useEffect } from 'react';

export const useAudioKeyboardControls = () => {
	const { togglePlayPause, toggleMute, nextTrack, previousTrack } = useAudio();

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (
				event.target instanceof HTMLElement &&
				event.target.tagName === 'INPUT'
			) {
				return; // Don't handle keypresses when focus is on input elements
			}

			if (event.key === ' ' && event.target === document.body) {
				event.preventDefault();
				togglePlayPause();
			} else if (event.key === 'm' && event.target === document.body) {
				event.preventDefault();
				toggleMute();
			} else if (
				event.key === 'MediaTrackNext' &&
				event.target === document.body
			) {
				event.preventDefault();
				nextTrack();
			} else if (
				event.key === 'MediaTrackPrevious' &&
				event.target === document.body
			) {
				event.preventDefault();
				previousTrack();
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [togglePlayPause, toggleMute, nextTrack, previousTrack]);
};
