'use client';
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
	ReactNode,
	useCallback,
} from 'react';

export type Track = {
	id: string;
	title: string;
	artist: string;
	genre: string;
	duration: number;
	url: string;
	cover: string;
	liked?: boolean;
};

interface AudioContextType {
	currentTrack: Track | null;
	playlist: Track[];
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	isMuted: boolean;
	toggleMute: () => void;
	togglePlayPause: () => void;
	setVolume: (volume: number) => void;
	seek: (time: number) => void;
	playNewTrack: (tracks: Track[], index?: number) => void;
	playTrack: (track: Track) => void;
	nextTrack: () => void;
	previousTrack: () => void;
	setPlaylist: (tracks: Track[]) => void;
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
	const [isMuted, setIsMuted] = useState(false);

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const animationRef = useRef<number | null>(null);

	const playTrack = useCallback((track: Track) => {
		if (!track) {
			setIsPlaying(false);
			setCurrentTrack(null);
			return;
		}

		setCurrentTrack(track);

		if (audioRef.current) {
			audioRef.current.src = track.url;
			audioRef.current.load();
			audioRef.current
				.play()
				.then(() => setIsPlaying(true))
				.catch(console.error);
		}
	}, []);

	const playNewTrack = useCallback(
		(tracks: Track[], index: number = 0) => {
			setPlaylist(tracks);
			playTrack(tracks[index]);

			// Preload next track
			if (tracks.length > 1) {
				const nextIndex = (index + 1) % tracks.length;
				const audio = new Audio();
				audio.src = tracks[nextIndex].url;
				audio.preload = 'auto';
			}
		},
		[playTrack]
	);

	const togglePlayPause = useCallback(() => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play().catch(console.error);
			}
			setIsPlaying(!isPlaying);
		}
	}, [isPlaying]);

	const seek = useCallback((time: number) => {
		if (audioRef.current) {
			audioRef.current.currentTime = time;
			setCurrentTime(time);
		}
	}, []);

	const handleVolumeChange = useCallback((newVolume: number) => {
		setVolume(newVolume);
		if (audioRef.current) {
			audioRef.current.volume = newVolume;
			if (newVolume > 0) {
				audioRef.current.muted = false;
				setIsMuted(false);
			}
		}
	}, []);

	const toggleMute = useCallback(() => {
		if (audioRef.current) {
			const newMutedState = !isMuted;
			audioRef.current.muted = newMutedState;
			setIsMuted(newMutedState);
		}
	}, [isMuted]);

	const nextTrack = useCallback(() => {
		if (playlist.length > 0 && currentTrack) {
			const currentIndex = playlist.findIndex(
				(track) => track.id === currentTrack.id
			);
			const nextIndex = (currentIndex + 1) % playlist.length;
			playTrack(playlist[nextIndex]);
		}
	}, [playlist, currentTrack, playTrack]);

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

	const whilePlaying = useCallback(() => {
		if (audioRef.current) {
			setCurrentTime(audioRef.current.currentTime);
			animationRef.current = requestAnimationFrame(whilePlaying);
		}
	}, []);

	useEffect(() => {
		const audio = audioRef.current;
		if (audio) {
			const onPlay = () => {
				setIsPlaying(true);
				animationRef.current = requestAnimationFrame(whilePlaying);
			};
			const onPause = () => {
				setIsPlaying(false);
				cancelAnimationFrame(Number(animationRef.current));
			};
			const onEnded = () => {
				nextTrack();
			};
			const onLoadedMetadata = () => {
				setDuration(audio.duration);
			};

			audio.addEventListener('play', onPlay);
			audio.addEventListener('pause', onPause);
			audio.addEventListener('ended', onEnded);
			audio.addEventListener('loadedmetadata', onLoadedMetadata);

			return () => {
				audio.removeEventListener('play', onPlay);
				audio.removeEventListener('pause', onPause);
				audio.removeEventListener('ended', onEnded);
				audio.removeEventListener('loadedmetadata', onLoadedMetadata);
				cancelAnimationFrame(Number(animationRef.current));
			};
		}
	}, [whilePlaying, nextTrack]);

	const value: AudioContextType = {
		currentTrack,
		playlist,
		isPlaying,
		currentTime,
		duration,
		volume,
		isMuted,
		togglePlayPause,
		setVolume: handleVolumeChange,
		seek,
		playTrack,
		nextTrack,
		previousTrack,
		setPlaylist,
		toggleMute,
		playNewTrack,
	};

	return (
		<AudioContext.Provider value={value}>
			<audio ref={audioRef} />
			{children}
		</AudioContext.Provider>
	);
};
