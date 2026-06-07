import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onIdTokenChanged, signOut, type User } from "firebase/auth";
import { firebaseConfigured, getFirebaseAuth } from "@/lib/firebase";

interface AuthCtx {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  configured: boolean;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  isAdmin: false,
  loading: true,
  configured: false,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    return onIdTokenChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const token = await u.getIdTokenResult();
          setIsAdmin(!!token.claims.admin);
        } catch (err) {
          console.error("Error fetching token claims", err);
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
        isAdmin,
        loading,
        configured: firebaseConfigured,
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
