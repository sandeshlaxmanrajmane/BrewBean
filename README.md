# ☕ BrewBean Artisanal Coffee Co. — Authentication & Role-Based Management System

A production-grade, premium coffeehouse application featuring role-based access control, cryptographic user vaults, dynamic storefront, order tracking, and an executive Owner Dashboard.

---

## 🌟 Key Highlights & Architecture

### 1. Two Dedicated Roles
- **Owner (`OWNER`)**: Full administrative access to live orders queue, menu item creation/deletion/pricing, inventory level controls, sales analytics, and customer roster.
- **Customer (`CUSTOMER`)**: Public menu exploration, custom drink creation (milk, size, sweetness), cart preservation across sessions, checkout with Student vs Regular perks, pickup token generation, and live order tracking.

### 2. Login Entry Point (Requirement A)
- Main navigation bar includes a **"Login"** action button.
- Clicking opens a dual-card selection modal:
  - **Customer Login** (User / Coffee icon): *"Order your favorite coffee, manage your orders, and enjoy your BrewBean experience."*
  - **Owner Login** (Store / Dashboard icon): *"Manage your coffee shop, inventory, orders, and sales."*

### 3. Customer Authentication & Cart Preservation (Requirement B)
- Split-screen layout (desktop) / responsive single-column (mobile).
- Tabs for **Sign In** and **Create Account**.
- Strict validation: valid email regex, min 6-char password, password confirmation matching.
- **Cart Preservation**: Adding drinks to the cart *before* logging in preserves items intact throughout authentication and into checkout.
- Password visibility toggles, friendly error feedback, and "Forgot Password" modal.

### 4. Owner Authentication (Requirement C)
- Separate, protected page at `/owner/login`.
- **Dark espresso roast styling** with amber/gold accents, glowing highlights, and administrative security notices.
- No public registration exposed.
- Redirects directly to `/owner/dashboard` upon verification.

### 5. Owner Dashboard (Requirement D)
- Professional admin layout with sidebar navigation:
  1. **Overview**: 5 dynamic statistics cards (**Total Orders**, **Today's Revenue**, **Pending Orders**, **Total Menu Items**, **Low Stock Items**) computed from actual real-time application data.
  2. **Orders**: Full order management queue with live status transitions: `Placed` → `Preparing` → `Ready` → `Completed` → `Cancelled`. Includes pickup counter assignment and token verification.
  3. **Menu Management**: Add, edit, delete menu items, change prices, change stock, change category, change photo presets, and toggle visibility. Strict validation prevents invalid prices ($0 or negative) and negative stock.
  4. **Inventory**: Real-time stock status badges (`OK`: 10+, `LOW`: <10, `OUT OF STOCK`: 0) with quick `-1`, `+1`, `+5`, `+20` adjusters, manual input, and a 1-click **Batch Restock All Low Items** action.
  5. **Sales & Analytics**: Charts and breakdowns reflecting real data: Daily sales timeline bar chart, Student vs Regular customer ratio, category performance, and best-selling roast ranking.
  6. **Customers**: Registry of users actually collected by the app, displaying order counts, lifetime spend, and an **Inspect Order History** modal.
  7. **Settings**: Owner profile editor, password update with cryptographic re-hashing, store preferences (pickup counters, student discount rate, tax rate, auto-accept toggle), and full Supabase Row Level Security (RLS) PostgreSQL schema viewer.

### 6. Role-Based Access Control (RBAC) (Requirement E)
- Customers cannot access `/owner/*` routes. Direct URL access is blocked.
- Owners cannot accidentally checkout as a customer account.
- Unauthenticated users attempting to access protected pages (`/customer/profile`, `/customer/orders`, `/owner/dashboard`) are redirected to the corresponding login page.
- Logout cleanly clears all sessions and returns to the storefront.

### 7. Security & Cryptographic Storage (Requirement F)
- **Zero Plaintext Passwords**: Uses browser **SubtleCrypto PBKDF2** with **SHA-256**, 100,000 iterations, and unique 16-byte random salts.
- Complete **Supabase PostgreSQL Schema with Row Level Security (RLS)** policies included and inspectable in Owner Settings.

---

## 🔑 Demo Evaluation Credentials

Both accounts are pre-seeded in the cryptographic vault. The login pages also feature a **1-click autofill button** for instant testing:

| Role | Email / Identifier | Password | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **Store Owner** | `owner@brewbean.com` | `OwnerBean#2026` | Full administrative console, order status updates, menu and inventory management, analytics. |
| **Customer** | `alex.customer@brewbean.com` | `CoffeeLover#2026` | 10% Student Scholar perk, order history, live cup tracking, cart preservation. |

---

## 🚀 Running the Project

```bash
# Navigate to the project directory


# Start the Vite development server
npm run dev
```

Visit `https://brew-bean-ashen.vercel.app/` in your browser.
