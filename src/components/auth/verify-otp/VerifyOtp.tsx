"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useResendResetOTPMutation, useVerifyOTPForResetPasswordMutation } from "@/redux/feature/auth/authApi";

const verificationSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const VerifyOtp = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verificationSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  const [verifyOTPForResetPassword, { isLoading }] =
    useVerifyOTPForResetPasswordMutation();
  const [resendResetOTP, { isLoading: isResendLoading }] =
    useResendResetOTPMutation();

  const [cooldown, setCooldown] = useState(0);

  const token = typeof window !== "undefined" ? localStorage.getItem("FPT") : null;
  const onSubmit = async (data: z.infer<typeof verificationSchema>) => {
    const OTP = data.code;
    try {
      await verifyOTPForResetPassword({ token, otp: OTP }).unwrap();
      router.push("/auth/reset-password");
    } catch {
      // handled by RTK mutation error handlers
    }
  };

  const handleResendOTP = async () => {
    if (cooldown > 0) return;
    try {
      await resendResetOTP({ token }).unwrap();
      setCooldown(60);
    } catch {
      // handled by RTK mutation error handlers
    }
  };

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <div className="w-full max-w-sm md:max-w-lg">
      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-semibold text-title mb-2">
                  Verify Your Account
                </h1>
                <p className="text-sm text-subtitle">
                  Enter the 6-digit code sent to your email.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 justify-center">
                <Controller
                  control={control}
                  name="code"
                  render={({ field }) => (
                    <InputOTP {...field} maxLength={6}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
                {errors.code && (
                  <p className="text-red-400 text-sm ">{errors.code.message}</p>
                )}
              </div>

              <div className="flex justify-center text-sm text-subtitle">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOTP}
                  className="p-0 h-auto"
                  disabled={isResendLoading || cooldown > 0}
                  aria-disabled={isResendLoading || cooldown > 0}
                  title={
                    cooldown > 0 ? `Please wait ${cooldown}s` : "Resend Code"
                  }
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
                </Button>
              </div>

              <Button loading={isLoading} type="submit" className="w-full">
                Verify
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtp;
