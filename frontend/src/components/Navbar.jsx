import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Menu } from 'lucide-react';
import { Link } from 'react-router'; // Make sure to use react-router-dom
import { useUserStore } from '../stores/useUserStores';
import { useCartStore } from '../stores/useCartStore';

const Navbar = () => {
	const { user, logout } = useUserStore();
	const { cart } = useCartStore();
	const isAdmin = user?.role === 'admin';
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const menuRef = useRef(null);

	useEffect(() => {
		if (!isMobileMenuOpen) return;

		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsMobileMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isMobileMenuOpen]);

	return (
		<header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-orange-800'>
			<div className='container mx-auto px-4 py-3'>
				<div className='flex flex-wrap justify-between items-center'>
					<Link
						to='/'
						className='text-2xl font-bold text-orange-400 items-center space-x-2 flex'>
						<img
							src='/shopper.svg'
							alt='Logo Image'
							className='h-7 w-7 mr-2'
						/>
						Shopr
					</Link>

					<nav className='flex flex-wrap items-center gap-4'>
						<Link
							to={'/'}
							className='text-gray-300 hover:text-orange-400 transition duration-300 ease-in-out font-semibold'>
							Home
						</Link>
						{/* Hamburger for mobile */}
						<button
							className='lg:hidden text-orange-400'
							onClick={() => setIsMobileMenuOpen((prev) => !prev)}
							aria-label='Toggle menu'>
							<Menu size={28} />
						</button>
						<div className='hidden lg:flex gap-2 items-center'>
							{user && (
								<Link
									to={'/cart'}
									className='relative group text-gray-300 hover:text-orange-400 transition duration-300 ease-in-out'>
									<ShoppingCart
										className='inline-block mr-1 group-hover:text-orange-400'
										size={20}
									/>
									<span className='hidden sm:inline'>Cart</span>
									{cart.length > 0 && (
										<span
											className='absolute -top-2 -left-2 bg-orange-500 text-white rounded-full px-2 py-0.5 
                                    text-xs group-hover:bg-orange-400 transition duration-300 ease-in-out'>
											{cart.length}
										</span>
									)}
								</Link>
							)}
							{isAdmin && (
								<Link
									className='bg-orange-700 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-medium
                             transition duration-300 ease-in-out flex items-center'
									to={'/secret-dashboard'}>
									<Lock
										className='inline-block mr-1'
										size={18}
									/>
									<span className='sm:inline'>Dashboard</span>
								</Link>
							)}

							{user ? (
								<button
									className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
									onClick={logout}>
									<LogOut size={18} />
									<span className='sm:inline ml-2'>Log Out</span>
								</button>
							) : (
								// Hide these buttons on mobile, show on desktop
								<div className='hidden lg:flex gap-2'>
									<Link
										to={'/signup'}
										className='bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 
                                    rounded-md flex items-center transition duration-300 ease-in-out'>
										<UserPlus
											className='mr-2'
											size={18}
										/>
										Sign Up
									</Link>
									<Link
										to={'/login'}
										className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
                                    rounded-md flex items-center transition duration-300 ease-in-out'>
										<LogIn
											className='mr-2'
											size={18}
										/>
										Login
									</Link>
								</div>
							)}
						</div>
					</nav>
				</div>
			</div>

			{/* Mobile Menu */}
			<div
				ref={menuRef}
				className={`lg:hidden bg-transparent shadow-lg transition-all duration-500 ease-in-out overflow-hidden ${
					isMobileMenuOpen ? 'max-h-screen opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-full'
				}`}>
				<nav className='py-4 z-10'>
					{!user ? (
						<div className='flex items-center justify-center gap-3 px-6'>
							<Link
								onClick={() => setIsMobileMenuOpen(false)}
								to='/login'
								className='w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center justify-center transition duration-300 ease-in-out'>
								<LogIn
									className='mr-2'
									size={18}
								/>
								Log In
							</Link>
							<Link
								onClick={() => setIsMobileMenuOpen(false)}
								to='/signup'
								className='w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition duration-300 ease-in-out'>
								<UserPlus
									className='mr-2'
									size={18}
								/>
								Get Started
							</Link>
						</div>
					) : (
						<div className='flex items-center justify-center gap-3 px-6 py-2'>
							<Link
								onClick={() => setIsMobileMenuOpen(false)}
								to='/cart'
								className='w-fit relative bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex flex-wrap items-center justify-center transition duration-300 ease-in-out'>
								<ShoppingCart
									size={18}
									className='mr-1'
								/>
								Cart
								{cart.length > 0 && (
									<span className='absolute -top-2 -left-2 bg-orange-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-orange-400 transition duration-300 ease-in-out'>
										{cart.length}
									</span>
								)}
							</Link>
							{isAdmin && (
								<Link
									onClick={() => setIsMobileMenuOpen(false)}
									to='/secret-dashboard'
									className='w-fit bg-orange-700 hover:bg-orange-600 text-white py-2 px-4 rounded-md flex flex-wrap items-center justify-center transition duration-300 ease-in-out'>
									<Lock
										size={18}
										className='mr-1'
									/>
									Dashboard
								</Link>
							)}
							<button
								className='w-fit bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex flex-wrap items-center justify-center transition duration-300 ease-in-out'
								onClick={() => {
									setIsMobileMenuOpen(false);
									logout;
								}}>
								<LogOut
									size={18}
									className='mr-1'
								/>
								Log Out
							</button>
						</div>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Navbar;
