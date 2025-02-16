export type IconProps = React.HTMLAttributes<SVGElement>;

export const MainNavIcons = {
	home: (props: IconProps) => (
		<svg
			{...props}
			viewBox='0 0 20 18'
			fill='currentColor'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M10 0C9.87978 1.54215e-05 9.76075 0.0238769 9.64981 0.070203C9.53887 0.116529 9.43822 0.1844 9.35369 0.269886L0.184659 8.2706C0.127395 8.31285 0.0808519 8.36796 0.0487785 8.43149C0.0167051 8.49502 -2.73427e-06 8.5652 3.35629e-10 8.63636C3.35629e-10 8.75692 0.0478895 8.87253 0.133133 8.95778C0.218377 9.04302 0.333993 9.09091 0.454545 9.09091H2.72727V16.3636C2.72727 16.8655 3.13455 17.2727 3.63636 17.2727H7.27273C7.77455 17.2727 8.18182 16.8655 8.18182 16.3636V10.9091H11.8182V16.3636C11.8182 16.8655 12.2255 17.2727 12.7273 17.2727H16.3636C16.8655 17.2727 17.2727 16.8655 17.2727 16.3636V9.09091H19.5455C19.666 9.09091 19.7816 9.04302 19.8669 8.95778C19.9521 8.87253 20 8.75692 20 8.63636C20 8.5652 19.9833 8.49502 19.9512 8.43149C19.9191 8.36796 19.8726 8.31285 19.8153 8.2706L10.6516 0.275213C10.6499 0.27343 10.6481 0.271655 10.6463 0.269886C10.5618 0.1844 10.4611 0.116529 10.3502 0.070203C10.2392 0.0238769 10.1202 1.54215e-05 10 0Z'
				fill='currentColor'
			/>
		</svg>
	),
	artist: (props: IconProps) => (
		<svg
			{...props}
			viewBox='0 0 20 20'
			fill='currentColor'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M10 0C4.4823 0 8.69565e-08 4.4823 0 10C0 15.2628 4.07883 19.5806 9.24338 19.9686C9.25356 19.9694 9.26374 19.9703 9.27395 19.9711C9.51409 19.9884 9.75549 20 10 20C10.2445 20 10.4859 19.9884 10.7261 19.9711C10.7363 19.9703 10.7464 19.9694 10.7566 19.9686C15.9212 19.5806 20 15.2628 20 10C20 4.4823 15.5177 0 10 0ZM10 0.869565C15.0477 0.869565 19.1304 4.95225 19.1304 10C19.1304 12.492 18.1325 14.7462 16.5175 16.3927C15.8266 15.8895 14.9727 15.5894 14.2077 15.321C13.3016 15.0036 12.4444 14.7027 12.207 14.1797C12.1696 13.7332 12.173 13.3845 12.1765 12.984L12.1773 12.8142C12.5634 12.4468 13.0489 11.6714 13.215 10.9553C13.502 10.8023 13.8528 10.4354 13.958 9.55673C14.0107 9.12064 13.8865 8.78291 13.7126 8.55639C13.9474 7.74986 14.4146 5.70811 13.5963 4.39029C13.2502 3.83333 12.728 3.48194 12.0414 3.34324C11.6558 2.86585 10.928 2.6053 9.95499 2.6053C8.4763 2.63269 7.39228 3.0856 6.73488 3.95126C5.95967 4.973 5.81319 6.51673 6.2984 8.54195C6.11884 8.76847 5.98932 9.11109 6.0428 9.55588C6.14845 10.4346 6.49803 10.8014 6.78499 10.9545C6.95107 11.6714 7.43617 12.4468 7.82269 12.8142L7.82354 12.9798C7.82702 13.382 7.83036 13.7314 7.79297 14.1797C7.55471 14.704 6.69338 15.0082 5.78295 15.3295C5.02256 15.598 4.17375 15.8986 3.48421 16.3952C1.86792 14.7486 0.869565 12.4931 0.869565 10C0.869565 4.95225 4.95225 0.869565 10 0.869565Z'
				fill='currentColor'
			/>
		</svg>
	),
	tag: (props: IconProps) => (
		<svg
			{...props}
			viewBox='0 0 19 19'
			fill='currentColor'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M9.58575 0.586L0.58575 9.586C-0.19525 10.367 -0.19525 11.633 0.58575 12.414L6.58575 18.414C7.36675 19.195 8.63275 19.195 9.41375 18.414L18.4137 9.414C18.7887 9.039 18.9998 8.53 18.9998 8V2C18.9998 0.895 18.1047 0 16.9998 0H10.9998C10.4698 0 9.96075 0.211 9.58575 0.586ZM15.4998 5C14.6718 5 13.9998 4.328 13.9998 3.5C13.9998 2.672 14.6718 2 15.4998 2C16.3277 2 16.9998 2.672 16.9998 3.5C16.9998 4.328 16.3277 5 15.4998 5Z'
				fill='currentColor'
			/>
		</svg>
	),
	star: (props: IconProps) => (
		<svg
			viewBox='0 0 20 20'
			fill='currentColor'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<path
				d='M4.09659 19.0501C4.01655 19.0501 3.93651 19.01 3.85647 18.97C3.7364 18.89 3.65636 18.6899 3.69638 18.5298L5.45731 11.9663L0.174519 7.68406C0.0144348 7.60402 -0.0255863 7.40391 0.0144348 7.24383C0.054456 7.08375 0.214541 6.96368 0.374625 6.96368L7.17822 6.60349L9.61951 0.240127C9.69955 0.120063 9.85964 0 10.0197 0C10.1798 0 10.3399 0.120063 10.3799 0.240127L12.8212 6.60349L19.6248 6.96368C19.7849 6.96368 19.945 7.08375 19.985 7.24383C20.025 7.40391 19.985 7.564 19.8649 7.68406L14.5821 11.9663L16.3431 18.5298C16.3831 18.6899 16.3431 18.85 16.183 18.97C16.0629 19.0501 15.8628 19.0901 15.7427 18.97L10.0197 15.2881L4.2967 18.97C4.21666 19.0501 4.17664 19.0501 4.09659 19.0501Z'
				fill='currentColor'
			/>
		</svg>
	),
	tracks: (props: IconProps) => (
		<svg
			viewBox='0 0 20 20'
			fill='currentColor'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<path
				d='M10 20C15.525 20 20 15.525 20 10C20 4.475 15.525 0 10 0C4.475 0 0 4.475 0 10C0 15.525 4.475 20 10 20ZM1.66667 10C1.675 9.55 2.05 9.18333 2.5 9.18333H4.16667C4.51667 9.18333 4.83333 9.40833 4.95 9.74167L5.04167 10L5.84167 4.89167C5.9 4.49167 6.23333 4.2 6.63333 4.18333C7.04167 4.14167 7.38333 4.44167 7.475 4.83333L8.94167 11.1917L10.0083 3.24167C10.0583 2.83333 10.4083 2.525 10.825 2.51667C11.2417 2.54167 11.5917 2.81667 11.6583 3.225L12.6083 9.4L13.35 5.68333C13.425 5.29167 13.7833 5.01667 14.175 5.01667C14.5833 5.025 14.9167 5.31667 14.9833 5.71667L15.7 10.0167H17.5C17.8917 10.0167 18.2167 10.2833 18.3083 10.65C18.2917 10.85 18.275 11.0417 18.2417 11.225C18.1083 11.5 17.825 11.6833 17.5 11.6833H15C14.5917 11.6833 14.2417 11.3917 14.175 10.9833L14.0917 10.475L13.3167 14.35C13.2333 14.7417 12.875 15 12.4833 15.0167C12.075 15.0083 11.7333 14.7083 11.675 14.3083L10.8917 9.21667L9.99167 15.9583C9.93333 16.3583 9.60833 16.6667 9.2 16.6833H9.16667C8.775 16.6833 8.44167 16.4167 8.35 16.0417L6.81667 9.4L6.16667 13.55C6.10833 13.925 5.8 14.2167 5.41667 14.25C5.04167 14.2917 4.68333 14.0583 4.55833 13.6917L3.575 10.85H2.5C2.04167 10.85 1.66667 10.475 1.66667 10.0167C1.66667 10.0083 1.66667 10.0083 1.66667 10Z'
				fill='currentColor'
			/>
		</svg>
	),
};

export const CollectionIcons = {
	artist: (props: IconProps) => (
		<svg
			{...props}
			viewBox='0 0 20 19'
			fill='currentColor'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M1.30435 0C0.585217 0 0 0.585217 0 1.30435V3.91304H0.434783H19.5652H20V3.04348C20 2.32435 19.4148 1.73913 18.6957 1.73913L6.97605 1.74168C6.85475 1.69776 6.60387 1.29834 6.46909 1.08356C6.13561 0.551386 5.79 0 5.21739 0H1.30435ZM0.434783 4.78261C0.195217 4.78261 0 4.97739 0 5.21739V16.9565C0 17.6757 0.585217 18.2609 1.30435 18.2609H18.6957C19.4148 18.2609 20 17.6757 20 16.9565V5.21739C20 4.97739 19.8048 4.78261 19.5652 4.78261H0.434783ZM10.6318 6.08696C10.714 6.08739 10.7889 6.13363 10.8254 6.20754L10.9868 6.53278C11.3863 6.56278 11.7403 6.72364 12.016 7.00408C12.3929 7.38755 12.6119 7.98404 12.6019 8.59969C12.5945 9.04926 12.4997 9.37924 12.3837 9.6875C12.5176 9.79402 12.6126 9.97691 12.6087 10.3643C12.543 10.9282 12.1976 11.1796 11.9302 11.267C11.8419 11.6987 11.5854 12.1645 11.3519 12.404L11.3043 12.5688V13.4129C11.4674 13.7898 11.9755 13.9358 12.5611 14.105C13.5094 14.3789 14.6892 14.7199 14.7818 16.2916C14.7852 16.3512 14.764 16.4103 14.7232 16.4538C14.6819 16.4977 14.6252 16.5217 14.5652 16.5217H5.43478C5.37478 16.5217 5.3177 16.4973 5.27683 16.4538C5.23553 16.4103 5.21433 16.3512 5.21824 16.2916C5.31085 14.7199 6.4906 14.3789 7.43886 14.105C8.02451 13.9358 8.53304 13.7894 8.69565 13.4129V12.4533C8.45087 12.2329 8.16415 11.7283 8.0698 11.267C7.80285 11.1805 7.45735 10.9329 7.393 10.3881C7.38822 9.97025 7.48592 9.78083 7.61549 9.67561C7.49636 9.32735 7.41054 8.98928 7.40489 8.49015C7.39967 8.05928 7.50154 7.4374 8.01546 6.92001C8.56937 6.36175 9.43875 6.0787 10.6318 6.08696Z'
				fill='currentColor'
			/>
		</svg>
	),
	addPlaylists: (props: IconProps) => (
		<svg
			{...props}
			viewBox='0 0 20 20'
			fill='currentColor'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M10 0C4.4775 0 0 4.4775 0 10C0 15.5225 4.4775 20 10 20C15.5225 20 20 15.5225 20 10C20 4.4775 15.5225 0 10 0ZM15 10.8333H10.8333V15C10.8333 15.46 10.46 15.8333 10 15.8333C9.54 15.8333 9.16667 15.46 9.16667 15V10.8333H5C4.54 10.8333 4.16667 10.46 4.16667 10C4.16667 9.54 4.54 9.16667 5 9.16667H9.16667V5C9.16667 4.54 9.54 4.16667 10 4.16667C10.46 4.16667 10.8333 4.54 10.8333 5V9.16667H15C15.46 9.16667 15.8333 9.54 15.8333 10C15.8333 10.46 15.46 10.8333 15 10.8333Z'
				fill='currentColor'
			/>
		</svg>
	),
	tracks: (props: IconProps) => (
		<svg
			viewBox='0 0 20 19'
			fill='currentColor'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<path
				d='M1.30435 0C0.585217 0 0 0.585217 0 1.30435V3.91304H0.434783H19.5652H20V3.04348C20 2.32435 19.4148 1.73913 18.6957 1.73913L6.97605 1.74168C6.85475 1.69776 6.60387 1.29834 6.46909 1.08356C6.13561 0.551386 5.79 0 5.21739 0H1.30435ZM0.434783 4.78261C0.194783 4.78261 0 4.97739 0 5.21739V16.9565C0 17.677 0.583913 18.2609 1.30435 18.2609H18.6957C19.4161 18.2609 20 17.677 20 16.9565V5.21739C20 4.97739 19.8052 4.78261 19.5652 4.78261H0.434783Z'
				fill='currentColor'
			/>
			<path
				d='M10.0001 16.5217C12.8827 16.5217 15.2175 14.1869 15.2175 11.3043C15.2175 8.4217 12.8827 6.08691 10.0001 6.08691C7.1175 6.08691 4.78271 8.4217 4.78271 11.3043C4.78271 14.1869 7.1175 16.5217 10.0001 16.5217ZM5.65228 11.3043C5.65663 11.0695 5.85228 10.8782 6.08706 10.8782H6.95663C7.13924 10.8782 7.30445 10.9956 7.36532 11.1695L7.41315 11.3043L7.83054 8.63909C7.86098 8.43039 8.03489 8.27822 8.24358 8.26952C8.45663 8.24778 8.63489 8.40431 8.68272 8.60865L9.44793 11.926L10.0045 7.77822C10.0305 7.56517 10.2132 7.40431 10.4305 7.39996C10.6479 7.413 10.8305 7.55648 10.8653 7.76952L11.361 10.9913L11.7479 9.05213C11.7871 8.84778 11.974 8.70431 12.1784 8.70431C12.3914 8.70865 12.5653 8.86083 12.6001 9.06952L12.974 11.313H13.9131C14.1175 11.313 14.2871 11.4521 14.3349 11.6434C14.3262 11.7478 14.3175 11.8478 14.3001 11.9434C14.2305 12.0869 14.0827 12.1826 13.9131 12.1826H12.6088C12.3958 12.1826 12.2131 12.0304 12.1784 11.8173L12.1349 11.5521L11.7305 13.5739C11.6871 13.7782 11.5001 13.913 11.2958 13.9217C11.0827 13.9173 10.9045 13.7608 10.874 13.5521L10.4653 10.8956L9.99576 14.413C9.96532 14.6217 9.79576 14.7826 9.58272 14.7913H9.56532C9.36098 14.7913 9.18706 14.6521 9.13924 14.4565L8.33924 10.9913L8.00011 13.1565C7.96967 13.3521 7.8088 13.5043 7.6088 13.5217C7.41315 13.5434 7.22619 13.4217 7.16098 13.2304L6.64793 11.7478H6.08706C5.84793 11.7478 5.65228 11.5521 5.65228 11.313C5.65228 11.3087 5.65228 11.3087 5.65228 11.3043Z'
				fill='hsl(var(--background))'
				className='item'
			/>
		</svg>
	),
	playlists: (props: IconProps) => (
		<svg
			{...props}
			viewBox='0 0 20 19'
			fill='currentColor'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M1.30435 0C0.585217 0 0 0.585217 0 1.30435V3.91304H0.434783H19.5652H20V3.04348C20 2.32435 19.4148 1.73913 18.6957 1.73913L6.97605 1.74168C6.85475 1.69776 6.60387 1.29834 6.46909 1.08356C6.13561 0.551386 5.79 0 5.21739 0H1.30435ZM0.434783 4.78261C0.194783 4.78261 0 4.97739 0 5.21739V16.9565C0 17.677 0.583913 18.2609 1.30435 18.2609H18.6957C19.4161 18.2609 20 17.677 20 16.9565V5.21739C20 4.97739 19.8052 4.78261 19.5652 4.78261H0.434783Z'
				fill='currentColor'
			/>
			<path
				d='M5.25225 6.95654C4.75503 6.95654 4.3479 7.36368 4.3479 7.86089C4.3479 8.35811 4.75503 8.76524 5.25225 8.76524C5.74946 8.76524 6.1566 8.35811 6.1566 7.86089C6.1566 7.36368 5.74946 6.95654 5.25225 6.95654ZM7.06094 7.40872V8.31306H15.6522V7.40872H7.06094ZM5.25225 10.8C4.75503 10.8 4.3479 11.2072 4.3479 11.7044C4.3479 12.2016 4.75503 12.6087 5.25225 12.6087C5.74946 12.6087 6.1566 12.2016 6.1566 11.7044C6.1566 11.2072 5.74946 10.8 5.25225 10.8ZM7.06094 11.2522V12.1565H15.6522V11.2522H7.06094ZM5.25225 14.6435C4.75503 14.6435 4.3479 15.0506 4.3479 15.5478C4.3479 16.0451 4.75503 16.4522 5.25225 16.4522C5.74946 16.4522 6.1566 16.0451 6.1566 15.5478C6.1566 15.0506 5.74946 14.6435 5.25225 14.6435ZM7.06094 15.0957V16H15.6522V15.0957H7.06094Z'
				fill='hsl(var(--background))'
			/>
		</svg>
	),
};

export const mainNav = [
	{ title: 'Home', icon: MainNavIcons.home, path: '/' },
	{ title: 'Tracks', icon: MainNavIcons.tracks, path: '/tracks' },
	{ title: 'Genres', icon: MainNavIcons.tag, path: '/genres' },
	{ title: 'Curated', icon: MainNavIcons.star, path: '/curated' },
	{ title: 'Artists', icon: MainNavIcons.artist, path: '/artists' },
];

export const collection = [
	{
		title: 'Artists',
		icon: CollectionIcons.artist,
		path: '/collection/artists',
	},
	{
		title: 'Tracks',
		icon: CollectionIcons.tracks,
		path: '/collection/tracks',
	},

	// {
	// 	title: 'Playlists',
	// 	icon: CollectionIcons.playlists,
	// 	path: '/collection/playlists',
	// },
	// {
	// 	title: 'Add Playlist',
	// 	icon: CollectionIcons.addPlaylists,
	// 	path: '/collection/playlists/new',
	// },
];
