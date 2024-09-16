# Artist System

Artist System is a React application built using TypeScript, Tailwind CSS, and Vite. It uses libraries like `react-hook-form` for form handling and `react-query` for data fetching and caching.

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v20 or later)
- **npm** or **yarn**

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/its-sangam/ar-web.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd ar-web
   ```

3. **Copy the `.env.example` file to `.env`:**

   ```bash
   cp .env.example .env
   ```

4. **Install dependencies:**

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

   The application will run on `http://localhost:5173`.

6. **Build for production:**

   To build the application for production, run:

   ```bash
   npm run build
   ```

   This will generate the production files in the `dist` folder.

7. **Preview the production build:**

   After building, you can preview the production build using:

   ```bash
   npm run preview
   ```

   The application will serve from the `dist` folder.