import { Routes, Route, Navigate } from 'react-router';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LogInPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import AdminPage from './pages/AdminPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import LoadingSpinner from './components/LoadingSpinner';
import PurchaseSuccessPage from './pages/PurchaseSuccessPage';
import PurchaseCancelPage from './pages/PurchaseCancelPage';
import { Toaster } from 'react-hot-toast';
import { useUserStore } from './stores/useUserStores';
import { useEffect } from 'react';
import { useCartStore } from './stores/useCartStore';

function App() {
	const { user, checkAuth, checkingAuth } = useUserStore();
	const { getCartItems } = useCartStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!user) return;
		getCartItems();
	}, [getCartItems, user]);

	if (checkingAuth) {
		return <LoadingSpinner />;
	}
	return (
		<div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
			{/* Background gradient */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(253,186,116,0.3)_0%,rgba(249,115,22,0.2)_45%,rgba(221,107,32,0.1)_100%)]' />{' '}
				</div>
			</div>

			<div className='relative z-50 pt-20'>
				<Navbar />
				<Routes>
					<Route
						path='/'
						element={<HomePage />}
					/>
					<Route
						path='/signup'
						element={!user ? <SignUpPage /> : <Navigate to='/' />}
					/>
					<Route
						path='/login'
						element={!user ? <LogInPage /> : <Navigate to='/' />}
					/>
					<Route
						path='/secret-dashboard'
						element={user?.role === 'admin' ? <AdminPage /> : <Navigate to='/login' />}
					/>
					<Route
						path='/category/:category'
						element={<CategoryPage />}
					/>
					<Route
						path='/cart'
						element={user ? <CartPage /> : <Navigate to='/login' />}
					/>
					<Route
						path='/purchase-success'
						element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />}
					/>
					<Route
						path='/purchase-cancel'
						element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />}
					/>
				</Routes>
			</div>
			<Toaster />
		</div>
	);
}

export default App;
