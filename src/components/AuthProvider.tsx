import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { firebaseConfigured, getFirebaseAuth } from "@/lib/firebase";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  configured: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  configured: false,
  isAdmin: false,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const token = await u.getIdTokenResult();
          setIsAdmin(!!token.claims.admin);
        } catch (e) {
          console.error("Failed to get ID token result", e);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
  }, []);

  return (
    <Ctx.Provider
      value={{
        user,
        loading,
        configured: firebaseConfigured,
        isAdmin,
        logout: async () => {
          const auth = getFirebaseAuth();
          if (auth) await signOut(auth);
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
