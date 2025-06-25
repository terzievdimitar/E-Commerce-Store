# Shopr - MERN E-Commerce Store

Shopr is a full-featured e-commerce application built with the **MERN** stack (MongoDB, Express, React, Node.js). It allows users to browse products, manage a shopping cart, apply coupons, and securely checkout with Stripe. The app features a modern, responsive UI and an admin dashboard for managing products and orders.

## Features

- Browse products by category
- Add/remove products to/from cart
- User authentication (sign up, login, logout)
- Admin dashboard for product and order management
- Stripe checkout integration
- Coupon system (e.g., 10% off for $200+ purchases)
- Toast notifications for user feedback
- Responsive design for mobile and desktop
- Error handling and loading states

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Lucide Icons, React Hot Toast
- **Backend:** Node.js, Express, MongoDB (Mongoose), Stripe
- **Other:** dotenv, CORS, ESLint

## Demo Video

```html
<video
	src="./demo/Shopr-Project-Video.mp4"
	className="w-full h-auto"
	autoplay
	loop
	muted />
```

https://github.com/terzievdimitar/E-Commerce-Store/blob/main/demo/Shopr-Project-Video.mp4

## Project Structure

```
/backend
  ├── controllers/        # Express route controllers (auth, products, cart, coupon, payment, analytics)
  │     ├── analytics.controller.js
  │     ├── auth.controller.js
  │     ├── cart.controller.js
  │     ├── coupon.controller.js
  │     ├── payment.controller.js
  │     └── product.controller.js
  ├── lib/                # Utility libraries (db, redis, stripe, cloudinary)
  │     ├── cloudinary.js
  │     ├── db.js
  │     ├── redis.js
  │     └── stripe.js
  ├── middleware/         # Express middleware (auth, error handling, etc.)
  ├── models/             # Mongoose models (User, Product, Order, Coupon)
  ├── routes/             # API route definitions
  ├── test/               # Backend tests
  └── server.js           # Express app entry point

/frontend
  ├── public/             # Static assets (images, icons, etc.)
  │     ├── bags.jpg
  │     ├── glasses.png
  │     ├── jackets.jpg
  │     ├── jeans.jpg
  │     ├── shoes.jpg
  │     ├── shopper.svg
  │     ├── suits.jpg
  │     ├── ten-off.jpg
  │     └── tshirts.jpg
  ├── src/
  │     ├── components/   # Reusable React components (Navbar, Banner, ProductCard, etc.)
  │     ├── lib/          # Axios instance and helpers
  │     ├── pages/        # Page components (Home, Category, Cart, Auth, Admin, etc.)
  │     ├── stores/       # Zustand stores for state management
  │     ├── App.jsx       # Main app component
  │     ├── index.css     # Tailwind and global styles
  │     └── main.jsx      # React entry point
  ├── index.html          # HTML entry point
  ├── package.json
  ├── postcss.config.js
  ├── tailwind.config.js
  └── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB database (local or Atlas)
- Stripe account (for payments)

### App Setup

1. Create a [.env](#environment-variables) file.

2. Install dependencies:
      ```bash
      npm run build
      ```
3. Start the application:
      ```bash
      npm run start
      ```
4. Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Run in Docker Container

If you don't have Docker, visit [the docker guides](https://www.docker.com/get-started/) to install it on your OS.

1. Create a [.env](#environment-variables) file.

2. Create Docker Image:

      ```bash
      docker build -t e-commerce-app .
      ```

3. Run the container:
      ```bash
      docker run -d --name E-Commerce-App -p 3000:3000 e-commerce-app
      ```
4. Visit [http://localhost:5001](http://localhost:3000) in your browser.

## API Endpoints

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/cart` - Add to cart
- `GET /api/cart` - Get cart items
- `POST /api/payment/checkout` - Create Stripe checkout session
- `GET /api/coupon` - Get available coupon
  ...and more

## Environment Variables

Example `.env` for `/backend`:

```
PORT=3000

# Database configuration
MONGO_URI=your_mongodb_connection_string

# Redis configuration
REDIS_URL=your_redis_url

# JWT secret
ACCESS_TOKEN_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret

# Cloudinary configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe configuration
STRIPE_SECRET_KEY=your_stripe_key

CLIENT_URL=http://localhost:5173

NODE_ENV=production
```

## Notes

- CORS is enabled for the frontend origin specified in .env.
- In production, the backend can serve the frontend's static files from frontend/dist.
- Coupon logic: For every $200 purchase, you get a 10% off coupon

## License

This project is for educational purposes.
