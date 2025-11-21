"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { Lock, ShieldCheck, User2 } from "lucide-react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUpdateAdminProfileMutation } from "@/redux/feature/auth/authApi";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import EditProfileSkeleton from "@/components/skeleton/EditProfileSkeleton";
import Error from "@/common/Error";
import type { RootState } from "@/redux/store";

const getFormSchema = () =>
  z.object({
    name: z.string().trim().min(2, "edit.validation.name_short"),
    email: z.string().email(),
    phone: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v === "" ? undefined : v))
      .refine((v) => !v || v.length > 10, {
        message: "edit.validation.phone_long",
      }),
    address: z
      .string()
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
  });

type EditProfileFormProps = {
  isLoading: boolean;
  isError: boolean;
};

const EditProfileForm = ({ isLoading, isError }: EditProfileFormProps) => {
  const admin = useSelector((state: RootState) => state.auth.admin);
  const [updateProfile, { isLoading: updatingProfile }] = useUpdateAdminProfileMutation();

  const formSchema = getFormSchema();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: admin?.name || "",
      email: admin?.email || "",
      phone: admin?.phone || "",
      address: admin?.address || "",
    },
  });

  useEffect(() => {
    if (admin) {
      form.reset({
        name: admin?.name || "",
        email: admin?.email || "",
        phone: admin?.phone || "",
        address: admin?.address || "",
      });
    }
  }, [admin, form]);

  type FormValues = z.infer<ReturnType<typeof getFormSchema>>;

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        name: values.name,
        address: values.address,
        phone: values.phone,
      };
      await updateProfile(payload).unwrap();
      SuccessToast("Profile updated successfully.");
      form.reset({ ...values });
    } catch (error: unknown) {
      ErrorToast(
        (error as { data?: { message?: string } })?.data?.message ||
          "Failed to update profile."
      );
    }
  };

  return isLoading ? (
    <EditProfileSkeleton />
  ) : isError ? (
    <Error msg={"edit.error_load"} />
  ) : (
    <Card className="py-0">
      <CardContent className="p-4 sm:p-6 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full border grid place-items-center bg-primary/10 text-primary">
                  <User2 size={14} />
                </div>
                <h3 className="text-sm font-semibold">Personal information</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User name</FormLabel>
                      <FormControl>
                        <Input placeholder="User name placeholder" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Image upload moved to ProfileSummary */}
              </div>
            </section>

            <Separator />

            {/* Email Address */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full border grid place-items-center bg-primary/10 text-primary">
                  <Lock size={14} />
                </div>
                <h3 className="text-sm font-semibold">Email address</h3>
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input disabled {...field} />
                        <Lock
                          size={14}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>

            <Separator />

            {/* Contact Information */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full border grid place-items-center bg-primary/10 text-primary">
                  <ShieldCheck size={14} />
                </div>
                <h3 className="text-sm font-semibold">Contact information</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Contact number placeholder"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Street address placeholder"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <div className="pt-2">
              <Button className="w-full" type="submit" disabled={updatingProfile}>
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditProfileForm;
