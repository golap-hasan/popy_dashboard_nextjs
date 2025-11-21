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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PageLayout from "@/layout/PageLayout";
import Title from "@/components/ui/Title";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Info, Sparkles, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useCreateBookMutation } from "@/redux/feature/book/bookApi";
import { bookFormSchema } from "./book.schema";
import { BookUpdatePayload } from "@/redux/feature/book/book.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useSmartFetchHook from "@/hooks/useSmartFetchHook";
import {
  Category,
  CategoryQueryParams,
} from "@/redux/feature/category/category.type";
import { useGetAllCategoryQuery } from "@/redux/feature/category/categoryApi";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const AddBookForm = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [currentHighlight, setCurrentHighlight] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const formSchema = bookFormSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      author: "",
      slug: "",
      category: "",
      quantity: "",
      price: "",
      originalPrice: "",
      rating: "",
      reviewsCount: "",
      tag: "",
      description: "",
      highlights: "",
      specs: "",
      aboutAuthorBio: "",
      aboutAuthorAchievements: "",
    },
  });

  const titleValue = form.watch("title");

  useEffect(() => {
    if (!slugTouched) {
      const autoSlug = slugify(titleValue || "");
      form.setValue("slug", autoSlug, { shouldValidate: false, shouldDirty: false });
    }
  }, [titleValue, slugTouched, form]);

  const { data, isLoading, isError } = useSmartFetchHook<
    CategoryQueryParams,
    Category
  >(useGetAllCategoryQuery, {});
  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();

  const addHighlight = () => {
    if (currentHighlight.trim()) {
      setHighlights([...highlights, currentHighlight.trim()]);
      setCurrentHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  const handleHighlightKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addHighlight();
    }
  };

  const config = useMemo(() => {
    let currentTheme = theme;
    if (theme === "system") {
      currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    return {
      readonly: false,
      placeholder: "Add detailed description...",
      toolbarAdaptive: false,
      height: 320,
      minHeight: 280,
      askBeforePasteHTML: false,
      theme: currentTheme,
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
      style: {
        background: currentTheme === "dark" ? "#2a0f0fce" : "#ffffff",
        color: currentTheme === "dark" ? "#e2e8f0" : "#0f172a",
      },
    };
  }, [theme]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload: BookUpdatePayload = {
        title: values.title,
        subtitle: values.subtitle || undefined,
        author: values.author,
        slug: values.slug,
        category: values.category,
        quantity: Number(values.quantity),
        price: values.price,
        originalPrice: values.originalPrice,
        rating: values.rating ? Number(values.rating) : undefined,
        reviewsCount: values.reviewsCount
          ? Number(values.reviewsCount)
          : undefined,
        tag: values.tag,
        description: values.description || "",
        highlights: highlights,
        specs: values.specs
          ? values.specs
              .split("\n")
              .map((line) => {
                const [label, ...valueParts] = line.split(":");
                const value = valueParts.join(":").trim();
                return { label: label.trim(), value };
              })
              .filter((spec) => spec.label && spec.value)
          : undefined,
        aboutAuthor:
          values.aboutAuthorBio || values.aboutAuthorAchievements
            ? {
                bio: values.aboutAuthorBio || "",
                achievements: values.aboutAuthorAchievements
                  ? values.aboutAuthorAchievements
                      .split("\n")
                      .map((a) => a.trim())
                      .filter(Boolean)
                  : [],
              }
            : undefined,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      if (pendingImage) {
        formData.append("book", pendingImage);
      }

      await createBook(formData).unwrap();
      SuccessToast("Book created successfully.");
      router.push("/management/books");
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to create book.";
      ErrorToast(msg);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-4">
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
                  Provide crisp details, highlight what makes this book special,
                  and publish a polished listing for your readers without
                  leaving the dashboard.
                </p>
                <div className="flex items-center gap-2 text-xs text-amber-500">
                  <Info className="h-3.5 w-3.5" />
                  <span>
                    Pro tip: use short, lowercase, hyphenated slugs so your book URLs are clean and SEO friendly.
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Live preview
                  ready
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Optimized
                  for search
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Team
                  collaboration friendly
                </div>
              </div>
            </div>
          </div>
        </section>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <CardTitle>Core details</CardTitle>
                        <CardDescription>
                          The essentials customers see first across search,
                          listings, and recommendations.
                        </CardDescription>
                      </div>
                      <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1 text-xs uppercase tracking-wide"
                      >
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
                              <Input
                                placeholder="Enter book title"
                                {...field}
                              />
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
                              <Input
                                placeholder="Optional subtitle"
                                {...field}
                              />
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
                              <Input
                                placeholder="Primary author name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Unique slug"
                                {...field}
                                onChange={(e) => {
                                  setSlugTouched(true);
                                  field.onChange(e);
                                }}
                                onBlur={() => {
                                  setSlugTouched(true);
                                  field.onBlur?.();
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {isLoading ? (
                                  <div className="p-2 text-center text-sm text-muted-foreground">
                                    Loading categories...
                                  </div>
                                ) : isError ? (
                                  <div className="p-2 text-center text-sm text-destructive">
                                    Failed to load categories
                                  </div>
                                ) : data?.length > 0 ? (
                                  data.map((category) => (
                                    <SelectItem
                                      key={category._id}
                                      value={category.name}
                                    >
                                      {category.name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-center text-sm text-muted-foreground">
                                    No categories found
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
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
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Available quantity"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rating</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 4.8" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="reviewsCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reviews count</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 35" {...field} />
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
                              <Input
                                placeholder="e.g., Best seller"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-4">
                      <FormLabel>Cover image</FormLabel>
                      <div className="space-y-4">
                        {pendingImage && (
                          <div className="overflow-hidden w-52 rounded-2xl border bg-background shadow-sm">
                            <img
                              src={URL.createObjectURL(pendingImage)}
                              alt="Cover preview"
                              className="h-64 w-full object-cover"
                            />
                            <div className="flex items-start justify-between gap-3 border-t px-4 py-3 text-sm">
                              <div className="space-y-1 min-w-0 flex-1">
                                <p
                                  className="font-medium leading-none truncate"
                                  title={pendingImage.name}
                                >
                                  {pendingImage.name}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {Math.round(pendingImage.size / 1024)} KB
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => setPendingImage(null)}
                                >
                                  <X />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {!pendingImage && (
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = (event) => {
                                const file =
                                  (event.target as HTMLInputElement)
                                    .files?.[0] || null;
                                setPendingImage(file);
                              };
                              input.click();
                            }}
                            className="group relative flex min-h-[220px] w-auto flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-muted-foreground/40 bg-muted/30 px-6 py-8 text-center transition hover:border-primary/60 hover:bg-primary/5"
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary/20 group-hover:text-primary">
                              <Sparkles className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium">Upload cover image</p>
                              <p className="text-muted-foreground text-sm">
                                Add a high-resolution image to showcase the
                                book.
                              </p>
                            </div>
                            <span className="text-muted-foreground text-xs">
                              JPG or PNG, up to 5MB
                            </span>
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Optional: upload a high-resolution image to showcase the
                        book.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="space-y-3">
                    <CardTitle>Storytelling</CardTitle>
                    <CardDescription>
                      Help readers instantly connect with your book’s voice and
                      themes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Main description</FormLabel>
                          <FormControl>
                            <div className="rounded-xl border bg-background/80 p-2">
                              <JoditEditor
                                value={field.value || ""}
                                config={config}
                                onBlur={(newContent) =>
                                  field.onChange(newContent)
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-4">
                      <FormLabel>Highlights</FormLabel>

                      {/* Display existing highlights as chips */}
                      {highlights.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {highlights.map((highlight, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center gap-1 pr-1"
                            >
                              {highlight}
                              <button
                                type="button"
                                onClick={() => removeHighlight(index)}
                                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Add new highlight input */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a highlight..."
                          value={currentHighlight}
                          onChange={(e) => setCurrentHighlight(e.target.value)}
                          onKeyPress={handleHighlightKeyPress}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={addHighlight}
                          disabled={!currentHighlight.trim()}
                        >
                          Add
                        </Button>
                      </div>

                      <FormDescription>
                        Add key selling points and features. Each highlight will
                        be displayed as a separate item.
                      </FormDescription>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="space-y-3">
                    <CardTitle>Specifications</CardTitle>
                    <CardDescription>
                      Technical details and specifications for the book.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="specs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Book specifications</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={6}
                              placeholder={
                                "e.g. Language: Bengali\ne.g. Publisher: Popy Books\ne.g. Page Count: 120\ne.g. ISBN: 978-984-1234567\ne.g. Format: Paperback"
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-amber-400 flex items-center gap-1.5">
                            <Info className="h-4 w-4"/>
                            <span>
                              Note: Enter specifications as "Label: Value"
                              pairs, one per line. These will be parsed and sent
                              as structured data.
                            </span>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="space-y-3">
                    <CardTitle>Description & author</CardTitle>
                    <CardDescription>
                      Add detailed description and author information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="aboutAuthorBio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author bio</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Short bio about the author."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aboutAuthorAchievements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author achievements</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder={
                                "One achievement per line (e.g. Winner of the National Children's Literature Award 2023)"
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Will be sent as an array of strings in the API
                            payload.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Finalize & publish</CardTitle>
                    <CardDescription>
                      Double-check key details before sharing the book with your
                      audience.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      Need to gather assets later? You can save a draft and
                      revisit at any time.
                    </p>
                    <Button
                      type="submit"
                      size="lg"
                      className="gap-2"
                      disabled={isCreating}
                      loading={isCreating}
                    >
                      {isCreating ? "Creating..." : "Publish book"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <aside className="space-y-6">
                <Card className="border-dashed shadow-none">
                  <CardHeader className="space-y-2">
                    <CardTitle>Quality checklist</CardTitle>
                    <CardDescription>
                      Confirm everything needed for an exceptional catalog
                      entry.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {[
                      "Cover image is high resolution (min 1200px)",
                      "Highlights include 3–5 punchy points",
                      "Description ends with a clear hook",
                      "Specs mention page count and format",
                      "Author bio lists notable achievements",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-lg border border-primary/15 bg-primary/5 p-3"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardHeader className="space-y-2">
                    <CardTitle>Formatting tips</CardTitle>
                    <CardDescription>
                      Short reminders for consistent, on-brand copy.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      • Use present tense verbs in highlights for energy.
                      <br />• Keep sentences under 18 words for readability.
                      <br />• Add awards or publication dates where relevant.
                      <br />• Use short, lowercase, hyphenated slugs to help SEO and make URLs easier to share.
                    </p>
                    <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-primary">
                      <p className="text-sm font-medium">
                        Tip: Paste markdown-friendly specs to automatically
                        convert to structured displays on the storefront.
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
