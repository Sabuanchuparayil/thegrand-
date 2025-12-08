// Authentication utilities and session management

import { client } from "@/lib/sanity/client";
import { hasPermission, UserRole } from "./config";

export interface User {
  _id: string;
  email: string;
  name: string;
  phone: string;
  whatsapp?: string;
  role: UserRole;
  permissions?: string[];
  avatar?: any;
  isActive?: boolean;
}

export interface Session {
  user: User;
  expires: string;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );
    if (!user) return null;
    // Ensure the user matches the User interface
    return {
      _id: user._id || "",
      email: user.email || "",
      name: user.name || "",
      phone: user.phone || "",
      whatsapp: user.whatsapp,
      role: user.role || "customer",
      permissions: (user as any).permissions,
      avatar: (user as any).avatar,
      isActive: user.isActive !== false,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await client.fetch(
      `*[_type == "user" && _id == $id][0]`,
      { id }
    );
    if (!user) return null;
    // Ensure the user matches the User interface
    return {
      _id: user._id || "",
      email: user.email || "",
      name: user.name || "",
      phone: user.phone || "",
      whatsapp: user.whatsapp,
      role: user.role || "customer",
      permissions: (user as any).permissions,
      avatar: (user as any).avatar,
      isActive: user.isActive !== false,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

/**
 * Create new user
 */
export async function createUser(userData: {
  email: string;
  name: string;
  phone: string;
  whatsapp?: string;
  role?: UserRole;
}): Promise<User | null> {
  try {
    const user = await client.create({
      _type: "user",
      ...userData,
      role: userData.role || "customer",
      isActive: true,
    });
    // Map Sanity document to User interface
    return {
      _id: user._id || "",
      email: user.email || userData.email,
      name: user.name || userData.name,
      phone: user.phone || userData.phone,
      whatsapp: user.whatsapp || userData.whatsapp,
      role: user.role || userData.role || "customer",
      permissions: (user as any).permissions,
      avatar: (user as any).avatar,
      isActive: user.isActive !== false,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

/**
 * Update user
 */
export async function updateUser(
  userId: string,
  updates: Partial<User>
): Promise<User | null> {
  try {
    const updatedUser = await client
      .patch(userId)
      .set(updates)
      .commit();
    // Map Sanity document to User interface
    return {
      _id: updatedUser._id || userId,
      email: updatedUser.email || "",
      name: updatedUser.name || "",
      phone: updatedUser.phone || "",
      whatsapp: updatedUser.whatsapp,
      role: updatedUser.role || "customer",
      permissions: updatedUser.permissions,
      avatar: updatedUser.avatar,
      isActive: updatedUser.isActive !== false,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

/**
 * Get all users
 */
export async function getAllUsers(limit: number = 100): Promise<User[]> {
  try {
    const users = await client.fetch(
      `*[_type == "user"] | order(_createdAt desc) [0...${limit}]`
    );
    if (!users || !Array.isArray(users)) return [];
    // Map Sanity documents to User interface
    return users.map((user: any) => ({
      _id: user._id || "",
      email: user.email || "",
      name: user.name || "",
      phone: user.phone || "",
      whatsapp: user.whatsapp,
      role: user.role || "customer",
      permissions: (user as any).permissions,
      avatar: (user as any).avatar,
      isActive: user.isActive !== false,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

/**
 * Check if user has permission
 */
export function checkPermission(
  user: User | null,
  permission: string
): boolean {
  if (!user || !user.isActive) {
    return false;
  }
  return hasPermission(user.role, user.permissions, permission);
}

