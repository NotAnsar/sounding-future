'use client';

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
	ReactNode,
	useCallback,
} from 'react';
import { Howl } from 'howler';
import { PublicTrack as Track } from '@/db/tracks';

interface AudioContextType {
	currentTrack: Track | null;
	playlist: Track[];
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	isMuted: boolean;
	isLoop: boolean;
	toggleLoop: () => void;
	toggleMute: () => void;
	togglePlayPause: () => void;
	setVolume: (volume: number) => void;
	seek: (time: number) => void;
	playNewTrack: (tracks: Track[], index?: number) => void;
	playTrack: (
		track: Track,
		tracks?: Track[],
		variant?: 'variant1' | 'variant2' | 'variant3'
	) => void;
	nextTrack: () => void;
	previousTrack: () => void;
	setPlaylist: (tracks: Track[]) => void;
	resetAudio: () => void;
	currentVariant: 'variant1' | 'variant2' | 'variant3' | undefined;
	switchVariant: (
		variant: 'variant1' | 'variant2' | 'variant3' | undefined
	) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
	const context = useContext(AudioContext);
	if (context === undefined) {
		throw new Error('useAudio must be used within an AudioProvider');
	}
	return context;
};

interface AudioProviderProps {
	children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
	const [playlist, setPlaylist] = useState<Track[]>([]);
	const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(1);
	const soundRef = useRef<Howl | null>(null);
	const [isMuted, setIsMuted] = useState(false);
	const previousVolume = useRef(volume);
	const [isLoop, setIsLoop] = useState(false); // Initialize isLoop state
	const [currentVariant, setCurrentVariant] = useState<
		'variant1' | 'variant2' | 'variant3' | undefined
	>('variant1');

	const toggleLoop = useCallback(() => {
		setIsLoop((prev) => !prev);
	}, []);

	const toggleMute = useCallback(() => {
		if (soundRef.current) {
			if (isMuted) {
				soundRef.current.volume(previousVolume.current);
				setVolume(previousVolume.current);
			} else {
				previousVolume.current = volume;
				soundRef.current.volume(0);
				setVolume(0);
			}
			setIsMuted(!isMuted);
		}
	}, [isMuted, volume]);

	const togglePlayPause = useCallback(() => {
		if (soundRef.current) {
			if (isPlaying) {
				soundRef.current.pause();
			} else {
				soundRef.current.play();
			}
			setIsPlaying((prev) => !prev);
		}
	}, [isPlaying]);

	const handleVolumeChange = (newVolume: number) => {
		setVolume(newVolume);
		if (soundRef.current) {
			soundRef.current.volume(newVolume);
		}
	};

	const handleSeek = (seekTime: number) => {
		setCurrentTime(seekTime);
		if (soundRef.current) {
			soundRef.current.seek(seekTime);
		}
	};

	const playTrack = useCallback(
		(
			track: Track,
			tracks?: Track[],
			variant?: 'variant1' | 'variant2' | 'variant3'
		) => {
			const tracksToUse = tracks || playlist;
			let variantToUse = variant || currentVariant || 'variant1';

			if (!track) {
				setIsPlaying(false);
				setCurrentTrack(null);
				return;
			}

			if (!track[variantToUse]) {
				if (track.variant1) variantToUse = 'variant1';
				else if (track.variant2) variantToUse = 'variant2';
				else if (track.variant3) variantToUse = 'variant3';
				else {
					console.error('No valid variant found for track:', track);
					return;
				}
				setCurrentVariant(variantToUse);
			}

			// Log listening history
			fetch('/api/listening', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ trackId: track.id }),
			}).catch(() => console.error('Error logging listening history:'));

			const newSound = new Howl({
				src: [track[variantToUse]].filter(Boolean) as string[],
				html5: true,
				preload: true,
				volume: isMuted ? 0 : volume,
				onload: () => {
					setDuration(newSound.duration());
				},
				onend: () => {
					const currentIndex = tracksToUse.findIndex((t) => t.id === track.id);
					if (currentIndex === tracksToUse.length - 1) {
						if (isLoop) {
							playTrack(tracksToUse[0], tracksToUse, variantToUse);
						} else {
							setIsPlaying(false);
						}
					} else {
						const nextIndex = (currentIndex + 1) % tracksToUse.length;
						playTrack(tracksToUse[nextIndex], tracksToUse, variantToUse);
					}
				},
			});

			if (variant) {
				setCurrentVariant(variant);
			}

			setCurrentTrack(track);
			setCurrentTime(0);
			setIsPlaying(true);

			if (soundRef.current) {
				soundRef.current.unload();
			}
			soundRef.current = newSound;
			newSound.play();
		},
		[playlist, isLoop, currentVariant, isMuted, volume]
	);

	const switchVariant = useCallback(
		(variant: 'variant1' | 'variant2' | 'variant3' | undefined) => {
			if (currentTrack) {
				playTrack(currentTrack, undefined, variant);
			}
		},
		[currentTrack, playTrack]
	);

	const playNewTrack = useCallback(
		(tracks: Track[], index: number = 0) => {
			const track = tracks[index];
			let variant: 'variant1' | 'variant2' | 'variant3' | undefined =
				'variant1';
			if (track.variant2) {
				variant = 'variant2'; // Set to variant2 if it exists
			} else if (track.variant1) {
				variant = 'variant1';
			} else if (track.variant3) {
				variant = 'variant3';
			}

			setCurrentVariant(variant);
			setPlaylist(tracks);
			playTrack(track, tracks, variant);

			// Preload the next track
			if (tracks.length > 1) {
				const nextIndex = (index + 1) % tracks.length;
				new Howl({
					src: [tracks[nextIndex].variant1].filter(
						(src) => src !== null
					) as string[],
					preload: true,
				});
			}
		},
		[playTrack]
	);

	const previousTrack = useCallback(() => {
		if (playlist.length > 0 && currentTrack) {
			const currentIndex = playlist.findIndex(
				(track) => track.id === currentTrack.id
			);
			const previousIndex =
				(currentIndex - 1 + playlist.length) % playlist.length;
			playTrack(playlist[previousIndex]);
		}
	}, [playlist, currentTrack, playTrack]);

	const nextTrack = useCallback(() => {
		if (playlist.length > 0 && currentTrack) {
			const currentIndex = playlist.findIndex(
				(track) => track.id === currentTrack.id
			);
			const nextIndex = (currentIndex + 1) % playlist.length;
			playTrack(playlist[nextIndex]);
		}
	}, [playlist, currentTrack, playTrack]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (soundRef.current && isPlaying) {
				setCurrentTime(soundRef.current.seek());
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [isPlaying]);

	const resetAudio = useCallback(() => {
		if (soundRef.current) {
			soundRef.current.stop();
			soundRef.current.unload();
		}
		setCurrentTrack(null);
		setIsPlaying(false);
		setCurrentTime(0);
		setDuration(0);
	}, []);

	const value = {
		currentTrack,
		playlist,
		isPlaying,
		currentTime,
		duration,
		volume,
		isMuted,
		isLoop,
		togglePlayPause,
		setVolume: handleVolumeChange,
		seek: handleSeek,
		playTrack,
		nextTrack,
		previousTrack,
		setPlaylist,
		toggleMute,
		playNewTrack,
		toggleLoop,
		resetAudio,
		currentVariant,
		switchVariant,
	};

	return (
		<AudioContext.Provider value={value}>{children}</AudioContext.Provider>
	);
};
