type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
	play: (props: IconProps) => (
		<svg
			viewBox='0 0 70 70'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			xlinkHref='http://www.w3.org/1999/xlink'
			{...props}
		>
			<rect width='70' height='70' fill='url(#pattern0_4486_391)' />
			<defs>
				<pattern
					id='pattern0_4486_391'
					patternContentUnits='objectBoundingBox'
					width='1'
					height='1'
				>
					<use xlinkHref='#image0_4486_391' transform='scale(0.0111111)' />
				</pattern>
				<image
					id='image0_4486_391'
					width='90'
					height='90'
					xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEIElEQVR4nO2dTYyOVxTHj2+lKbrylZRok64Vm9ZHBLsGC5VQDUo3PsZHxNauSAiTWNjasEJJkNqrCJkyIRY0XfhoGTNEUjMx49ecvEcidOo1c+997n3u/SWzefO873PuP+88955z//e8IoVCoVAoFAqFQqFQaA5gGDAb+BHYD5wGbgB3gU6gx/467bUbds0+e88s/Ywmb5cXwFRgG3AWeMbgeQqcAVqAKZIzwEfAGuAi0Ic/eoFfge+B0ZILwMf2TbtPeB4Be4BxUleAEcAu4AnVozHs1JikTgBzgXbi4zawSFJHn4nAEeAV8aKxtQKjJEWAacBl0uEa8LmkhP47OlqmhUaXhQslBYDlwAvSpQdYKTED/OR5TRwKHcNGiRFgmSUHdaEP+E5iQp9rQDf1owdYIjEAfJHoxPchE+SMqkUeZcuiunO10nW2JSO50FplWh1zxucaHev80CIPB66TH+1BC1FWhcuV7SHryR3kS4dqEELo3VWPNAJ2hth++svzII4DW4GbxMsDr9titsfnmwlvTLhbItmR+S9W+xRaN1K9Iu/ecwJwGHhJXJz3JfKUEEUj6f/+XwLniKvo5N7KYL4L70hzVcI7xMFmH0KrucU70vyOeksExayTPmxaXSEilw+LaxJwtMI6eJdT+5l54YIgA4/vEtXwlUuhN4SKWgYX57fAn4RlnUuh1dUZBBl8rGMse30eKOSf3ajcCP6XVIR+y6F6LEAp192EGLIkKo4B5gFtHkNucxlssOeeeAAYCvzgqU7zh8tAg5VFxSNq1wUOOF4OPnYZoG67B0ECoMV7hyF3uwysbkLviFXoujw6xgMHHdvWnD46ymQYaDJMeXk3P6XlXUlYAiUsqaXge4B/UkzB9URqEGTgMQ4BVlRQVFqbU5l0DvAb1TAzp8J/H3Uo/Nug9Gy1d6S5WEbWcivLBqcD8440dxhJuxrEwCYfQk+OwG5wnnhQLSY6F9oGq10CvCLv3vPTrAw0NmhtxRDSErbVGqDEyCrfJseHngdwwsw6t4iX+957f2RuQn/NDq8im9BjtTRIvnQEMaKb2NpUJFdagoj8xkT1O/nRHrxrDfBNOf4WCOvckguHQuna3xFlPb5bd65ofaUyoU3sGXYwva50AdMlBoAFiXed6Q+1WSyWmACW1rAxygqJEW2PU5NWP73qCZeYscM8KT9GuqNr8fOe1j9PE534FkhKAJ9VuGE6EK5W3tJnkOvs1sgzSI3tUOXrZIfp+nXiQ2P6WuoEjULU9khKrI9ts3m41BUa9Wwd5L0KBP7b7GKfSC7QaHm8GrjgOdHptd3zVVm1nv8fx9Fm4JSjzdhO+6xN3iwBqUPDfjYTWA/sVTeQ+ZvvWpOU1z8P8sRea7Nr9Np19t7y8yCFQqFQKBQKhUKhIE3yL+iqt381iIcWAAAAAElFTkSuQmCC'
				/>
			</defs>
		</svg>
	),
	shuffle: (props: IconProps) => (
		// <svg
		// 	{...props}
		// 	viewBox='0 0 49 61'
		// 	fill='none'
		// 	xmlns='http://www.w3.org/2000/svg'
		// 	xlinkHref='http://www.w3.org/1999/xlink'
		// >
		// 	<rect width='49' height='61' fill='url(#pattern0_4486_442)' />
		// 	<rect
		// 		x='14.4595'
		// 		y='18'
		// 		width='20.082'
		// 		height='25'
		// 		fill='url(#pattern1_4486_442)'
		// 	/>
		// 	<defs>
		// 		<pattern
		// 			id='pattern0_4486_442'
		// 			patternContentUnits='objectBoundingBox'
		// 			width='1'
		// 			height='1'
		// 		>
		// 			<use
		// 				xlinkHref='#image0_4486_442'
		// 				transform='matrix(0.0104167 0 0 0.00836749 0 0.0983607)'
		// 			/>
		// 		</pattern>
		// 		<pattern
		// 			id='pattern1_4486_442'
		// 			patternContentUnits='objectBoundingBox'
		// 			width='1'
		// 			height='1'
		// 		>
		// 			<use
		// 				xlinkHref='#image1_4486_442'
		// 				transform='matrix(0.0104167 0 0 0.00836749 0 0.0983606)'
		// 			/>
		// 		</pattern>
		// 		<image
		// 			id='image0_4486_442'
		// 			width='96'
		// 			height='96'
		// 			xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAADx0lEQVR4nO3dy29PQRTA8fEIrY3QVoK0rLC3RUiKUPVK+RPa0KjG43+wQNRjUcLCH9B4rIpVQ+xKvTa0VLGh1e5Y6FcmjqQs2v7ub+6dmTvnk3TTNu2dOe2duWdmzjVGKaWUUkoppQICrAJ2A13ANeAR8AIYBiaAn/IxIZ+zX3so33sC2AU0+G5HNIBlwAGgRzpzmurZnzEEXAL2A7W+2xkUYCGwBegFpsif/R23gVZgkUkVUAMcB0bwx962jgFLTWK3mTPAF8Jhr+WUvTZTZvJv/55wjQFtpmyA9cB94nEXaDJlAByUaWJspoCjJlZ2YJPpZOx6oxukgTrgKeXxGFhpYgCskYeosnkDNJqQAZuAj5TXKLDRhAhYC3yg/D4B60yA93z7L5qK18GMCTLbKdOAO19PgpgdAVdJV4/vzm/z3QMBOOwzvTDpu/UB+O5lUAbu+W55QO74yO+of7UWmc9PYb5fqZFCljuBsxVfWjq6i5jzf/bdyoDZlbWaPANg13DV7Dry3L3gcwE9Fu+ABXkEYIfvlkVkWx4BuOW7VRG54brza/Wpt+L1ZHdTUtkuqCrT4jIAZVhcL9p5lwEo4xpv3p653CLuYpdyan4B9S4CYPfnq2yaXQTAHo5Q2XS6CIA9baKyuewiAPbIj8qm30UAXmb85QqGXARAF1+yG3ERgPEqLiB1X10EwB4DVdn80ACUIAB6C/J8C9JB2PMgrNNQz9NQfRDz/CCmqQjPqQhNxnlOxmk62nM6ukEXZDIvyNRVHQAJgi5JVm7QSedLAGyxI+VxUd5WmlKV2esyALoxqzKTzs8KADcrvIiUXXfa+RKA7b5bFZGteW1PtzXW1Oze5rI9XYJgC9yp2bXn0vkSAD2iNHfNuXzLFwCn57iIlHXl2vkzjqmGXPnQ59Gk/A7o/ReEPd6amcJ5gHkGwZZ2VH/0Fdr5EoAmKVSRuglvteSAfYmnqqeBQ146f0YQUj6+dNFr5894NrDlu1IzACwxIQCWA89Jx6tgivYlWLZyLNjC3raoqRQ3LatRYIMJGbBa3tlSxlqhjSYG9v5YsoF5AFhhYgIsBs5F/pwwLdPsMGY7VdSZiPUFDkdMGdi6mpHljvqiud9nSF2EXHVruPCsZtFki0u3lIEPaW5/srB8fggkhdEhCxk+F9Dbox5kXQA2y2zjW0GbpuyrDJtz270Q+esNW2yW0dbbkR3G1bI/YxC4YLcLJnWbqRZQD+y0Bx2AK8ADSfoNy+nNv6+zHZfP2a/1y/d2yl+5my3iSimllFJKKWXc+A151tEillPOxQAAAABJRU5ErkJggg=='
		// 		/>
		// 		<image
		// 			id='image1_4486_442'
		// 			width='96'
		// 			height='96'
		// 			xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAADtUlEQVR4nO2dPWsVQRSGD/h575wbduYmYEzumVsEBBsLLbTwH6igYGMEO8WP3xKwUytraxUbG4v4D4ypDERibVT8QiITgoWB7L07u/vuzp4HBgKBu++Zd2ffWdg9S6QoiqIoiqIoiqIoiqIoFcE8P8tONtj5nTYMY/1XY2WNnbw0Q7nfcwuLrT85+tn4DFv/DT25Bccfdv7Z8Wzsqc2YTJYbMJkRK0O2B9noMrUZtrKCnsjY1WCcPABO4PgOW7kd8ROH2MmrtpswGI6uUN0MrL/ATn6GEf6OCWXj5EMDJrLwMFY+92dlnuqiP+dPsPUf/4mw8qnnFhc6Gso7uyY4/5jq4fRR42R1vwBZDf8r+qvG+hvoSYwcv2NOwsknyvnHDTgLamM4PDVg568aK+9zTcj8vUrFhMDNFREXyo1lZmbRsfWbOZeh5zWEbt5SjAvlJsNOrh9ogJW1Sg4cEp6t35r4emj9Vq27gppwbmkmx4DtCg579ohx/s3UuwIrb4mWjlFicE7dtYbuBHnwlBKD6zRg9043dnuWWChzXQbshe6PaAOc/OJsdJESgeswYN+dbvwqiLpT7pgBxUK3K6HMVRsQFbodCGWu0oBSQjfxUOaqDCgvdNMOZa7CgNJDN+FQ5vINqCZ0Uw1lLtuASkM3wVDmKi5BrRIABl4/XAAYeP1wAWDg9cMFgIHXDxcABl4/XAAYeP1wAWDg9cMFgIHXDxcABl4/XAAYeP1wAWDg9cMFgIHXDxcABl4/XAAYeP1wAWDg9cMFgIHXDxcABl4/XAAYeP1wAWDg9cMFgIHXDxcABl4/XAAYeP1wAWDg9cMFgIHXDxdQMsgH04yTR9R1Awj1aOZuZ4ECj2amZwC16+HkFA0IDJw/34rH81M1INB341uNf0ElZQOqDuVCods1A6iqlxSLhm73DKBmv6bbBQPKDeWS34nrigGlhXLZb4V2yYDYUC4ldLtuABVt11NW6P5PaEp00IFDjzVKjH6TGlYZK+s5Aq5Rggya0rItdBE/cOlZWQ8N7ihBuAlNC0ML9wmW4GZocBd6rFFiGHTbztA/PzQpjd6eAYfJZLlpjWunwjj/BD2JHDOsfO8NR+ea0rp5anrD0cm83VDzh2yExuHo5uWFCR8v2PuaRItXgn9NRIejQhnZ/yh8vKD9JsgKtZlBJpdC/3z4RLriw2Ryk1r/ZSTrH7Z2d2TjQrkxhJ0AW3+XnbwwVt4Z67/AJ9dNE8pLc+g5VBRFURRFURRFURRFUShZ/gLrHAM+cTPm5AAAAABJRU5ErkJggg=='
		// 		/>
		// 	</defs>
		// </svg>
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
		<svg
			viewBox='0 0 90 90'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			xlinkHref='http://www.w3.org/1999/xlink'
			{...props}
		>
			<rect width='90' height='90' fill='url(#pattern0_4486_326)' />
			<defs>
				<pattern
					id='pattern0_4486_326'
					patternContentUnits='objectBoundingBox'
					width='1'
					height='1'
				>
					<use xlinkHref='#image0_4486_326' transform='scale(0.0111111)' />
				</pattern>
				<image
					id='image0_4486_326'
					width='90'
					height='90'
					xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD3ElEQVR4nO2dTWudVRDHBxqtoui2TYRaol8g6sqKRdRtdWELRsH4tokQ09DGpTtfViHg17BVFxH9AC0lEpNs3ChdGLVt3rpqAok/Ge60ZtFLUjLn5Xme+cHdXJ773P8M955zZs6ceUSCIAiCIAiCIAiCgwEcAV4APgC+Bi4DS8DvwDqwba91e2/JrvnKPvO83uOAX9ctgKeAT4EfgNscnk3ge2ACGJIuAzwKvAv8DOySjh3gJ+Ad4BHpCsDj9ktbIT83gc+BJ6WtAA8BF4A1yqMaplSTtAngJWCZ+vgNeFWajo6JwDfAv9SLapsFjkoTAZ4GrtIcfgGekSahf0enZVpudFn4ijQB4E3gDs1lGzgnNQN8nHhNnAu14SOpEeANCw7awi5wVmpCxzVgi/axDbwuNQA829CJ70EmyOHSTj5qy6K2M190nW3BSFeYLRlW1xzxeaO2vpzbyQPAIt1jOWsiyrJwXWUyZz55le6yqj7I4ejp0pZWwFSO7ad/HIOBi8BgUtE93YP2A9Hv9OCvpNtitsfnxXQyoXn+jaMphepGqhfHkwntr/+Yo/65VCKHPJNGUgjnpJN/KYPVXbghhfC0AfgkhUAtbnFDCuFpA/BtijKtDU+FUghPG8wnfuVnVgvnihTC2w7gOU9xH3qrk0J42wGMeYrTqk5XpBDedgBfeIr7zludFMLbDtcJMUVKVArhbQew4Cnuurc6KYS3HcAfnuLcK0ClEN52ALc8xXllve7hJu7BbfFmy1NcODqTo2PoyDR0xGSYaTKM5V2m5V0ELJkClgjBM4XgeiLVFSmEtx3Ae57iIk3anxFPR0fiP0fi35ytZ6vdkEJUvZVlAvVYsRtSCE8bgPFU1T5RbvA/6otj7o42Z2uXAC8Gk4jcvzal7gIaE6qtGJpcEvaZo/63Uxc5/u0kdNtq4ZpY5LiSvPdHx4vQ73I+qZPN0Y9papDuspqlEN2crU1FuspEFifvOSz0K91jOXvXGuBUHH/LhHVu6Qozufza74iyHt9tO9eAh4s52pw9bAfT28oGcFJqADjd8K4z/dAA5zWpCeBMCxujvCU1ou1xWtLqZ0drwqVmrOVPk4eRrepa/OzT+mezoRPfaWkSwAngCs1hvnhLn0Ous2crjyBV20zxdbJjuL5IfaimF6VN0EtETVaSYr1lm80D0lbo5bPVyD8LOPiGNep+QroCvZbHo8CPiQMdvfec7vF1qvX8/dCWEnqAHbhkT6M4LOt2r/FkJQFNh1752QjwPvClVgNpDbI9CmRtz+NB1uy9BbtGrx2zz8bjQYIgCIIgCIIgCOSA/AespQZhTFo0uQAAAABJRU5ErkJggg=='
				/>
			</defs>
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
};
