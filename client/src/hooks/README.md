# Mutation Hooks System

This project uses a layered approach for handling API mutations with automatic toast notifications, query invalidation, and navigation.

## Architecture

```
useApiMutation (Base) → createMutation (Factory) → Services (Pre-configured)
```

## Usage Examples

### 1. Simple Usage (Recommended)

Use pre-configured service hooks for common operations:

```typescript
import { useLoginMutation, useLogoutMutation } from "../services";

// In your component
const loginMutation = useLoginMutation({
  onSuccess: (response) => {
    console.log("Welcome!", response.data.user.fullName);
  },
});

// Use it
loginMutation.mutate({ email, password });
```

### 2. Custom Mutations

For new API endpoints, create new service hooks:

```typescript
// In services/userService.ts
export const useUpdateProfileMutation = createMutation(userAPI.updateProfile, {
  showToasts: true,
  cacheKey: ["user"],
  dataExtractor: (response) => response.data,
  redirectTo: "/profile",
});
```

### 3. Advanced Usage

For complex scenarios, use the base hook directly:

```typescript
import { useApiMutation } from "../hooks/useApiMutation";

const customMutation = useApiMutation({
  mutationFn: someComplexAPI,
  showSuccessToast: "Custom message!",
  invalidateQueries: ["users", "posts"],
  onSuccess: (data) => {
    // Complex custom logic
  },
});
```

## Features

- ✅ Automatic toast notifications (success/error)
- ✅ Query cache management
- ✅ Loading states (`isLoading`)
- ✅ Automatic navigation
- ✅ Response message handling
- ✅ Type safety
- ✅ Reusable and DRY

## File Structure

```
hooks/
├── useApiMutation.ts     # Base generic hook
├── createMutation.ts     # Factory for creating mutations
└── README.md            # This file

services/
├── authService.ts       # Pre-configured auth mutations
├── index.ts            # Barrel exports
└── ...                 # Other service files
```
