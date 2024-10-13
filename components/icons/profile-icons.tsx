type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
	image: (props: IconProps) => (
		<svg
			width='36'
			height='36'
			viewBox='0 0 36 36'
			fill='currentColor'
			xmlns='http://www.w3.org/2000/svg'
			{...props}
		>
			<path
				d='M0 3.59998V32.4H36V3.59998H0ZM1.44 5.03998H34.56V23.76H26.8706L21.8306 20.16H17.5781L14.6363 17.2181L11.1319 17.9212L8.0325 13.2694L1.44 19.8619V5.03998ZM27 9.35998C25.2197 9.35998 23.76 10.8197 23.76 12.6C23.76 14.3803 25.2197 15.84 27 15.84C28.7803 15.84 30.24 14.3803 30.24 12.6C30.24 10.8197 28.7803 9.35998 27 9.35998ZM27 10.8C28.0013 10.8 28.8 11.5987 28.8 12.6C28.8 13.6012 28.0013 14.4 27 14.4C25.9988 14.4 25.2 13.6012 25.2 12.6C25.2 11.5987 25.9988 10.8 27 10.8ZM7.8075 15.5306L10.4681 19.5187L14.1638 18.7819L16.9819 21.6H21.3694L26.4094 25.2H34.56V30.96H1.44V21.8981L7.8075 15.5306Z'
				fill='currentColor'
			/>
		</svg>
	),
	plus: (props: IconProps) => (
		<svg
			width='35'
			height='35'
			viewBox='0 0 35 35'
			fill='currentColor'
			xmlns='http://www.w3.org/2000/svg'
			xmlnsXlink='http://www.w3.org/1999/xlink'
			{...props}
		>
			<rect width='35' height='35' fill='url(#pattern0_4611_272)' />
			<defs>
				<pattern
					id='pattern0_4611_272'
					patternContentUnits='objectBoundingBox'
					width='1'
					height='1'
				>
					<use xlinkHref='#image0_4611_272' transform='scale(0.0111111)' />
				</pattern>
				<image
					id='image0_4611_272'
					width='90'
					height='90'
					xlinkHref='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD8ElEQVR4nO2dS08UQRDHKxEVo9ErDxM16BdAPYmRGPWqHtTEV8TXBRNEAnj05uNESPwaPg8Y/QAag0Hg4kW9+Ii6gJ6EBPyZCm3cA6uQ7emumelfspfN7GzVf3d6uquqa0QSiUQikUgkEolEIrE8gFXAbuACcAd4AEwAb4FpYM69pt17E+6Y2+4zu/Qcy/y6cgFsBq4Cj4Ef1M934BHQA7RKmQHWAWeAZ8AC2TEPPAVOA41SFoAN7p/2kfB8BW4Am6SoAKuBfmCK+KgNfWqTFAlgLzCJPd4AByTv6JgI3AV+YRe1bRhYK3kE2Aq8ID+8ArZLntDL0dM0LTQ6LdwveQA4Cvwkv8wBJ8QywOWM58ShUB8uiUWAI25xUBQWgONiCR3XgFmKxxxwSCwA7MjpjW8lN8i22CKvddOiojMadZ7tFiMhL+N+oNm9Btx7oRiOJfK+wCu+gSVsGAz4/eprR2iRG4BxwtK8hB1NgW2YDBqIcpdwUKS2LaHpDRlPrpRY6IpqEELokOOiRaGVvhBhz08xPBNbQn/WVFyWQp+N5BjGhFZOZim0JlKjIPaEHslK5NaYQSOxJ/RCJqUMru4iGmJPaOVKFkJrcUs0xKbQ97Io05qJ6ZHYFHrGa/mZq4WLitgUWtnpU+iLsb0Ru0J3+RRaqzqjInaFvulT6IexvRG7Qvu7IUYIieZJ6DGfQr/3kRkRY3jK1LzzaVDFZ2bEGnVGJL/5NKSeX7xZjFNnpmbWitAtYhwXxzEhdD1Dx6AYB7huZeio92Y4aPGfrTY528zcDNP0LtD0Li1YAi1Y0hI80BJcd6RGRWrbFptzPoVOYdLatPsUOgX+QwT+ndi6tzoaUtuu4qSynEO6rTgaYlPo7qwm96nc4C+qRZN3oZ3Y2iUgClLbpmIV0DintO1DFKRkJWGNkdo/UKoix1hF6AaFvpapyM6x9RoaLLHQlSCF6M45bSpSVqF7gohctVnodWAHWzxnRuxvFqrqKhNy+9ug58zISlFf9wQVucpR7dwSirk/mRpPmZGVMhRF5Kotyrp9t+i8BNZEE9qJ3eY2pheVGWCbWADozHnXmVro0HRQLAEcLmBjlGNiEW2PU5BWP/NaEy6WcS1/8jyMzJpr8fOf1j/fc3rj65Q8AWwBnpMfRqO39Klznj2cg5aZQ9HnyT4AOiyUlS3BeLRldcaBqN4YIdYl+OaSzQ1SVFiMZ6uTHyII/MU16t4oZYHFtNgp4EnGCx0994jm+ErVev4fm3auAPfd0yjqZdqdqzuzkoC8w2L5WTtwHril1UBag+weBTJV9XiQKffemDtGj+1yn02PB0kkEolEIpFIJBIJWSa/AV6GBCbKNy/yAAAAAElFTkSuQmCC'
				/>
			</defs>
		</svg>
	),
};
