"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { Lock, ShieldCheck, User2 } from "lucide-react";

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
// import { useUpdateAdminProfileMutation } from "@/redux/feature/auth/authApi";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import EditProfileSkeleton from "@/components/skeleton/EditProfileSkeleton";
import Error from "@/common/Error";

const FALLBACK_ADMIN = {
  name: "Golap Hasan",
  email: "admin@popy.com",
  phone_number: "01711-000001",
  address: "Dhaka, Bangladesh",
};

const getFormSchema = () => z.object({
  name: z.string().trim().min(2, 'edit.validation.name_short'),
  email: z.string().email(),
  phone:
    z
      .string()
      .trim()
      .optional()
      .transform((v) => (v === "" ? undefined : v))
      .refine((v) => !v || v.length > 10, {
        message: 'edit.validation.phone_long',
      }),
  address: z
    .string()
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
});

const EditProfileForm = ({ pendingImage, onClearPending, isLoading, isError }: any) => {
  const admin = FALLBACK_ADMIN;

  const formSchema = getFormSchema();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: admin?.name || "",
      email: admin?.email || "",
      phone: admin?.phone_number || "",
      address: admin?.address || "",
    },
  });

  useEffect(() => {
    if (admin) {
      form.reset({
        name: admin?.name || "",
        email: admin?.email || "",
        phone: admin?.phone_number || "",
        address: admin?.address || "",
      });
    }
  }, [admin, form]);

  const onSubmit = async (values:any) => {
    try {
      if (pendingImage) {
        const formData = new FormData();
        formData.append("profile_image", pendingImage);
        formData.append(
          "name", values.name
        );
        formData.append("phone_number", values.phone);
        formData.append("address", values.address);

        // await updateProfile(formData).unwrap();
        onClearPending?.();
      } else {
        const payload = {
          name: values.name,
          phone_number: values.phone,
          address: values.address,
        };
        console.log(payload);
        // await updateProfile(payload).unwrap();
      }
      SuccessToast('edit.toast.success');
      form.reset({ ...values });
    } catch (err:any) {
      const msg = err?.data?.message || 'edit.toast.fail';
      ErrorToast(msg);
    }
  };

  return (
    isLoading ? (
      <EditProfileSkeleton />
    ) : isError ? (
      <Error msg={'edit.error_load'} />
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
                  <h3 className="text-sm font-semibold">edit.personal_info</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>edit.user_name</FormLabel>
                        <FormControl>
                          <Input placeholder={'edit.user_name_placeholder'} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {pendingImage && (
                    <div className="text-xs rounded border px-3 py-2 bg-amber-500/20 text-muted-foreground">
                      {'edit.pending_image_notice'}
                      <button type="button" className="ml-2 underline" onClick={() => onClearPending?.()}>{'edit.clear'}</button>
                    </div>
                  )}
                </div>
              </section>

              <Separator />

              {/* Email Address */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full border grid place-items-center bg-primary/10 text-primary">
                    <Lock size={14} />
                  </div>
                  <h3 className="text-sm font-semibold">edit.email_address</h3>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>edit.email_label</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input disabled {...field} />
                          <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2" />
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
                  <h3 className="text-sm font-semibold">edit.contact_info</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>edit.contact_number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder={'edit.contact_number_placeholder'} {...field} />
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
                        <FormLabel>edit.street_address</FormLabel>
                        <FormControl>
                          <Input placeholder={'edit.street_address_placeholder'} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              <div className="pt-2">
                <Button className="w-full" type="submit">
                  save_changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    )
  );
};

export default EditProfileForm;