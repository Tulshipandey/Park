'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';

// Create a mock user type that mimics Firebase User
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

// Mock database of users
const mockUsers = [
  {
    email: 'test@example.com',
    password: 'password123',
    uid: 'user-123',
    displayName: 'Test User',
    emailVerified: true
  }
];

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  error: string | null;
  setError: (error: string | null) => void;
}

// Default context value
const defaultContext: AuthContextType = {
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  error: null,
  setError: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse saved user', e);
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user in our mock database
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('auth/invalid-credential');
      }
      
      const userObj: MockUser = {
        uid: foundUser.uid,
        email: foundUser.email,
        displayName: foundUser.displayName,
        emailVerified: foundUser.emailVerified
      };
      
      // Save to localStorage to persist login
      localStorage.setItem('auth_user', JSON.stringify(userObj));
      setUser(userObj);
    } catch (error: any) {
      console.error('Error signing in:', error);
      let errorMessage = 'Failed to sign in';
      
      if (error.message === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password';
      }
      
      setError(errorMessage);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('auth/email-already-in-use');
      }
      
      // Create new mock user
      const newUser = {
        email,
        password,
        uid: `user-${Math.random().toString(36).substring(2, 9)}`,
        displayName: email.split('@')[0],
        emailVerified: false
      };
      
      // Add to mock database
      mockUsers.push(newUser);
      
      const userObj: MockUser = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        emailVerified: newUser.emailVerified
      };
      
      // Save to localStorage to persist login
      localStorage.setItem('auth_user', JSON.stringify(userObj));
      setUser(userObj);
    } catch (error: any) {
      console.error('Error signing up:', error);
      let errorMessage = 'Failed to create account';
      
      if (error.message === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use';
      }
      
      setError(errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Remove from localStorage
      localStorage.removeItem('auth_user');
      setUser(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user exists
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('auth/user-not-found');
      }
      
      console.log(`Mock password reset email sent to ${email}`);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      let errorMessage = 'Failed to send password reset email';
      
      if (error.message === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      }
      
      setError(errorMessage);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      resetPassword,
      error,
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 