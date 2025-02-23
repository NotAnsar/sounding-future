'use client';

import {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
	ReactNode,
	useCallback,
	useMemo,
} from 'react';
import { PublicTrack as Track } from '@/db/tracks';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import Link from 'next/link';
import { useGuestPlayCount } from '@/hooks/useGuestPlayCount';
import { useDefaultVariant, VariantType } from '@/hooks/useDefaultVariant';

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
	defaultVariant: VariantType;
	setDefaultVariant: (newVariant: VariantType) => void;
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
	const [isMuted, setIsMuted] = useState(false);
	const [isLoop, setIsLoop] = useState(false);
	const [currentVariant, setCurrentVariant] = useState<
		'variant1' | 'variant2' | 'variant3' | undefined
	>('variant1');
	const [isLoading, setIsLoading] = useState(false);
	const { guestPlayCount, incrementPlayCount } = useGuestPlayCount(isAuth);
	const { defaultVariant, setDefaultVariant } = useDefaultVariant(isAuth);
	const soundRef = useRef<HTMLAudioElement | null>(null);
	const previousVolume = useRef(volume);
	const guestPlayCountRef = useRef(guestPlayCount);

	const isPlayingRef = useRef(isPlaying);

	const isSeekingRef = useRef(false);
	const seekingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		isPlayingRef.current = isPlaying;
	}, [isPlaying]);

	useEffect(() => {
		guestPlayCountRef.current = guestPlayCount;
	}, [guestPlayCount]);

	const cleanupAudio = () => {
		if (soundRef.current) {
			soundRef.current.pause();
			soundRef.current.removeAttribute('src');
			soundRef.current.load();
		}
	};

	const toggleLoop = useCallback(() => setIsLoop((prev) => !prev), []);

	const toggleMute = useCallback(() => {
		if (soundRef.current) {
			if (isMuted) {
				soundRef.current.volume = previousVolume.current;
				setVolume(previousVolume.current);
			} else {
				previousVolume.current = volume;
				soundRef.current.volume = 0;
				setVolume(0);
			}
			setIsMuted(!isMuted);
		}
	}, [isMuted, volume]);

	const togglePlayPause = useCallback(() => {
		if (soundRef.current) {
			if (isPlaying) {
				soundRef.current.pause();
				setIsPlaying(false);
			} else {
				soundRef.current
					.play()
					.then(() => setIsPlaying(true))
					.catch(console.error);
			}
		}
	}, [isPlaying]);

	const handleVolumeChange = useCallback((newVolume: number) => {
		setVolume(newVolume);
		if (soundRef.current) {
			soundRef.current.volume = newVolume;
			setIsMuted(newVolume === 0);
		}
	}, []);

	const handleSeek = useCallback((seekTime: number) => {
		if (soundRef.current) {
			isSeekingRef.current = true;
			soundRef.current.currentTime = seekTime;
			setCurrentTime(seekTime);

			// Clear any existing timeout
			if (seekingTimeoutRef.current) {
				clearTimeout(seekingTimeoutRef.current);
			}

			// Set timeout to reset seeking state
			seekingTimeoutRef.current = setTimeout(() => {
				isSeekingRef.current = false;
			}, 100);
		}
	}, []);

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

			const isSameTrack = currentTrack?.id === track.id;
			const seekTime =
				isSameTrack && soundRef.current ? soundRef.current.currentTime : 0;
			const wasPlaying = isSameTrack ? isPlayingRef.current : true;

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
			cleanupAudio();

			const audio = new Audio();
			soundRef.current = audio;
			audio.src = track[variantToUse]!;
			audio.volume = isMuted ? 0 : volume;
			audio.preload = 'auto';

			const handleLoadedMetadata = () => {
				setDuration(audio.duration);
				setIsLoading(false);

				if (isSameTrack) {
					audio.currentTime = seekTime;
					if (wasPlaying) {
						audio.play().catch(console.error);
					} else {
						audio.pause();
					}
				}
			};

			const handlePlay = () => setIsPlaying(true);
			const handlePause = () => setIsPlaying(false);
			const handleTimeUpdate = () => {
				if (!isSeekingRef.current && soundRef.current) {
					setCurrentTime(soundRef.current.currentTime);
				}
			};
			const handleError = () => setIsLoading(false);
			const handleWaiting = () => setIsLoading(true);
			const handleCanPlay = () => setIsLoading(false);

			const handleEnded = () => {
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
			};

			// Add event listeners
			audio.addEventListener('loadedmetadata', handleLoadedMetadata);

			audio.addEventListener('timeupdate', handleTimeUpdate);

			audio.addEventListener('ended', handleEnded);
			audio.addEventListener('error', handleError);
			audio.addEventListener('waiting', handleWaiting);
			audio.addEventListener('canplay', handleCanPlay);
			audio.addEventListener('play', handlePlay);
			audio.addEventListener('pause', handlePause);

			setCurrentVariant(variantToUse);
			setCurrentTrack(track);

			if (!isSameTrack) {
				audio
					.play()
					.then(() => {
						setIsPlaying(true);
					})
					.catch((error) => {
						console.error('Play error:', error);
						setIsPlaying(false);
					});

				fetch('/api/listening', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ trackId: track.id }),
				}).catch(() => console.error('Error logging listening history'));
			}

			// Cleanup function
			return () => {
				audio.pause();
				audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
				audio.removeEventListener('timeupdate', handleTimeUpdate);
				audio.removeEventListener('ended', handleEnded);
				audio.removeEventListener('error', handleError);
				audio.removeEventListener('waiting', handleWaiting);
				audio.removeEventListener('canplay', handleCanPlay);
				audio.removeEventListener('play', handlePlay);
				audio.removeEventListener('pause', handlePause);
			};
		},
		[
			playlist,
			isLoop,
			currentVariant,
			isMuted,
			volume,
			incrementPlayCount,
			isAuth,
			currentTrack?.id,
			isPlayingRef,
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
			if (defaultVariant) {
				variant = defaultVariant;
			}

			setCurrentVariant(variant);
			setPlaylist(tracks);
			setCurrentTime(0);
			playTrack(track, tracks, variant);

			if (tracks.length > 1) {
				const nextIndex = (index + 1) % tracks.length;
				const nextTrack = tracks[nextIndex];

				if (track.variant2) {
					variant = 'variant2';
				} else if (track.variant1) {
					variant = 'variant1';
				} else if (track.variant3) {
					variant = 'variant3';
				}
				const nextVariant = nextTrack.variant2
					? 'variant2'
					: nextTrack.variant1
					? 'variant1'
					: nextTrack.variant3
					? 'variant3'
					: 'variant1';
				const preloadAudio = new Audio(nextTrack[nextVariant]!);
				preloadAudio.preload = 'auto';
			}
		},
		[playTrack, defaultVariant]
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

	const resetAudio = useCallback(() => {
		cleanupAudio();
		setCurrentTrack(null);
		setIsPlaying(false);
		setCurrentTime(0);
		setDuration(0);
	}, []);

	const value = useMemo(
		() => ({
			currentTrack,
			playlist,
			isPlaying,
			currentTime,
			duration,
			volume,
			isMuted,
			isLoop,
			isLoading,
			toggleLoop,
			toggleMute,
			togglePlayPause,
			setVolume: handleVolumeChange,
			seek: handleSeek,
			playTrack,
			nextTrack,
			previousTrack,
			setPlaylist,
			playNewTrack,
			resetAudio,
			currentVariant,
			switchVariant,
			defaultVariant,
			setDefaultVariant,
		}),
		[
			currentTrack,
			playlist,
			isPlaying,
			currentTime,
			duration,
			volume,
			isMuted,
			isLoop,
			isLoading,
			toggleLoop,
			toggleMute,
			togglePlayPause,
			handleVolumeChange,
			handleSeek,
			playTrack,
			nextTrack,
			previousTrack,
			setPlaylist,
			playNewTrack,
			resetAudio,
			currentVariant,
			switchVariant,
			defaultVariant,
			setDefaultVariant,
		]
	);

	return (
		<AudioContext.Provider value={value}>{children}</AudioContext.Provider>
	);
};
