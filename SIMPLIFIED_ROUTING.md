# Simplified Routing Setup Guide

## 📁 File Structure

```
src/
├── constants/
│   └── routes.ts           # All route paths (change here when updating paths)
├── hooks/
│   └── useNav.ts           # Simple navigation hook
├── components/
│   └── ProtectedRoute.tsx  # Route protection wrapper
├── utils/
│   └── routeGuard.ts       # Auth logic (AUTH_ENABLED toggle here)
└── App.tsx                 # All routes defined inline
```

---

## 🚀 How to Use

### 1. Add a New Route

**Step 1:** Add constant to `src/constants/routes.ts`

```ts
export const ROUTES = {
  // ... existing
  SETTINGS: "/settings", // ← NEW
};
```

**Step 2:** Create page component `src/pages/SettingsPage.tsx`

```tsx
export default function SettingsPage() {
  return <div>Settings</div>;
}
```

**Step 3:** Add route to `src/App.tsx`

```tsx
// In the appropriate section (Public, Admin, etc)
<Route path={ROUTES.SETTINGS} element={<SettingsPage />} />

// Or if it needs protection:
<Route
  path={ROUTES.SETTINGS}
  element={
    <ProtectedRoute requiredRoles={["ADMIN"]}>
      <SettingsPage />
    </ProtectedRoute>
  }
/>
```

**Done!** No other files to modify.

---

### 2. Navigate Programmatically

**Using the hook:**

```tsx
import { useNav } from "@/hooks/useNav";

export default function MyComponent() {
  const { goHome, goLogin, go } = useNav();

  return (
    <>
      <button onClick={goHome}>Home</button>
      <button onClick={goLogin}>Login</button>
      <button onClick={() => go("/custom-path")}>Custom</button>
    </>
  );
}
```

**Or use React Router directly:**

```tsx
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const navigate = useNavigate();
navigate(ROUTES.HOME);
```

---

### 3. Protect Routes (Toggle Auth)

**Turn off auth during development:**

```ts
// src/utils/routeGuard.ts
export const AUTH_ENABLED = false; // ← Set to false to skip auth checks
```

**When all pages render without auth:**

- `ProtectedRoute` just renders children
- `isAuthenticated()` always returns true
- `getUserRole()` always returns 'ADMIN'

**Turn on auth when API is ready:**

```ts
export const AUTH_ENABLED = true; // ← Set to true to enable auth
```

---

## 📊 Route Categories

### Auth Routes (No Layout)

- `/login` → Login page
- `/register` → Register page

### Public Routes (UserLayout)

- `/` → Home
- `/apartment-detail/:id` → Apartment details

### Admin Routes (AdminLayout + Protected)

- `/admin/dashboard`
- `/admin/users`
- `/admin/subscription-plans`

### Landlord Routes (LandlordLayout + Protected)

- `/landlord/dashboard`
- `/landlord/apartments`

### Tenant Routes (TenantLayout + Protected)

- `/tenant/profile`

---

## 🔒 Protection Rules

- **Public routes** → Everyone can access
- **Auth routes** → Anyone not logged in
- **Admin/Landlord/Tenant routes** → Only that role can access (if `AUTH_ENABLED=true`)
- **Protected route with no role** → Just checks authentication

---

## 🎯 Quick Reference

| Task               | File                  | Change                                 |
| ------------------ | --------------------- | -------------------------------------- |
| Add/change path    | `constants/routes.ts` | Add CONSTANT                           |
| Add new page       | `App.tsx`             | Add `<Route>`                          |
| Navigate in code   | Use `useNav()` hook   | `const { go } = useNav()`              |
| Toggle auth        | `routeGuard.ts`       | `AUTH_ENABLED = true/false`            |
| Add layout to page | `App.tsx`             | Wrap in `<Route element={<Layout />}>` |

---

## 💡 Tips

- ✅ Always use `ROUTES.X` instead of hardcoding paths
- ✅ Keep `App.tsx` as the single source of truth for routes
- ✅ Use `ProtectedRoute` component to guard protected pages
- ✅ Set `AUTH_ENABLED = false` during early development
- ❌ Don't create separate route files (complexity increases)
- ❌ Don't hardcode navigation paths

---

## ✨ Summary

This is a **minimal setup** that:

- Keeps all routes visible in one place (`App.tsx`)
- No complex abstractions or multiple config files
- Easy to add/remove/modify routes
- Ready to switch to full auth when API is ready

Perfect for developing fast without backend API! 🚀
