type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
	play: (props: IconProps) => (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' {...props}>
			<path d='M 25 2 C 12.316406 2 2 12.316406 2 25 C 2 37.683594 12.316406 48 25 48 C 37.683594 48 48 37.683594 48 25 C 48 12.316406 37.683594 2 25 2 Z M 19 35 L 19 15 L 36 25 Z' />
		</svg>
	),
	shuffle: (props: IconProps) => (
		<svg
			viewBox='0 0 38 42'
			fill='currentColor'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<path
				d='M24.5938 0.59375L19.5938 5.59375L18.1562 7L19.5938 8.40625L24.5938 13.4062L27.4062 10.5938L25.8125 9H33C33.5781 9 34 9.42188 34 10V32C34 32.5781 33.5781 33 33 33H21V37H33C35.7383 37 38 34.7383 38 32V10C38 7.26172 35.7383 5 33 5H25.8125L27.4062 3.40625L24.5938 0.59375ZM5 5C2.26172 5 0 7.26172 0 10V32C0 34.7383 2.26172 37 5 37H12.1875L10.5938 38.5938L13.4062 41.4062L18.4062 36.4062L19.8438 35L18.4062 33.5938L13.4062 28.5938L10.5938 31.4062L12.1875 33H5C4.42188 33 4 32.5781 4 32V10C4 9.42188 4.42188 9 5 9H17V5H5Z'
				fill='currentColor'
			/>
		</svg>
	),
	speaker: (props: IconProps) => (
		<svg
			viewBox='0 0 27 27'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			xmlnsXlink='http://www.w3.org/1999/xlink'
			{...props}
		>
			<rect width='27' height='27' fill='url(#pattern0_4486_419)' />
			<defs>
				<pattern
					id='pattern0_4486_419'
					patternContentUnits='objectBoundingBox'
					width='1'
					height='1'
				>
					<use xlinkHref='#image0_4486_419' transform='scale(0.0104167)' />
				</pattern>
				<image
					id='image0_4486_419'
					width='96'
					height='96'
					xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFPUlEQVR4nO2dW6weUxTHl56SVA+9uLwQd5XQQ1KpSFxaJBLCE4lITl+kPAkJoSkijVvdEmniTSMekZbywBuRlgdSSioSkTiK8OCQ1rWt5icr2eXLSc1ae2a+mdkz+/c8a+01//V9M3uvfRmRTCaTyWQymUwmk8lkMplMJgGADY5rngDWACuByWYiG4j4AI7rRjkIfAA8DlwNTDQTbU/FVxzXFvED8BywopnIeya+4rjeyw7gRuCoZu6kB+IrDptYdgHXNHNHiYuvOOzK8jpwVjN3l6j4isO2Cn8Ad8uQoUD8BhJwmG3AUhkaGOI7E/Aw8BrwbcUkfAksk6GAQ3xPAub4PB+4F9hZMgmzwCrpOzjFj03AnDaWA5uB/ZFJ+F0HcdJXiBC/SgJG2js1JOJQZBJWy9DFV2pse0Xko2kfMCVDFl+pOYajgcci/g1fAyfJUMVXxhTPDcBefLyXdFGPCuKPKwEjL2kt1nlYL0MUX3G0od3Oc0rGt8w5ftCe1EUyNPEVRzuH+Rx4EFgUGecFwC/YfATMkyGJrzjamsvPwEPA8RHxXhUmcyzWSM/E325d4Gjv/9gDXBER93pHvPq4OlZ6JP7kGBOg/B1qRWYvRh8vwLuOuO+SHoi/Azgu2BXiaNfDK84knAv86RgbzJfUf/nyn20hjra9bPZMR4ZVFhY3Sx/EVywDMSCOJx3+ljh6RW9LXdAc24+0bscycsT/a0QMhzxFNuARw88B4MQqursFGKf4imUoBtrd1GlF4CdnLDPWWAE4xdEtvUPqgBbFVyxjcaJFszDR7uFphz+dpiziTW9sVkOtia9YDiSC0JXc5Cw1LzZ8TTtmz6qPjGlRfMVyIpFoTwd42RHfA4afxeFZX8SFsfEdqaHWxFcsR1ICYGEYCVuj2sJuaaj/FLG2THxzG2lNfMVyJiUBbnHEeonhY1PVd4kn0Dr5d4RbV/tS/r4mQo+niHWGj9sM+61l4xu7AF1oH9hYRUDgSsN+V5X4hpCA6wz3nxn2pxv2M1XiG0ICTjPczzrKEqXtvUH2OQELDPf7Dftjqth7g+xzAhbmBKT9CFpaxb51ATqQgOsN958a9mca9vklXITW/w0Btxj2q1vvhkbyfocGYvMda37uM3ysbX0glnAp4lZHrCsrliKeKhvfaCN9LMZNOn79exzFuJ0pFuO6UI5+tep6z1CO1mUtRVRfvk6/JmQmgOcdce11TMjo+RNJT8g0PSV5MvAGPsxnt045Gj62xehc1FDqk/KLgHvCmlAPM9a60bCtyZoNu72K7m4BergsZVUNi7M0OSdIF0hsYdZGh78ljn/TW9IlElma+IJzaeIzDl83SdcomwQMHO16eMnTYwk7ZqzFuV91ds9YB5enHwybNeY5u7BaSrG4U7pMhzZofANcVvMGDfW5QLpOy1uUZsNeMXdRELjWMepVpiUVWtiktzsI794bFuynQtIsPkzuuDOa2aaqg7CzS8Z3HvCjI4y/almG2AZ0d6P2xREbte+XlKGbRxV4R9DvdLbbGQOwru0EhFmyDYM7rKMjx9VcCnwS0bTuIVgufYPmD2w6o8SBTb/1+ugymjmyTF+yLzrKysM4LauhQ/umwrsm5lEzim70u1yGAvUdW6kb6r6jGl+UPfYmaejGwa1bdR5AhgoFXVSHbRX21bbfN3Vo/vDuLdpDaubuEoFmjq//WA9oauaOevA4Evt6L/kDDi18wuR74NlkK5kJfsTnQPilPxqWlqdxyF4PPmM1HUa+3T3PLZPJZDKZTCaTyWQymUwmI33nHzVOp4awAxRMAAAAAElFTkSuQmCC'
				/>
			</defs>
		</svg>
	),
	muted: (props: IconProps) => (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			{...props}
		>
			<path d='M16 9a5 5 0 0 1 .95 2.293' />
			<path d='M19.364 5.636a9 9 0 0 1 1.889 9.96' />
			<path d='m2 2 20 20' />
			<path d='m7 7-.587.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298V11' />
			<path d='M9.828 4.172A.686.686 0 0 1 11 4.657v.686' />
		</svg>
	),
	pause: (props: IconProps) => (
		<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' {...props}>
			<path d='M 25 2 C 12.316406 2 2 12.316406 2 25 C 2 37.683594 12.316406 48 25 48 C 37.683594 48 48 37.683594 48 25 C 48 12.316406 37.683594 2 25 2 Z M 22 34 L 17 34 L 17 16 L 22 16 Z M 33 34 L 28 34 L 28 16 L 33 16 Z' />
		</svg>
	),
	info: (props: IconProps) => (
		<svg
			viewBox='0 0 24 24'
			fill='currentColor'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<path
				d='M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM13 18H11V11H13V18ZM12 8.5C11.172 8.5 10.5 7.828 10.5 7C10.5 6.172 11.172 5.5 12 5.5C12.828 5.5 13.5 6.172 13.5 7C13.5 7.828 12.828 8.5 12 8.5Z'
				fill='white'
			/>
		</svg>
	),
	setting: (props: IconProps) => (
		<svg
			viewBox='0 0 46 46'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<path
				d='M45.16 19.221L39.25 18.255C38.904 17.069 38.431 15.929 37.839 14.85L41.289 9.933C41.568 9.536 41.52 8.995 41.177 8.651L37.288 4.764C36.941 4.418 36.395 4.373 35.997 4.66L31.154 8.141C30.065 7.539 28.915 7.061 27.722 6.714L26.691 0.828C26.607 0.35 26.192 0 25.706 0H20.206C19.716 0 19.298 0.355 19.219 0.839L18.263 6.693C17.063 7.038 15.911 7.511 14.826 8.105L9.99595 4.655C9.59695 4.37 9.05395 4.416 8.70695 4.761L4.81995 8.648C4.47695 8.991 4.42895 9.531 4.70795 9.928L8.10695 14.791C7.50195 15.886 7.01995 17.045 6.66895 18.251L0.837953 19.222C0.355953 19.302 0.00195312 19.72 0.00195312 20.208V25.708C0.00195312 26.193 0.349953 26.608 0.826953 26.693L6.65795 27.727C7.00695 28.93 7.48895 30.089 8.09595 31.187L4.65495 36C4.37095 36.397 4.41595 36.942 4.76095 37.289L8.64895 41.18C8.99195 41.523 9.53295 41.571 9.92995 41.292L14.8 37.881C15.893 38.482 17.048 38.959 18.245 39.305L19.221 45.166C19.3 45.647 19.717 46 20.206 46H25.706C26.191 46 26.606 45.652 26.69 45.175L27.735 39.285C28.934 38.932 30.083 38.452 31.165 37.85L36.07 41.291C36.468 41.572 37.008 41.523 37.352 41.18L41.24 37.289C41.586 36.942 41.631 36.395 41.344 35.997L37.846 31.14C38.439 30.06 38.91 28.918 39.253 27.732L45.171 26.693C45.65 26.609 45.998 26.193 45.998 25.708V20.208C45.999 19.718 45.644 19.3 45.16 19.221ZM23 30C19.134 30 16 26.866 16 23C16 19.134 19.134 16 23 16C26.866 16 30 19.134 30 23C30 26.866 26.866 30 23 30Z'
				fill='white'
			/>
		</svg>
	),
	next: (props: IconProps) => (
		<svg
			stroke='currentColor'
			fill='currentColor'
			stroke-width='0'
			viewBox='0 0 24 24'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<path d='M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z'></path>
			<path d='m8 16 5-4-5-4zm5-4v4h2V8h-2z'></path>
		</svg>
	),
};
