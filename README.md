# Food Delivery Order Management System

Welcome to the Food Delivery Order Management System, a simple and functional full-stack application that allows users to place orders, view menus, and track order status.

## Table of Contents
- [How to Run the Product](#how-to-run-the-product)
- [User Flow](#user-flow)
- [Folder Structure](#folder-structure)
- [Techniques & Technologies Used](#techniques--technologies-used)
- [Optimizations](#optimizations)

---

## How to Run the Product

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```
   *(The server will typically start on `http://localhost:5000` or the port specified in your environment variables)*

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the provided local URL (usually `http://localhost:5173`) in your browser to view the app.

---

## User Flow

1. **Menu Browsing:**
   - When the user lands on the homepage, they can see a visually appealing list of food items.
   - Each item displays its name, description, price, and an image.

2. **Adding to Cart:**
   - The user can select specific items and add them to the cart.
   - The user can adjust the quantity of each food item directly from the cart UI.

3. **Checkout Process:**
   - Once satisfied, the user proceeds to checkout.
   - The user enters their delivery details (Name, Address, Phone Number).
   - Upon submitting the checkout form, an API request is sent to the backend to create the order.

4. **Order Status Tracking:**
   - After the order is placed, the user is redirected to an Order Tracking page or modal.
   - The status updates dynamically (e.g., “Order Received” ➔ “Preparing” ➔ “Out for Delivery”).

---

## Folder Structure

```text
RaftLabs-Ass/
├── backend/
│   ├── controllers/      # Logic for API endpoints (orders, menu)
│   ├── models/           # Data schemas (in-memory or DB models)
│   ├── routes/           # Express routes mapping to controllers
│   ├── tests/            # TDD: Unit & Integration tests for APIs
│   ├── server.js         # Entry point for the Express app
│   └── package.json
│
└── frontend/
    ├── public/           # Static assets
    ├── src/
    │   ├── Components/   # Reusable UI components (Navbar, MenuSection, etc.)
    │   ├── Pages/        # Application pages (ProductDetail, Signup, etc.)
    │   ├── services/     # API client for calling backend endpoints
    │   ├── utils/        # Helper functions
    │   ├── App.tsx       # Main React Component
    │   └── main.tsx      # Entry point for React
    ├── package.json
    └── vite.config.ts
```

---

## Techniques & Technologies Used

- **Frontend:** React with Vite, TypeScript. Styled for a premium, responsive feel.
- **Backend:** Node.js with Express. RESTful architecture.
- **Database:** In-memory storage (or a lightweight DB like SQLite/MongoDB depending on the exact implementation).
- **Testing (TDD):** Jest/Supertest for backend endpoints, ensuring robust CRUD operations and input validations.
- **State Management:** React Context API or specialized hooks for managing Cart state and User data.
- **AI Tools (e.g., GitHub Copilot / Gemini):** Leveraged to generate project plan, and write UI code and suggest UI optimizations.

---

## Optimizations

1. **Component Reusability:** Built the UI using small, focused React components (like `Navbar`, `MenuSection`) to keep the codebase DRY and maintainable.
2. **Performance:** Used Vite for the frontend to ensure instant server start and lightning-fast HMR (Hot Module Replacement).
3. **Simulated Real-Time Updates:** The backend leverages periodic status updates or WebSockets (if implemented) to push real-time order status to the frontend without heavy polling.
4. **Clean Code & Validation:** Strong input validation on the backend ensures security and prevents edge cases, handling errors gracefully.
5. **Modern Aesthetics:** Implemented smooth hover states, micro-animations, and a sleek layout to provide a premium user experience.
