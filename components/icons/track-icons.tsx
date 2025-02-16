type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
	share: (props: IconProps) => (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' {...props}>
			<path d='M 40 0 C 34.535156 0 30.078125 4.398438 30 9.84375 C 30 9.894531 30 9.949219 30 10 C 30 13.6875 31.996094 16.890625 34.96875 18.625 C 36.445313 19.488281 38.167969 20 40 20 C 45.515625 20 50 15.515625 50 10 C 50 4.484375 45.515625 0 40 0 Z M 28.0625 10.84375 L 17.84375 15.96875 C 20.222656 18.03125 21.785156 21 21.96875 24.34375 L 32.3125 19.15625 C 29.898438 17.128906 28.300781 14.175781 28.0625 10.84375 Z M 10 15 C 4.484375 15 0 19.484375 0 25 C 0 30.515625 4.484375 35 10 35 C 12.050781 35 13.941406 34.375 15.53125 33.3125 C 18.214844 31.519531 20 28.472656 20 25 C 20 21.410156 18.089844 18.265625 15.25 16.5 C 13.71875 15.546875 11.929688 15 10 15 Z M 21.96875 25.65625 C 21.785156 28.996094 20.25 31.996094 17.875 34.0625 L 28.0625 39.15625 C 28.300781 35.824219 29.871094 32.875 32.28125 30.84375 Z M 40 30 C 37.9375 30 36.03125 30.644531 34.4375 31.71875 C 31.769531 33.515625 30 36.542969 30 40 C 30 40.015625 30 40.015625 30 40.03125 C 29.957031 40.035156 29.917969 40.058594 29.875 40.0625 L 30 40.125 C 30.066406 45.582031 34.527344 50 40 50 C 45.515625 50 50 45.515625 50 40 C 50 34.484375 45.515625 30 40 30 Z' />
		</svg>
	),
	follow: (props: IconProps) => (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' {...props}>
			<path d='M 19.875 0.40625 C 16.195313 0.472656 13.507813 1.601563 11.875 3.75 C 9.941406 6.296875 9.589844 10.144531 10.8125 15.21875 C 10.363281 15.769531 10.023438 16.605469 10.15625 17.71875 C 10.421875 19.921875 11.277344 20.828125 12 21.1875 C 12.34375 22.917969 13.296875 24.863281 14.21875 25.78125 L 14.21875 26.25 C 14.226563 27.265625 14.222656 28.144531 14.125 29.28125 C 13.511719 30.6875 11.476563 31.511719 9.125 32.4375 C 5.21875 33.972656 0.363281 35.871094 0 41.9375 L -0.0625 43 L 27.09375 43 C 28.996094 47.121094 33.171875 50 38 50 C 44.617188 50 50 44.617188 50 38 C 50 31.382813 44.617188 26 38 26 C 33.890625 26 30.257813 28.058594 28.09375 31.21875 C 27.378906 30.855469 26.796875 30.460938 26.375 30 C 26.195313 29.804688 26.027344 29.570313 25.90625 29.28125 C 25.808594 28.144531 25.835938 27.261719 25.84375 26.25 L 25.84375 25.78125 C 26.738281 24.867188 27.660156 22.917969 28 21.1875 C 28.722656 20.824219 29.578125 19.921875 29.84375 17.71875 C 29.976563 16.628906 29.65625 15.800781 29.21875 15.25 C 29.800781 13.269531 30.988281 8.144531 28.9375 4.84375 C 28.078125 3.460938 26.777344 2.589844 25.0625 2.25 C 24.117188 1.058594 22.304688 0.40625 19.875 0.40625 Z M 38 28 C 43.515625 28 48 32.484375 48 38 C 48 43.515625 43.515625 48 38 48 C 32.484375 48 28 43.515625 28 38 C 28 32.484375 32.484375 28 38 28 Z M 37 32 L 37 37 L 32 37 L 32 39 L 37 39 L 37 44 L 39 44 L 39 39 L 44 39 L 44 37 L 39 37 L 39 32 Z M 26.4375 34.84375 C 26.371094 35.082031 26.300781 35.320313 26.25 35.5625 C 26.300781 35.316406 26.371094 35.082031 26.4375 34.84375 Z M 26.0625 36.875 C 26.027344 37.246094 26 37.617188 26 38 C 26 37.621094 26.027344 37.246094 26.0625 36.875 Z' />
		</svg>
	),
	unfollow: (props: IconProps) => (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 50 50'
			width='50px'
			height='50px'
			{...props}
		>
			<path d='M 19.875 0.40625 C 16.195313 0.472656 13.507813 1.601563 11.875 3.75 C 9.941406 6.296875 9.589844 10.144531 10.8125 15.21875 C 10.585938 15.496094 10.371094 15.859375 10.25 16.28125 C 10.128906 16.703125 10.089844 17.164063 10.15625 17.71875 C 10.289063 18.820313 10.570313 19.609375 10.90625 20.15625 C 10.996094 20.300781 11.09375 20.417969 11.1875 20.53125 C 11.457031 20.859375 11.730469 21.050781 12 21.1875 C 12.34375 22.917969 13.296875 24.863281 14.21875 25.78125 L 14.21875 26.25 C 14.226563 27.265625 14.222656 28.144531 14.125 29.28125 C 13.511719 30.6875 11.476563 31.511719 9.125 32.4375 C 8.636719 32.628906 8.132813 32.820313 7.625 33.03125 C 7.117188 33.242188 6.597656 33.472656 6.09375 33.71875 C 3.070313 35.191406 0.273438 37.402344 0 41.9375 L -0.0625 43 L 27.09375 43 C 28.996094 47.121094 33.171875 50 38 50 C 44.617188 50 50 44.617188 50 38 C 50 31.382813 44.617188 26 38 26 C 33.890625 26 30.257813 28.058594 28.09375 31.21875 C 27.417969 30.875 26.855469 30.523438 26.4375 30.09375 C 26.410156 30.066406 26.402344 30.027344 26.375 30 C 26.300781 29.917969 26.222656 29.84375 26.15625 29.75 C 26.144531 29.730469 26.136719 29.707031 26.125 29.6875 C 26.050781 29.578125 25.964844 29.445313 25.90625 29.3125 C 25.855469 28.730469 25.851563 28.21875 25.84375 27.71875 C 25.835938 27.238281 25.839844 26.773438 25.84375 26.28125 L 25.84375 25.78125 C 26.738281 24.867188 27.660156 22.917969 28 21.1875 C 28.453125 20.960938 28.964844 20.519531 29.34375 19.6875 C 29.417969 19.519531 29.46875 19.355469 29.53125 19.15625 C 29.660156 18.757813 29.777344 18.269531 29.84375 17.71875 C 29.875 17.445313 29.863281 17.210938 29.84375 16.96875 C 29.824219 16.726563 29.808594 16.488281 29.75 16.28125 C 29.691406 16.074219 29.589844 15.890625 29.5 15.71875 C 29.410156 15.546875 29.328125 15.386719 29.21875 15.25 C 29.800781 13.269531 30.988281 8.144531 28.9375 4.84375 C 28.078125 3.460938 26.777344 2.589844 25.0625 2.25 C 24.117188 1.058594 22.304688 0.40625 19.875 0.40625 Z M 38 28 C 43.515625 28 48 32.484375 48 38 C 48 43.515625 43.515625 48 38 48 C 32.484375 48 28 43.515625 28 38 C 28 32.484375 32.484375 28 38 28 Z M 26.4375 34.84375 C 26.371094 35.082031 26.300781 35.320313 26.25 35.5625 C 26.300781 35.316406 26.371094 35.082031 26.4375 34.84375 Z M 26.0625 36.875 C 26.027344 37.246094 26 37.617188 26 38 C 26 37.621094 26.027344 37.246094 26.0625 36.875 Z M 32 37 L 32 39 L 44 39 L 44 37 Z' />
		</svg>
	),
	heartFilled: (props: IconProps) => (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30' {...props}>
			<path d='M 9.5449219 4 C 5.9299219 4 3 6.9299219 3 10.544922 C 3 16.837321 10.298975 22.849799 13.708984 25.527344 A 2 2 0 0 0 13.71875 25.535156 C 13.742115 25.5535 13.773881 25.579629 13.796875 25.597656 L 13.798828 25.595703 A 2 2 0 0 0 15 26 A 2 2 0 0 0 16.203125 25.595703 L 16.203125 25.597656 C 16.209855 25.59238 16.219801 25.585381 16.226562 25.580078 C 16.231704 25.576045 16.23898 25.570455 16.244141 25.566406 A 2 2 0 0 0 16.263672 25.548828 C 19.663109 22.880904 27 16.852336 27 10.544922 C 27 6.9299219 24.070078 4 20.455078 4 C 17.000078 4 15 7 15 7 C 15 7 12.999922 4 9.5449219 4 z' />
		</svg>
	),
	heartOutline: (props: IconProps) => (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30' {...props}>
			<path d='M 9.5449219 3 C 5.3895807 3 2 6.3895806 2 10.544922 C 2 14.283156 4.9005496 18.084723 7.6601562 21.119141 C 10.419763 24.153558 13.171875 26.369141 13.171875 26.369141 A 1.0001 1.0001 0 0 0 13.197266 26.388672 C 13.642797 26.725148 14.201794 26.943857 14.808594 26.984375 A 1.0001 1.0001 0 0 0 15 27 A 1.0001 1.0001 0 0 0 15.189453 26.984375 A 1.0001 1.0001 0 0 0 15.199219 26.982422 C 15.802918 26.940449 16.359155 26.723674 16.802734 26.388672 A 1.0001 1.0001 0 0 0 16.828125 26.369141 C 16.828125 26.369141 19.580237 24.153558 22.339844 21.119141 C 25.099451 18.084722 28 14.283156 28 10.544922 C 28 6.3895806 24.610419 3 20.455078 3 C 17.841043 3 15.989939 4.4385487 15 5.4570312 C 14.010061 4.4385487 12.158957 3 9.5449219 3 z M 9.5449219 5 C 12.276127 5 13.937826 7.2424468 14.103516 7.4746094 A 1.0001 1.0001 0 0 0 14.994141 8.0136719 A 1.0001 1.0001 0 0 0 15.017578 8.0136719 A 1.0001 1.0001 0 0 0 15.041016 8.0117188 A 1.0001 1.0001 0 0 0 15.117188 8.0058594 A 1.0001 1.0001 0 0 0 15.892578 7.4785156 C 16.049938 7.2575052 17.716133 5 20.455078 5 C 23.529737 5 26 7.4702629 26 10.544922 C 26 13.147688 23.499768 16.870104 20.859375 19.773438 C 18.227966 22.666891 15.607768 24.780451 15.589844 24.794922 C 15.414236 24.925626 15.219097 25 15 25 C 14.780903 25 14.585764 24.92563 14.410156 24.794922 C 14.392236 24.780452 11.772034 22.666891 9.140625 19.773438 C 6.5002316 16.870105 4 13.147688 4 10.544922 C 4 7.4702629 6.470263 5 9.5449219 5 z' />
		</svg>
	),
	calendar: (props: IconProps) => (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' {...props}>
			<path d='M 12 0 C 10.90625 0 10 0.90625 10 2 L 10 4 L 4 4 C 2.839844 4 2 4.839844 2 6 L 2 13 L 48 13 L 48 6 C 48 4.839844 47.160156 4 46 4 L 40 4 L 40 2 C 40 0.90625 39.09375 0 38 0 L 36 0 C 34.90625 0 34 0.90625 34 2 L 34 4 L 16 4 L 16 2 C 16 0.90625 15.09375 0 14 0 Z M 12 2 L 14 2 L 14 8 L 12 8 Z M 36 2 L 38 2 L 38 8 L 36 8 Z M 2 15 L 2 46 C 2 47.160156 2.839844 48 4 48 L 46 48 C 47.160156 48 48 47.160156 48 46 L 48 15 Z M 12 21 L 17 21 L 17 26 L 12 26 Z M 19 21 L 24 21 L 24 26 L 19 26 Z M 26 21 L 31 21 L 31 26 L 26 26 Z M 33 21 L 38 21 L 38 26 L 33 26 Z M 12 28 L 17 28 L 17 33 L 12 33 Z M 19 28 L 24 28 L 24 33 L 19 33 Z M 26 28 L 31 28 L 31 33 L 26 33 Z M 33 28 L 38 28 L 38 33 L 33 33 Z M 12 35 L 17 35 L 17 40 L 12 40 Z M 19 35 L 24 35 L 24 40 L 19 40 Z M 26 35 L 31 35 L 31 40 L 26 40 Z M 33 35 L 38 35 L 38 40 L 33 40 Z' />
		</svg>
	),
	tag: (props: IconProps) => (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' {...props}>
			<path d='M11.586,3.586l-9,9c-0.781,0.781-0.781,2.047,0,2.828l6,6c0.781,0.781,2.047,0.781,2.828,0l9-9 C20.789,12.039,21,11.53,21,11V5c0-1.105-0.895-2-2-2h-6C12.47,3,11.961,3.211,11.586,3.586z M17.5,8C16.672,8,16,7.328,16,6.5 S16.672,5,17.5,5S19,5.672,19,6.5S18.328,8,17.5,8z' />
		</svg>
	),
	prize: (props: IconProps) => (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' {...props}>
			<path d='M 21.5 1 C 20.123 1.015 18.793297 1.7233281 18.029297 2.9863281 L 17.763672 3.4257812 C 17.385672 4.0497813 16.725094 4.4283594 15.996094 4.4433594 L 15.484375 4.4550781 C 13.270375 4.5010781 11.501078 6.270375 11.455078 8.484375 L 11.445312 8.9960938 C 11.430312 9.7240938 11.048781 10.385672 10.425781 10.763672 L 9.9863281 11.027344 C 8.0933281 12.173344 7.4466719 14.593203 8.5136719 16.533203 L 8.7597656 16.980469 C 9.1107656 17.619469 9.1107656 18.380531 8.7597656 19.019531 L 8.5136719 19.466797 C 7.4456719 21.406797 8.0932813 23.826656 9.9882812 24.972656 L 10.425781 25.236328 C 11.049781 25.614328 11.430312 26.275906 11.445312 27.003906 L 11.455078 27.515625 C 11.502078 29.730625 13.273328 31.498922 15.486328 31.544922 L 15.998047 31.556641 C 16.726047 31.570641 17.385672 31.951172 17.763672 32.576172 L 18.029297 33.011719 C 18.801297 34.289719 20.151922 35 21.544922 35 C 22.216922 35 22.90025 34.835281 23.53125 34.488281 L 23.980469 34.240234 C 24.618469 33.888234 25.380531 33.890188 26.019531 34.242188 L 26.46875 34.486328 C 28.40775 35.553328 30.825703 34.906672 31.970703 33.013672 L 32.236328 32.576172 C 32.614328 31.952172 33.274906 31.571641 34.003906 31.556641 L 34.515625 31.546875 C 36.729625 31.500875 38.498922 29.729625 38.544922 27.515625 L 38.554688 27.003906 C 38.569687 26.275906 38.951219 25.616281 39.574219 25.238281 L 40.013672 24.972656 C 41.906672 23.826656 42.553328 21.40875 41.486328 19.46875 L 41.240234 19.019531 C 40.889234 18.380531 40.889234 17.619469 41.240234 16.980469 L 41.486328 16.533203 C 42.554328 14.593203 41.906719 12.173344 40.011719 11.027344 L 39.574219 10.763672 C 38.950219 10.385672 38.569688 9.7240937 38.554688 8.9960938 L 38.544922 8.484375 C 38.497922 6.269375 36.728625 4.5010781 34.515625 4.4550781 L 34.003906 4.4433594 C 33.275906 4.4293594 32.614328 4.0488281 32.236328 3.4238281 L 31.972656 2.9882812 C 30.826656 1.0932812 28.40875 0.44767187 26.46875 1.5136719 L 26.019531 1.7597656 C 25.381531 2.1117656 24.619469 2.1117656 23.980469 1.7597656 L 23.53125 1.5136719 C 22.88525 1.1576719 22.187 0.993 21.5 1 z M 36.613281 33.142578 C 35.972281 33.386578 35.281641 33.531875 34.556641 33.546875 L 34.044922 33.556641 C 34.000922 33.557641 33.970266 33.575281 33.947266 33.613281 L 33.681641 34.050781 C 32.677641 35.710781 30.995563 36.762937 29.101562 36.960938 L 28.814453 37.619141 L 26.121094 43.773438 L 28.144531 48.400391 C 28.284531 48.721391 28.582688 48.944234 28.929688 48.990234 C 28.975687 48.996234 29.0185 49 29.0625 49 C 29.3635 49 29.65275 48.863 29.84375 48.625 L 33.544922 44 L 40.064453 44 C 40.405453 44 40.72325 43.826062 40.90625 43.539062 C 41.08925 43.252063 41.113703 42.890078 40.970703 42.580078 L 36.613281 33.142578 z M 13.439453 33.160156 L 9.09375 42.580078 C 8.95075 42.890078 8.9742031 43.250109 9.1582031 43.537109 C 9.3402031 43.825109 9.659 44 10 44 L 16.519531 44 L 20.220703 48.625 C 20.410703 48.863 20.699 49 21 49 C 21.043 49 21.086859 48.996234 21.130859 48.990234 C 21.477859 48.944234 21.776016 48.721391 21.916016 48.400391 L 26.982422 36.818359 C 26.470422 36.690359 25.972812 36.499141 25.507812 36.244141 L 25.054688 35.996094 C 25.035688 35.985094 25.016047 35.980469 24.998047 35.980469 C 24.981047 35.980469 24.966312 35.985094 24.945312 35.996094 L 24.496094 36.242188 C 23.592094 36.739187 22.570922 37.003906 21.544922 37.003906 C 19.388922 37.003906 17.435359 35.899734 16.318359 34.052734 L 16.052734 33.613281 C 16.029734 33.575281 16.000078 33.557641 15.955078 33.556641 L 15.443359 33.546875 C 14.738359 33.531875 14.065453 33.392156 13.439453 33.160156 z' />
		</svg>
	),
	datails: (props: IconProps) => (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' {...props}>
			<path d='M2.01,3L2,23l4-4h16V3H2.01z M11,7h2v2h-2V7z M11,11h2v4h-2V11z' />
		</svg>
	),
	played: (props: IconProps) => (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 50 50'
			width='50px'
			height='50px'
			{...props}
		>
			<path d='M 25 2 C 12.316406 2 2 12.316406 2 25 C 2 37.683594 12.316406 48 25 48 C 37.683594 48 48 37.683594 48 25 C 48 12.316406 37.683594 2 25 2 Z M 19 35 L 19 15 L 36 25 Z' />
		</svg>
	),
	edit: (props: IconProps) => (
		<svg
			width='31'
			height='35'
			viewBox='0 0 31 35'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<path
				d='M0 0V33.0499H14.2478L14.1096 33.5502C14.0769 33.6674 14.0752 33.7913 14.1047 33.9093C14.1342 34.0273 14.1938 34.1353 14.2774 34.2221C14.361 34.3089 14.4657 34.3715 14.5807 34.4035C14.6958 34.4355 14.817 34.4357 14.9322 34.4042L18.9755 33.3028C19.0895 33.2716 19.1934 33.2104 19.277 33.1253L29.9236 22.3157C29.9924 22.2478 30.0462 22.1658 30.0816 22.075L30.1908 21.9647C31.2697 20.8624 31.2697 19.073 30.1908 17.9706C29.1126 16.869 27.36 16.869 26.2817 17.9706L25.8105 18.4534L25.8395 18.483L24.2601 20.0968V10.0524L14.4215 0H0ZM14.1517 1.65277L22.6425 10.3281H14.1517V1.65277ZM4.71723 13.0823H19.5428V14.4594H4.71723V13.0823ZM4.71723 17.2135H19.5428V18.5906H4.71723V17.2135ZM26.7924 19.4567L28.8036 21.5115L18.9321 31.533L16.9289 29.5333L26.7924 19.4567ZM4.71723 21.3448H19.5428V22.7218H4.71723V21.3448ZM4.71723 25.476H13.4778V26.8531H4.71723V25.476ZM16.2721 30.8028L17.6962 32.2242L15.7298 32.7608L16.2721 30.8028Z'
				fill='currentColor'
			/>
		</svg>
	),
	liked: (props: IconProps) => (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 50 50'
			width='50px'
			height='50px'
			{...props}
		>
			<path d='M25,2C12.317,2,2,12.318,2,25s10.317,23,23,23s23-10.318,23-23S37.683,2,25,2z M25.5,35.8l-0.6,0.5l-0.6-0.5	C23.8,35.3,14,29,14,23.4c0-3.5,2.4-6.4,6-6.4c3,0,5,3,5,3s2-3,5-3c3.6,0,6,2.9,6,6.4C36,29,26,35.4,25.5,35.8z' />
		</svg>
	),

	profile: (props: IconProps) => (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 512 512'
			width='50px'
			height='50px'
			{...props}
		>
			<path d='M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z' />
		</svg>
	),
};
