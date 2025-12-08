// Authentication configuration and role-based permissions

export type UserRole = "customer" | "admin" | "manager" | "staff";

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export const PERMISSIONS: Record<string, Permission> = {
  view_products: {
    id: "view_products",
    name: "View Products",
    description: "Can view product catalog",
  },
  edit_products: {
    id: "edit_products",
    name: "Edit Products",
    description: "Can create and edit products",
  },
  delete_products: {
    id: "delete_products",
    name: "Delete Products",
    description: "Can delete products",
  },
  view_orders: {
    id: "view_orders",
    name: "View Orders",
    description: "Can view orders",
  },
  edit_orders: {
    id: "edit_orders",
    name: "Edit Orders",
    description: "Can update order status",
  },
  delete_orders: {
    id: "delete_orders",
    name: "Delete Orders",
    description: "Can delete orders",
  },
  view_users: {
    id: "view_users",
    name: "View Users",
    description: "Can view user list",
  },
  edit_users: {
    id: "edit_users",
    name: "Edit Users",
    description: "Can edit user information",
  },
  delete_users: {
    id: "delete_users",
    name: "Delete Users",
    description: "Can delete user accounts",
  },
  view_analytics: {
    id: "view_analytics",
    name: "View Analytics",
    description: "Can view analytics and reports",
  },
  manage_pricing: {
    id: "manage_pricing",
    name: "Manage Pricing",
    description: "Can manage dynamic pricing",
  },
  send_marketing: {
    id: "send_marketing",
    name: "Send Marketing",
    description: "Can send marketing communications",
  },
};

// Role-based default permissions
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  customer: [
    "view_products",
    "view_orders", // Can view their own orders
  ],
  staff: [
    "view_products",
    "view_orders",
    "edit_orders",
  ],
  manager: [
    "view_products",
    "edit_products",
    "view_orders",
    "edit_orders",
    "view_users",
    "edit_users",
    "view_analytics",
    "send_marketing",
  ],
  admin: [
    "view_products",
    "edit_products",
    "delete_products",
    "view_orders",
    "edit_orders",
    "delete_orders",
    "view_users",
    "edit_users",
    "delete_users",
    "view_analytics",
    "manage_pricing",
    "send_marketing",
  ],
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  userRole: UserRole,
  userPermissions: string[] | undefined,
  permission: string
): boolean {
  // Check explicit user permissions first
  if (userPermissions?.includes(permission)) {
    return true;
  }

  // Check role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

/**
 * Get all permissions for a user
 */
export function getUserPermissions(
  userRole: UserRole,
  userPermissions: string[] | undefined
): string[] {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  const explicitPermissions = userPermissions || [];
  
  // Combine and deduplicate
  return Array.from(new Set([...rolePermissions, ...explicitPermissions]));
}

/**
 * Check if user can perform an action
 */
export function canPerformAction(
  userRole: UserRole,
  userPermissions: string[] | undefined,
  action: string
): boolean {
  return hasPermission(userRole, userPermissions, action);
}

