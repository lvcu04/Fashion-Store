import React, { useEffect, createContext, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  User,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean | undefined;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
  handleFacebookLogin: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL: string) => Promise<void>;
  updateUserEmail: (newEmail: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
    } catch (error: any) {
      setIsAuthenticated(false);
  
      // Kiểm tra mã lỗi
      switch (error.code) {
        case "auth/invalid-email":
          alert("Email không hợp lệ !");
          break;
        case "auth/user-not-found":
          alert("Tài khoản không tồn tại !");
          break;
        case "auth/wrong-password":
          alert("Sai mật khẩu !");
          break;
        default:
          alert("Đăng nhập thất bại. Vui lòng thử lại sau.");
      }
      
    }
  };
  

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Registration error:", error);
      setIsAuthenticated(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Facebook login error:", error);
    }
  };
  

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset error:", error);
    }
  };

  const updateUserProfile = async (displayName: string, photoURL: string) => {
    if (user) {
      try {
        await updateProfile(user, { displayName, photoURL });
      } catch (error) {
        console.error("Profile update error:", error);
      }
    }
  };

  const updateUserEmail = async (newEmail: string) => {
    if (user) {
      try {
        await updateEmail(user, newEmail);
      } catch (error) {
        console.error("Email update error:", error);
      }
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    if (user) {
      try {
        await updatePassword(user, newPassword);
      } catch (error) {
        console.error("Password update error:", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        register,
        resetPassword,
        updateUserProfile,
        updateUserEmail,
        updateUserPassword,
        handleGoogleLogin,
        handleFacebookLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
