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
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import Link from 'next/link';
import { useGuestPlayCount } from '@/hooks/useGuestPlayCount';

interface AudioContextType {
	currentTrack: Track | null;
	playlist: Track[];
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	isMuted: boolean;
	isLoop: boolean;
	isLoading: boolean;
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
	isAuth?: boolean;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({
	children,
	isAuth = false,
}) => {
	const [playlist, setPlaylist] = useState<Track[]>([]);
	const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolume] = useState(1);
	const soundRef = useRef<Howl | null>(null);
	const [isMuted, setIsMuted] = useState(false);
	const previousVolume = useRef(volume);
	const [isLoop, setIsLoop] = useState(false);
	const [currentVariant, setCurrentVariant] = useState<
		'variant1' | 'variant2' | 'variant3' | undefined
	>('variant1');
	const [isLoading, setIsLoading] = useState(false); // Add loading state
	const { guestPlayCount, incrementPlayCount } = useGuestPlayCount(isAuth);

	// Ref to track the latest guest play count
	const guestPlayCountRef = useRef(guestPlayCount);
	useEffect(() => {
		guestPlayCountRef.current = guestPlayCount;
	}, [guestPlayCount]);
	useEffect(() => {
		const interval = setInterval(() => {
			if (soundRef.current && isPlaying && !isLoading) {
				setCurrentTime(soundRef.current.seek());
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [isPlaying, isLoading]); // Add isLoading to dependencies

	const toggleLoop = useCallback(() => setIsLoop((prev) => !prev), []);

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

			// Check if it's the same track (variant switch)
			const isSameTrack = currentTrack?.id === track.id;

			// Capture current time and playing state if same track
			const seekTime =
				isSameTrack && soundRef.current
					? (soundRef.current.seek() as number)
					: 0;
			const wasPlaying = isSameTrack ? isPlaying : true;

			// Immediately update UI with previous time for variant switches
			if (isSameTrack) {
				setCurrentTime(seekTime);
			}

			// Check guest play count
			if (!isAuth && guestPlayCountRef.current >= 3) {
				toast({
					title: 'Sign up for free to continue listening',
					description:
						'You have reached the maximum play count as a guest. Sign up for free to continue listening.',
					variant: 'default',
					action: (
						<Link href={'/login'}>
							<ToastAction altText='Login'>Login</ToastAction>
						</Link>
					),
				});
				return;
			}

			// Handle variant fallback
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

			if (!isAuth && !isSameTrack) {
				incrementPlayCount();
			}

			setIsLoading(true);

			// Create new Howl instance
			const newSound = new Howl({
				src: [track[variantToUse]].filter(Boolean) as string[],
				html5: true,
				preload: true,
				volume: isMuted ? 0 : volume,
				onload: function (this: Howl) {
					setIsLoading(false);
					setDuration(this.duration());

					// Handle seek and playback continuation
					if (isSameTrack) {
						this.seek(seekTime);
						if (wasPlaying) {
							this.play();
							setIsPlaying(true);
						}
					}
				},
				onloaderror: (_, error) => {
					setIsLoading(false);
					console.error('Error loading audio:', error);
				},
				onend: () => {
					// Handle track ending
					if (!isAuth && guestPlayCountRef.current >= 3) {
						setIsPlaying(false);
						return;
					}

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

			// Update current variant state
			if (variant) {
				setCurrentVariant(variant);
			}

			// Update track state
			setCurrentTrack(track);

			// Cleanup previous sound
			if (soundRef.current) {
				soundRef.current.unload();
			}
			soundRef.current = newSound;

			// Start playback for new tracks
			if (!isSameTrack) {
				newSound.play();
				setIsPlaying(true);
			}

			// Log listening history (only for new track plays)
			if (!isSameTrack) {
				fetch('/api/listening', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ trackId: track.id }),
				}).catch(() => console.error('Error logging listening history'));
			}
		},
		[
			playlist,
			isLoop,
			currentVariant,
			isMuted,
			volume,
			incrementPlayCount, // Added back to dependencies
			isAuth,
			currentTrack?.id,
			isPlaying,
		]
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
				variant = 'variant2';
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
		isLoading,
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
