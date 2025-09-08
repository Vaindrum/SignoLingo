import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

type AuthUser = {
  _id: string;
  username: string;
  profilePic: string;
  // add other fields returned from backend
};

type LoadingAction = "signup" | "login" | "logout" | "updateProfile" | "checkAuth" | null;

type AuthStore = {
  authUser: AuthUser | null;
  loadingAction: LoadingAction;   // ✅ single loading tracker

  checkAuth: () => Promise<void>;
  signup: (data: { name:string; username: string; email: string; password: string }) => Promise<boolean>;
  login: (data: { username: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: { username?: string; password?: string }) => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  loadingAction: null, // ✅ no action by default

  checkAuth: async () => {
    set({ loadingAction: "checkAuth" });
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error: any) {
      console.error("Error in checkAuth:", error.message);
      set({ authUser: null });
    } finally {
      set({ loadingAction: null });
    }
  },

  signup: async (data) => {
    set({ loadingAction: "signup" });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      return true;
      // toast.success("Account created successfully");
    } catch (error: any) {
      console.error("Error in signup:", error.message);
      return false;
      // toast.error(error.response.data.message);
    } finally {
      set({ loadingAction: null });
    }
  },

  login: async (data) => {
    set({ loadingAction: "login" });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged In Successfully");
      return true;
    } catch (error: any) {
      console.error("Error in login:", error.message);
      toast.error(error.response.data.message);
      return false;
    } finally {
      set({ loadingAction: null });
    }
  },

  logout: async () => {
    set({ loadingAction: "logout" });
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      // toast.success("Logged Out successfully");
    } catch (error: any) {
      console.error("Error in logout:", error.message);
      // toast.error(error.response.data.message);
    } finally {
      set({ loadingAction: null });
    }
  },

  updateProfile: async (data) => {
    set({ loadingAction: "updateProfile" });
    try {
      const res = await axiosInstance.patch("auth/update-profile", data);
      set({ authUser: res.data });
      // toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error in updateProfile:", error.message);
      // toast.error(error.response.data.message);
    } finally {
      set({ loadingAction: null });
    }
  },
}));
