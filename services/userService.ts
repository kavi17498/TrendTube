export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  password: string;
  createdAt: string;
  avatar?: string;
  role: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

// In-memory user storage for demo purposes
// In a real app, this would be stored in AsyncStorage or a database
let users: User[] = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john@example.com',
    username: 'admin',
    password: 'password',
    createdAt: new Date().toISOString(),
    role: 'Movie Explorer'
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    username: 'jane',
    password: '123456',
    createdAt: new Date().toISOString(),
    role: 'Movie Explorer'
  },
  {
    id: '3',
    fullName: 'Alice Johnson',
    email: 'alice@example.com',
    username: 'alice',
    password: 'alice123',
    createdAt: new Date().toISOString(),
    role: 'Cinema Enthusiast'
  },
  {
    id: '4',
    fullName: 'Bob Wilson',
    email: 'bob@example.com',
    username: 'bob',
    password: 'bob456',
    createdAt: new Date().toISOString(),
    role: 'Film Critic'
  }
];

class UserService {
  constructor() {
    // Log available test accounts for development
    console.log('📱 Available Test Accounts:');
    console.log('1. Username: admin, Password: password (John Doe)');
    console.log('2. Username: jane, Password: 123456 (Jane Smith)');
    console.log('3. Username: alice, Password: alice123 (Alice Johnson)');
    console.log('4. Username: bob, Password: bob456 (Bob Wilson)');
  }

  // Get all users
  getUsers(): User[] {
    return users;
  }

  // Check if username already exists
  isUsernameExists(username: string): boolean {
    return users.some(user => user.username.toLowerCase() === username.toLowerCase());
  }

  // Check if email already exists
  isEmailExists(email: string): boolean {
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  }

  // Register a new user
  register(userData: RegisterData): { success: boolean; message: string; user?: User } {
    try {
      // Validate input
      if (!userData.fullName?.trim()) {
        return { success: false, message: 'Full name is required' };
      }
      if (!userData.email?.trim()) {
        return { success: false, message: 'Email is required' };
      }
      if (!userData.username?.trim()) {
        return { success: false, message: 'Username is required' };
      }
      if (!userData.password?.trim()) {
        return { success: false, message: 'Password is required' };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return { success: false, message: 'Please enter a valid email address' };
      }

      // Validate username length
      if (userData.username.length < 3) {
        return { success: false, message: 'Username must be at least 3 characters long' };
      }

      // Validate password length
      if (userData.password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters long' };
      }

      // Check if username already exists
      if (this.isUsernameExists(userData.username)) {
        return { success: false, message: 'Username already exists' };
      }

      // Check if email already exists
      if (this.isEmailExists(userData.email)) {
        return { success: false, message: 'Email already exists' };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        fullName: userData.fullName.trim(),
        email: userData.email.trim().toLowerCase(),
        username: userData.username.trim(),
        password: userData.password, // In a real app, this should be hashed
        createdAt: new Date().toISOString(),
        role: 'Movie Explorer'
      };

      users.push(newUser);

      return { 
        success: true, 
        message: 'Account created successfully!', 
        user: { ...newUser, password: '' } // Don't return password
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Failed to create account. Please try again.' };
    }
  }

  // Login user
  login(credentials: LoginCredentials): { success: boolean; message: string; user?: User } {
    try {
      if (!credentials.username?.trim()) {
        return { success: false, message: 'Username is required' };
      }
      if (!credentials.password?.trim()) {
        return { success: false, message: 'Password is required' };
      }

      const user = users.find(u => 
        u.username.toLowerCase() === credentials.username.toLowerCase() &&
        u.password === credentials.password
      );

      if (user) {
        return { 
          success: true, 
          message: 'Login successful!', 
          user: { ...user, password: '' } // Don't return password
        };
      } else {
        return { success: false, message: 'Invalid username or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }

  // Get user by username
  getUserByUsername(username: string): User | null {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user) {
      return { ...user, password: '' }; // Don't return password
    }
    return null;
  }
}

export const userService = new UserService();