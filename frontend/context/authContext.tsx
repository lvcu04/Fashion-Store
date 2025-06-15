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
import { API } from "@/constants/api";


// Interface định nghĩa kiểu dữ liệu cho context
interface AuthContextType {
  firebaseUser: User | null;
  userProfile: any;
  isAuthenticated: boolean;
  loading: boolean;
  role: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  handleGoogleLogin: () => Promise<User | null>;
  handleFacebookLogin: () => Promise<User | null>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL: string) => Promise<void>;
  updateUserEmail: (newEmail: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
}

// Tạo context
export const AuthContext = createContext<AuthContextType | null>(null);

// Provider chính
export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  


  // Lấy role từ server
  const fetchRole = async (user: User) => {
    try {
      const token = await user.getIdToken();
      console.log("Fetching role with token:", token);
      const response = await fetch(`${API.user.role}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch role");
      const data = await response.json();
      setRole(data.role);
      console.log("Fetched role:", data.role);
    } catch (error) {
      console.error("Failed to fetch role:", error);
      setRole(null);
    }
  };

  //Lấy thông tin user từ backend
  const fetchUserProfile = async (user: User) => {
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${API.user.getById}`,{  
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch user profile");
      const data = await response.json();
      setUserProfile(data);
     
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUserProfile(null);
    }
  };

  // Theo dõi auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setIsAuthenticated(!!user);
      if (user) {
        await fetchRole(user);
        await fetchUserProfile(user);
      } else {
        setRole(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Đăng nhập
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setIsAuthenticated(true);
      await fetchRole(user);
      await fetchUserProfile(user);
  
    } catch (error: any) {
      setIsAuthenticated(false);
      switch (error.code) {
        case "auth/invalid-email":
          alert("Email không hợp lệ!");
          break;
        case "auth/user-not-found":
          alert("Tài khoản không tồn tại!");
          break;
        case "auth/wrong-password":
          alert("Sai mật khẩu!");
          break;
        default:
          alert("Đăng nhập thất bại. Vui lòng thử lại sau.");
      }
    }
  };

  // Đăng xuất
  const logout = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setUserProfile(null);
      setRole(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Đăng ký
  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setIsAuthenticated(true);
      await fetchRole(user);
      await fetchUserProfile(user);
    
    } catch (error) {
      console.error("Registration error:", error);
      setIsAuthenticated(false);
    }
  };

  // Đăng nhập bằng Google
 const handleGoogleLogin = async (): Promise<User | null> => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    setIsAuthenticated(true);
    await fetchRole(user);
    await fetchUserProfile(user);
    return user; // Trả về user nếu đăng nhập thành công
  } catch (error) {
    console.error("Google login error:", error);
    return null; // Trả về null nếu có lỗi
  }
};
//Đăng nhập bằng Facebook
const handleFacebookLogin = async (): Promise<User | null> => {
  try {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    setIsAuthenticated(true);
    await fetchRole(user);
    await fetchUserProfile(user);
    return user; // Trả về user nếu đăng nhập thành công
  } catch (error) {
    console.error("Facebook login error:", error);
    return null; // Trả về null nếu có lỗi
  }
};


  // Gửi email reset mật khẩu
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Đã gửi email đặt lại mật khẩu!");
    } catch (error) {
      console.error("Password reset error:", error);
    }
  };

  // Cập nhật tên và ảnh đại diện
  const updateUserProfile = async (displayName: string, photoURL: string) => {
    if (firebaseUser) {
      try {
        await updateProfile(firebaseUser, { displayName, photoURL });
        alert("Đã cập nhật hồ sơ!");
      } catch (error) {
        console.error("Profile update error:", error);
      }
    }
  };

  // Cập nhật email
  const updateUserEmail = async (newEmail: string) => {
    if (firebaseUser) {
      try {
        await updateEmail(firebaseUser, newEmail);
        alert("Đã cập nhật email!");
      } catch (error) {
        console.error("Email update error:", error);
      }
    }
  };

  // Cập nhật mật khẩu
  const updateUserPassword = async (newPassword: string) => {
    if (firebaseUser) {
      try {
        await updatePassword(firebaseUser, newPassword);
        alert("Đã cập nhật mật khẩu!");
      } catch (error) {
        console.error("Password update error:", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userProfile,
        isAuthenticated,
        loading,
        role,
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

// Hook sử dụng Auth
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};
