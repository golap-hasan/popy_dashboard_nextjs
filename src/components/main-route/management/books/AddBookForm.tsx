"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PageLayout from "@/layout/PageLayout";
import Title from "@/components/ui/Title";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Sparkles, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const MAX_IMAGES = 5;

const fileSchema = z
  .custom<File>((file) => file instanceof File, {
    message: "Please upload a valid image file.",
  })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Each image must be 5MB or less.",
  });

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  subtitle: z.string().optional(),
  author: z.string().min(2, { message: "Author must be at least 2 characters." }),
  price: z.string().min(1, { message: "Price is required." }),
  originalPrice: z.string().optional(),
  tag: z.string().min(2, { message: "Tag must be at least 2 characters." }),
  coverImages: z
    .array(fileSchema)
    .min(1, { message: "At least one cover image is required." })
    .max(MAX_IMAGES, { message: `You can upload up to ${MAX_IMAGES} images.` }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  highlights: z.string().min(10, { message: "Highlights must be at least 10 characters." }),
  specs: z.string().optional(), // For simplicity, accepting JSON string
});

const AddBookForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      author: "",
      price: "",
      originalPrice: "",
      tag: "",
      coverImages: [],
      description: "",
      highlights: "",
      specs: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Handle form submission
    console.log(values);
  }

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const coverImages = form.watch("coverImages");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (!coverImages?.length) {
      setPreviews([]);
      return;
    }

    const objectUrls = coverImages.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [coverImages]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      const hasDarkClass = root.classList.contains("dark");
      const hasLightClass = root.classList.contains("light");

      if (hasDarkClass) {
        setIsDarkMode(true);
        return;
      }

      if (hasLightClass) {
        setIsDarkMode(false);
        return;
      }

      setIsDarkMode(mediaQuery.matches);
    };

    updateTheme();
    mediaQuery.addEventListener("change", updateTheme);

    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => {
      mediaQuery.removeEventListener("change", updateTheme);
      observer.disconnect();
    };
  }, []);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Craft engaging copy...",
      toolbarAdaptive: false,
      theme: isDarkMode ? "dark" : "default",
      height: 420,
      minHeight: 380,
      askBeforePasteHTML: false,
      buttons: [
        "bold",
        "italic",
        "underline",
        "fontsize",
        "ul",
        "ol",
        "link",
        "image",
        "table",
        "hr",
        "eraser",
      ],
    }),
    [isDarkMode]
  );

  return (
    <PageLayout>
      <div className="space-y-8">
        <Title title="Add a New Book" />
        <section className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-primary/10 via-background to-background p-8 shadow-sm">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_55%)]" />
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-4">
              <Badge className="inline-flex w-fit items-center gap-2 bg-primary/15 text-primary">
                <Sparkles className="h-4 w-4" /> Smart catalog creation
              </Badge>
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  Launch a standout title in minutes
                </h2>
                <p className="text-muted-foreground">
                  Provide crisp details, highlight what makes this book special, and publish a polished listing
                  for your readers without leaving the dashboard.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Live preview ready
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Optimized for search
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Team collaboration friendly
                </div>
              </div>
            </div>
          </div>
        </section>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <CardTitle>Core details</CardTitle>
                        <CardDescription>
                          The essentials customers see first across search, listings, and recommendations.
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs uppercase tracking-wide">
                        Required
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter book title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="subtitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subtitle</FormLabel>
                            <FormControl>
                              <Input placeholder="Optional subtitle" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author</FormLabel>
                            <FormControl>
                              <Input placeholder="Primary author name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 25.99" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="originalPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Original price</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 32.00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tag"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tag</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Best seller" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="coverImages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover images</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <input
                                ref={(node) => {
                                  fileInputRef.current = node;
                                  field.ref(node);
                                }}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(event) => {
                                  const selectedFiles = Array.from(event.target.files ?? []);
                                  if (!selectedFiles.length) return;

                                  const existingFiles = field.value ?? [];
                                  const availableSlots = MAX_IMAGES - existingFiles.length;
                                  const filesToAdd = selectedFiles.slice(0, availableSlots);
                                  field.onChange([...existingFiles, ...filesToAdd]);

                                  if (fileInputRef.current) {
                                    fileInputRef.current.value = "";
                                  }
                                }}
                                onBlur={field.onBlur}
                              />

                              {previews.length > 0 && (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                                  {previews.map((previewUrl, index) => {
                                    const file = field.value?.[index];
                                    return (
                                      <div
                                        key={`${previewUrl}-${index}`}
                                        className="overflow-hidden rounded-2xl border bg-background shadow-sm"
                                      >
                                        <img src={previewUrl} alt={`Cover preview ${index + 1}`} className="h-64 w-full object-cover" />
                                        <div className="flex items-start justify-between gap-3 border-t px-4 py-3 text-sm">
                                          <div className="space-y-1">
                                            <p className="font-medium leading-none">
                                              {file?.name ?? `Image ${index + 1}`}
                                            </p>
                                            {file && (
                                              <p className="text-muted-foreground text-xs">
                                                {Math.round(file.size / 1024)} KB
                                              </p>
                                            )}
                                          </div>
                                          <div className="flex gap-2">
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="icon"
                                              onClick={() => {
                                                const updated = [...(field.value ?? [])];
                                                updated.splice(index, 1);
                                                field.onChange(updated);
                                                if (fileInputRef.current) {
                                                  fileInputRef.current.value = "";
                                                }
                                              }}
                                            >
                                              <X />
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              { (field.value?.length ?? 0) < MAX_IMAGES && (
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="group relative flex min-h-[220px] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-muted-foreground/40 bg-muted/30 px-6 py-8 text-center transition hover:border-primary/60 hover:bg-primary/5"
                                >
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary/20 group-hover:text-primary">
                                    <Sparkles className="h-5 w-5" />
                                  </div>
                                  <div className="space-y-1">
                                    <p className="font-medium">Drag &amp; drop or click to upload</p>
                                    <p className="text-muted-foreground text-sm">
                                      Add up to {MAX_IMAGES} high-resolution images to showcase the book.
                                    </p>
                                  </div>
                                  <span className="text-muted-foreground text-xs">
                                    JPG or PNG, up to 5MB each
                                  </span>
                                </button>
                              )}

                              {previews.length > 0 && (field.value?.length ?? 0) < MAX_IMAGES && (
                                <div className="flex flex-wrap items-center gap-3">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                  >
                                    Upload more images
                                  </Button>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Upload between 1 and {MAX_IMAGES} images (JPG or PNG, max 5MB each). We’ll auto-optimize for the storefront.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="space-y-3">
                    <CardTitle>Storytelling</CardTitle>
                    <CardDescription>Help readers instantly connect with your book’s voice and themes.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Main description</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={6}
                              placeholder="Summarize the plot, audience, and takeaways in a compelling way."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="highlights"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Highlights</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={5}
                              placeholder="Share bullet-style highlights, accolades, or reader benefits."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="space-y-3">
                    <CardTitle>Rich content</CardTitle>
                    <CardDescription>
                      Deep dive into specifications for enthusiasts and researchers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="specs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specifications</FormLabel>
                          <FormControl>
                            <div className="rounded-xl border bg-background/80 p-2 shadow-inner">
                              <JoditEditor
                                value={field.value || ""}
                                config={config}
                                onBlur={(newContent) => field.onChange(newContent)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Finalize &amp; publish</CardTitle>
                    <CardDescription>
                      Double-check key details before sharing the book with your audience.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      Need to gather assets later? You can save a draft and revisit at any time.
                    </p>
                    <Button type="submit" size="lg" className="gap-2">
                      <Sparkles className="h-4 w-4" /> Publish book
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <aside className="space-y-6">
                <Card className="border-dashed shadow-none">
                  <CardHeader className="space-y-2">
                    <CardTitle>Quality checklist</CardTitle>
                    <CardDescription>Confirm everything needed for an exceptional catalog entry.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {[
                      "Cover image is high resolution (min 1200px)",
                      "Highlights include 3–5 punchy points",
                      "Description ends with a clear hook",
                      "Specs mention page count and format",
                      "Author bio lists notable achievements",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-lg border border-primary/15 bg-primary/5 p-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="space-y-2">
                    <CardTitle>Formatting tips</CardTitle>
                    <CardDescription>Short reminders for consistent, on-brand copy.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      • Use present tense verbs in highlights for energy.
                      <br />• Keep sentences under 18 words for readability.
                      <br />• Add awards or publication dates where relevant.
                    </p>
                    <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-primary">
                      <p className="text-sm font-medium">
                        Tip: Paste markdown-friendly specs to automatically convert to structured displays on the
                        storefront.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </form>
        </Form>
      </div>
    </PageLayout>
  );
};

export default AddBookForm;