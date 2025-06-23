const Banner = () => (
	<div
		className='relative w-full rounded-lg shadow-lg my-8 overflow-hidden'
		style={{
			backgroundImage: "url('/ten-off.jpg')",
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			minHeight: '220px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}>
		<div className='absolute inset-0 bg-black bg-opacity-45' />
		<div className='relative z-10 flex flex-col items-center justify-center w-full py-8'>
			<h2 className='text-3xl sm:text-4xl font-bold text-orange-500 mb-2 drop-shadow-lg'>Special Offer!</h2>
			<p className='text-lg sm:text-xl text-center text-white font-semibold drop-shadow-lg px-4'>
				For every <span className='text-white bg-orange-500 rounded-md px-2'>$200</span> purchase, you get a{' '}
				<span className='text-white bg-orange-500 rounded-md px-2'>10% OFF</span> coupon!
			</p>
		</div>
	</div>
);

export default Banner;
