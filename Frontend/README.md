# Quest Life - React Application

A modern, clean React application built with Tailwind CSS featuring a custom black-and-white color palette.

## 🎨 Color Palette

| Purpose | Color Name | Hex Code | Use Case |
|---------|------------|----------|----------|
| Primary Black | Jet Black | #000000 | Main text, headings, primary buttons |
| Soft Black | Charcoal | #1A1A1A | Backgrounds, cards, dark UI elements |
| Dark Gray | Onyx | #2E2E2E | Secondary text, dividers, footer |
| Medium Gray | Dim Gray | #6E6E6E | Descriptions, placeholders, outlines |
| Light Gray | Gainsboro | #DCDCDC | Backgrounds, borders, hover effects |
| Very Light Gray | Smoke | #F5F5F5 | Section backgrounds, form inputs |
| Pure White | White | #FFFFFF | Main background, text on dark backgrounds |
| Off White | Snow | #FAFAFA | Soft backgrounds, minimal design accents |

## ✨ Features

- **Modern Design**: Clean, minimalist interface with elegant typography
- **Responsive Navigation**: Mobile-friendly navbar with smooth transitions
- **Authentication UI**: Login/Signup pages with form validation
- **Routing**: React Router with 6 main routes (Home, Dummy2, Dummy3, Dummy4, Login, Signup)
- **Custom Styling**: Tailwind CSS with custom color palette
- **Dark Theme Aesthetics**: Consistent black and gray color scheme
- **Form Components**: Modern form inputs with focus states and validation

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   └── Navbar.jsx          # Responsive navigation component
├── pages/
│   ├── Home.jsx           # Home page with centered "Quest Life" text
│   ├── Login.jsx          # Login page with email/password form
│   ├── Signup.jsx         # Signup page with username/email/password form
│   ├── Dummy2.jsx         # Sample page with content layout
│   ├── Dummy3.jsx         # Sample page with grid layout
│   └── Dummy4.jsx         # Sample page with contact layout
├── App.jsx                # Main app component with routing
├── main.jsx              # React entry point
└── index.css             # Global styles and Tailwind imports
```

## 🔐 Authentication Pages

### Login Page (`/login`)
- **Email & Password** fields with validation
- **Remember Me** checkbox
- **Forgot Password** link
- **Sign up** link for new users
- Responsive design with focus states

### Signup Page (`/signup`)
- **Username, Email & Password** fields
- **Confirm Password** field
- Form validation and error handling
- **Sign in** link for existing users
- Full-width form layout

### Design Features
- **Centered Layout**: Both pages are vertically and horizontally centered
- **Custom Colors**: Uses the defined color palette throughout
- **Focus States**: Input fields show Jet Black focus rings
- **Hover Effects**: Smooth transitions on interactive elements
- **Responsive**: Works seamlessly on mobile and desktop

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Design Principles

- **Minimalist**: Clean, uncluttered interface
- **Elegant**: Sophisticated typography and spacing
- **Modern**: Contemporary design patterns and interactions
- **Responsive**: Works seamlessly across all device sizes
- **Consistent**: Uniform color usage and component styling
- **Accessible**: Proper form labels and focus management

## 🔧 Technologies Used

- React 19
- React Router DOM
- Tailwind CSS 4
- Vite
- ESLint
