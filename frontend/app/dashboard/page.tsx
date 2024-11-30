"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  fullName: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const fetchUserData = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "An error occurred.",
          variant: "destructive",
        });
        localStorage.removeItem("userToken");
        router.push("/");
      } else {
        toast({
          title: "Error",
          description: "Unexpected error occurred.",
          variant: "destructive",
        });
        localStorage.removeItem("userToken");
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setUser(null);
    router.push("/");
  };

  if(loading){
    return <div>Loading...</div>
  }

  return (
    <div className="p-6 italic">
      <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/95 text-gray-600 backdrop-blur-lg transition-all">
        <MaxWidthWrapper className="">
          <div className="flex justify-between items-center h-14 border-b border-zinc-200">
            <Link
              href="/dashboard"
              className="flex z-40 font-semibold lg:text-lg italic"
            >
              solve<span className="text-sky-500">itout</span>
            </Link>
            <div className="h-full flex items-center space-x-4">
              {user ? (
                <>
                  <div>{user.email}</div>
                  <div onClick={handleLogout} className="text-pink-700 cursor-pointer hover:bg-gray-100 px-3 py-1 rounded">Logout</div>
                </>
              ) : (
                <Link href="/">Login</Link>
              )}
            </div>
          </div>
        </MaxWidthWrapper>
      </nav>
      {user ? (
        <div className="flex justify-center items-center w-full mt-28">
          <h1 className="text-2xl font-semibold italic text-sky-800">Welcome, {user.fullName}</h1>
        </div>
      ) : (
        <p>User data not available</p>
      )}
    </div>
  );
};

export default Dashboard;
