import { useAudio } from '@/context/AudioContext';
import { useEffect } from 'react';

export const useAudioKeyboardControls = () => {
	const { togglePlayPause, toggleMute, nextTrack, previousTrack } = useAudio();

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			// Function to check if target is an input-like element
			const isInputLike = (target: EventTarget | null): boolean => {
				if (!(target instanceof HTMLElement)) return false;
				return (
					target.tagName === 'INPUT' ||
					target.tagName === 'TEXTAREA' ||
					target.isContentEditable ||
					target.tagName === 'SELECT'
				);
			};

			// If target or any of its parents is input-like, don't handle the event
			let currentElement: EventTarget | null | ParentNode = event.target;
			while (currentElement instanceof Node) {
				if (isInputLike(currentElement)) return;
				currentElement = currentElement.parentNode;
			}

			// Handle space key press
			if (event.code === 'Space' || event.code === 'MediaPlayPause') {
				event.preventDefault(); // Prevent scrolling
				togglePlayPause();
			} else if (event.key.toLowerCase() === 'm') {
				event.preventDefault();
				toggleMute();
			} else if (event.key === 'MediaTrackNext') {
				event.preventDefault();
				nextTrack();
			} else if (event.key === 'MediaTrackPrevious') {
				event.preventDefault();
				previousTrack();
			}
		};

		// Use both keydown and keypress for maximum compatibility
		window.addEventListener('keydown', handleKeyPress, { capture: true });
		window.addEventListener('keypress', handleKeyPress, { capture: true });

		return () => {
			window.removeEventListener('keydown', handleKeyPress, { capture: true });
			window.removeEventListener('keypress', handleKeyPress, { capture: true });
		};
	}, [togglePlayPause, toggleMute, nextTrack, previousTrack]);
};
