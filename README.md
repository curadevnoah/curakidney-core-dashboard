# CuraKidney Dashboard

A modern, responsive web dashboard built for CuraKidney MVP1, providing comprehensive kidney health management and monitoring capabilities.

## 🚀 Project Overview

The CuraKidney Dashboard is a React-based web application designed to provide healthcare professionals with an intuitive interface for managing kidney health data, patient information, and treatment plans. Built with modern web technologies, it offers a seamless user experience with real-time data visualization and comprehensive reporting features.

### Key Features

- **Modern React Architecture**: Built with React 19 and TypeScript for type safety
- **Responsive Design**: Optimized for desktop and mobile devices using Tailwind CSS
- **Interactive Charts**: Data visualization using ApexCharts and React ApexCharts
- **Calendar Integration**: FullCalendar integration for appointment and event management
- **Drag & Drop**: Interactive drag and drop functionality for enhanced UX
- **Form Management**: Advanced form handling with React Hook Form
- **Routing**: Client-side routing with React Router
- **Maps Integration**: World map visualization with React JVectorMap

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18.0.0 or higher)

  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm** (v9.0.0 or higher) - comes with Node.js

  - Verify installation: `npm --version`

- **Git** (v2.30.0 or higher)
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

## 🛠️ Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/curadevnoah/curakidney-core-dashboard
cd curakidney-core-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### 4. Build for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### 5. Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## 🚀 Deployment

### Automatic Deployment via Railway

This project is configured for automatic deployment using **Railway Cloud** (https://railway.app). The deployment process is fully automated and includes:

#### Deployment Configuration

- **Build System**: Uses Nixpacks for optimized builds
- **Web Server**: Caddy web server for production serving
- **Environment**: Railway automatically handles environment variables and HTTPS
- **Health Checks**: Built-in health check endpoint at `/health`

#### Deployment Features

- **Automatic HTTPS**: Railway handles SSL certificates
- **Global CDN**: Fast global content delivery
- **Auto-scaling**: Automatic scaling based on traffic
- **Zero-downtime**: Seamless deployments with no service interruption

#### Railway Configuration Files

- `nixpacks.toml`: Build configuration for Railway
- `Caddyfile`: Web server configuration for production

### Manual Deployment

If you need to deploy manually to other platforms:

1. Build the project: `npm run build`
2. Serve the `dist/` directory using any static file server
3. Configure your web server to handle client-side routing (SPA fallback)

## 📁 Project Structure

```
curakidney-core-dashboard/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── layout/        # Layout components
│   ├── hooks/         # Custom React hooks
│   ├── context/       # React context providers
│   ├── assets/        # Static assets
│   └── icons/         # Icon components
├── public/            # Public static files
├── dist/              # Production build output
├── package.json       # Dependencies and scripts
├── vite.config.ts     # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
├── nixpacks.toml      # Railway build configuration
└── Caddyfile          # Production web server configuration
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🔧 Technology Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: ApexCharts
- **Calendar**: FullCalendar
- **Forms**: React Hook Form
- **Routing**: React Router
- **Maps**: React JVectorMap
- **Web Server**: Caddy (production)

## 📝 Environment Variables

The application uses the following environment variables:

- `PORT`: Server port (default: 3000, automatically set by Railway)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run lint`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is proprietary software developed for CuraKidney.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
