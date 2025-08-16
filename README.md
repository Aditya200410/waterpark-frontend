
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd pawnbackend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with required environment variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   COOKIE_SECRET=your_cookie_secret
   ```

4. Start backend server:
   ```bash
   npm start
   ```

## 🔧 Environment Configuration

The project uses a centralized configuration system. To switch between environments:

### Using the Switch Script
```bash
# Switch to local development
node scripts/switch-env.js local

# Switch to deployed backend
node scripts/switch-env.js production

# Switch to custom staging URL
node scripts/switch-env.js staging https://your-staging-url.com
```

### Manual Configuration
Update the `API_BASE_URL` in `src/config/config.js`:

```javascript
// For local development
API_BASE_URL: 'http://localhost:5000'

// For deployed backend
API_BASE_URL: 'https://api.rikocraft.com/api/'
```

## 🌐 API Endpoints

The following endpoints are available:

- `GET /api/categories` - Get all categories
- `GET /api/shop` - Get all products
- `GET /api/featured-products` - Get featured products
- `GET /api/bestseller` - Get bestseller products
- `GET /api/loved` - Get most loved products
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/orders` - Create order

## 📱 Features

- **Responsive Design**: Mobile-first approach with premium UI
- **Product Categories**: Browse by categories (Wooden Craft, Terracotta, Dokra Art)
- **Featured Products**: Handpicked collection showcase
- **Most Loved**: Customer favorites section
- **Weekly Bestsellers**: Popular products with filtering
- **Shopping Cart**: Add/remove items with real-time updates
- **User Authentication**: Login/register functionality
- **Admin Panel**: Product and category management

## 🎨 Design System

- **Color Scheme**: Orange (#ea580c) primary, with gray accents
- **Typography**: Modern sans-serif with serif italics for headings
- **Components**: Premium card designs with hover effects
- **Mobile**: 2-column grid layout with optimized touch targets

## 🔄 Current Status

- ✅ Frontend connected to deployed backend
- ✅ All API endpoints functional
- ✅ Mobile-responsive design
- ✅ Premium UI/UX implementation
- ✅ Product catalog with real images
- ✅ Shopping cart functionality

## 📞 Support

For any issues or questions, please check the configuration files and ensure all environment variables are properly set.

---

**Note**: The frontend is currently configured to use the deployed backend at `https://pawnbackend-xmqa.onrender.com`. To switch to local development, use the environment switching script or manually update the configuration.
