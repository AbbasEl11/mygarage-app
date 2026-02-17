# 🚗 MyGarage App

**Modern vehicle management application built with Ionic + React (TypeScript)**

MyGarage is a full-stack vehicle inventory management system featuring a sleek glassmorphism UI design, comprehensive vehicle data tracking, and real-time image uploads.

🌐 **Live Demo:** [https://mygarage.abbas-el-mahmoud.com](https://mygarage.abbas-el-mahmoud.com)  
📡 **API Backend:** [https://mygarageapi.abbas-el-mahmoud.com/garage](https://mygarageapi.abbas-el-mahmoud.com/garage)  
🔗 **Backend Repository:** [MyGarage Backend](https://github.com/AbbasEl11/mygarage-backend)

---

## ✨ Features

- **Vehicle Management**: Complete CRUD operations for vehicle inventory
- **Image Gallery**: Multi-image upload with Swiper-powered gallery viewer
- **Modern UI**: Glassmorphism design with minimal black/white color scheme
- **Responsive Design**: Optimized for both mobile and desktop experiences
- **Offline Caching**: Local storage support for offline access
- **Real-time Updates**: Automatic page refresh on data changes
- **Comprehensive Forms**: Detailed vehicle specs, features, and extras tracking

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Ionic 8.5.0 + React 19.0.0
- **Language**: TypeScript 5.x
- **Build Tool**: Vite 5.x
- **Mobile**: Capacitor 7.4.0 (Android ready)
- **Carousel**: Swiper for image galleries
- **Storage**: Ionic Storage for offline caching

### Backend
- **Framework**: Django 5.2.3 + Django REST Framework
- **Database**: SQLite (development) | PostgreSQL ready
- **Media Handling**: WhiteNoise for static files
- **Deployment**: Docker + Docker Compose + Traefik

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js >= 18.x
npm >= 9.x
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AbbasEl11/mygarage-app.git
cd mygarage-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
   
Create `.env.local` in the project root:
```env
VITE_API_BASE_URL=https://mygarageapi.abbas-el-mahmoud.com/garage
```

For local development with backend running on localhost:8000:
```env
VITE_API_BASE_URL=http://localhost:8000/garage
```

4. **Start development server**
```bash
npm run dev
```

Application runs at `http://localhost:5173`

---

## 📦 Building for Production

```bash
npm run build
```

Build output: `dist/` directory

### Deployment

The application uses hash-based routing (`/#/route`) for compatibility with static hosting platforms.

**Build artifacts to upload:**
- All files from `dist/` directory

**Files NOT to upload** (already in `.gitignore`):
- `node_modules/`
- `.env.local`, `.env.production`
- `/android/build/`, `/android/app/build/`
- `/coverage/`, `/cypress/videos/`

---

## 📂 Project Structure

```
mygarage-app/
├── src/
│   ├── components/
│   │   └── Header.tsx              # Navigation header
│   ├── pages/
│   │   ├── Home.tsx                # Landing page with hero section
│   │   ├── Inventory.tsx           # Vehicle grid with management
│   │   ├── AddCar.tsx              # Vehicle creation form
│   │   └── CarDetails.tsx          # Vehicle detail view with gallery
│   ├── services/
│   │   └── carService.ts           # API service layer
│   ├── theme/
│   │   └── variables.css           # Design system tokens
│   ├── storage.ts                  # Offline storage config
│   ├── App.tsx                     # Root component with routing
│   └── main.tsx                    # Application entry point
├── public/
│   ├── logo.png                    # Application logo
│   └── manifest.json               # PWA manifest
├── android/                        # Capacitor Android project
├── capacitor.config.ts             # Capacitor configuration
├── vite.config.ts                  # Vite build configuration
└── package.json
```

---

## 🎨 Design System

### Color Scheme
- **Primary**: Minimal black/white monochrome palette
- **Background**: Dark (`#0a0e1a`)
- **Glassmorphism**: `rgba(255, 255, 255, 0.05)` with `backdrop-filter: blur(20px)`
- **Accents**: White with subtle shadows

### Typography
- **Headings**: Righteous (Google Fonts)
- **Body**: System font stack

---

## 🔌 API Integration

The app communicates with a Django REST API backend.

**Base URL**: Configured via `VITE_API_BASE_URL` environment variable

**Endpoints:**
- `GET /cars/` - List all vehicles
- `POST /cars/` - Create vehicle
- `GET /cars/{id}/` - Get vehicle details
- `DELETE /cars/{id}/` - Delete vehicle
- `POST /cars/{id}/upload-images/` - Upload vehicle images

API service documentation: See `src/services/carService.ts`

---

## 🧪 Testing

### End-to-End Testing
```bash
npm run cypress:open
```

### Unit Testing
```bash
npm test
```

---

## 📱 Mobile Development

### Android Build

1. **Add Android platform**
```bash
npx cap add android
```

2. **Sync web assets**
```bash
npm run build
npx cap sync
```

3. **Open in Android Studio**
```bash
npx cap open android
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Abbas El Mahmoud**
- GitHub: [@AbbasEl11](https://github.com/AbbasEl11)
- Website: [abbas-el-mahmoud.com](https://abbas-el-mahmoud.com)

---

## 🙏 Acknowledgments

- Built with [Ionic Framework](https://ionicframework.com/)
- UI inspiration from modern glassmorphism design trends
- Background images from [Unsplash](https://unsplash.com/)
