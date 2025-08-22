export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "super_admin"
  avatar?: string
  createdAt: string
  lastLogin?: string
  status: "active" | "inactive"
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@raffle.com",
    name: "John Admin",
    role: "super_admin",
    avatar: "/admin-avatar.png",
    createdAt: "2024-01-01",
    lastLogin: "2024-02-10",
    status: "active",
  },
  {
    id: "2",
    email: "sarah@raffle.com",
    name: "Sarah Manager",
    role: "admin",
    avatar: "/manager-avatar.png",
    createdAt: "2024-01-15",
    lastLogin: "2024-02-09",
    status: "active",
  },
  {
    id: "3",
    email: "mike@raffle.com",
    name: "Mike Support",
    role: "admin",
    createdAt: "2024-02-01",
    lastLogin: "2024-02-08",
    status: "inactive",
  },
]

export const DEFAULT_ADMIN_CREDENTIALS = {
  email: "admin@raffle.com",
  password: "admin123",
}
