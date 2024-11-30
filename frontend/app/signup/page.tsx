"use client";

import { useState } from "react";

import { toast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";

import axios from "axios";
import { useRouter } from "next/navigation";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const isValidName = (name: string) => name.trim().length > 3;
  const handleSignup = async () => {
    try {
      setLoading(true);
      //console.log(fullName, email);
      const response = await axios.post(`http://localhost:5000/auth/signup`, {
        fullName, email
      });
      toast({ description: response.data.message, variant: "default" });
      setIsOtpSent(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data?.message || "An error occurred.",
          variant: "destructive",
        });
      } else {
        toast({
          description: "Unexpected error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:5000/auth/verify-otp`,
        {
          email,
          otp,
        }
      );
      //console.log(response.data);
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("userToken", response.data.user.token);
        toast({ description: response.data.message, variant: "default" });
        router.push("/dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "An error occurred.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Unexpected error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-1 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-14 xl:pt-12 lg:pb-52">
      {!isOtpSent ? (
        <div className="grid place-items-center mx-auto w-full max-w-lg text-lg">
          <h2 className="text-gray-800 text-5xl">
            Solve<span className="text-sky-500">ItOut</span>
          </h2>
          <h2 className="text-gray-800 text-3xl mt-16 mb-8">register</h2>
          <input
            type="text"
            className="py-4 px-5 border border-gray-500 rounded-2xl outline-none mt-10 w-full text-gray-700 focus:border-2 focus:border-sky-500"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {fullName && fullName.trim().length <= 3 && (
            <p className="text-red-500 text-sm mt-2">
              Name must be more than 3 characters.
            </p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="py-4 px-5 border border-gray-500 rounded-2xl text-gray-700 outline-none mt-10 w-full focus:border-2 focus:border-sky-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {email && !isValidEmail(email) && (
            <p className="text-red-500 text-sm mt-2 mb-6">
              Please enter a valid email address. Otp verification will be sent.
            </p>
          )}

          <button
            className={`py-3 px-5 rounded-2xl mt-10 ${
              !isValidName || email.trim() === "" || !isValidEmail(email)
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-sky-800 text-white"
            } text-lg mb-10 w-full text-center uppercase`}
            onClick={handleSignup}
            disabled={
              email.trim() === "" ||
              !isValidEmail(email) ||
              loading ||
              !isValidName
            }
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <div className="text-gray-400">
            Already have an account?{" "}
            <Link href="/" className="text-sky-500 font-bold">
              Login
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid place-items-center mx-auto w-full max-w-lg text-lg">
          <h2 className="text-gray-800 text-5xl">
            Solve<span className="text-sky-500">ItOut</span>
          </h2>
          <h2 className="text-gray-800 text-3xl mt-16 mb-8">Enter OTP</h2>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <button
            className={`py-2 px-5 rounded-2xl ${
              otp.trim().length !== 6
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-sky-800 text-white"
            } text-lg my-10 w-full text-center uppercase`}
            onClick={handleVerifyOtp}
            disabled={otp.trim().length !== 6 || loading}
          >
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </div>
      )}
    </MaxWidthWrapper>
  );
};

export default Signup;
