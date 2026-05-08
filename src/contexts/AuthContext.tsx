import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface UserProfile {
  user_id: string;
  full_name: string;
  mobile_number: string;
  address: string;
  avatar_url: string;
  is_admin: boolean;
}

interface User {
  id: string;
  email?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (token: string, userData: any) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAdmin: false,
  loading: true,
  signIn: () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch("http://localhost:7004/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setProfile(data.profile);
      } else {
        throw new Error("Invalid token");
      }
    } catch {
      localStorage.removeItem("token");
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = (token: string, userData: any) => {
    localStorage.setItem("token", token);
    setUser(userData);
    fetchProfile(token);
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin: !!profile?.is_admin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
