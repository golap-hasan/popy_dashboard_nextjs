"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
import { Loader, Sparkles, X } from "lucide-react";
import {
  useGetSingleBookQuery,
  useUpdateBookMutation,
} from "@/redux/feature/book/bookApi";
import { bookFormSchema } from "./book.schema";
import { Book, BookUpdatePayload } from "@/redux/feature/book/book.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

type EditBookFormProps = {
  slug: string;
  id: string;
};

const EditBookForm = ({ slug, id }: EditBookFormProps) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [currentHighlight, setCurrentHighlight] = useState("");

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

  const { data, isLoading, isError } = useGetSingleBookQuery(slug);
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

  const book: Book | undefined = (data as { data?: Book } | undefined)?.data;

  // Helper functions for highlights
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

  // Initialize highlights when book data loads
  useEffect(() => {
    if (book?.highlights && Array.isArray(book.highlights)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHighlights(book.highlights);
    }
  }, [book?.highlights]);

  // Reset form when book data loads
  useEffect(() => {
    if (!book) return;

    form.reset({
      title: book.title || "",
      subtitle: book.subtitle || "",
      author: book.author || "",
      slug: book.slug || "",
      category:
        typeof book.category === "object" && book.category !== null
          ? (book.category as { name: string }).name || ""
          : typeof book.category === "string"
            ? book.category
            : "",
      quantity: book.quantity !== null ? String(book.quantity) : "",
      price: book.price !== null ? String(book.price) : "",
      originalPrice:
        book.originalPrice !== null ? String(book.originalPrice) : "",
      rating: book.rating !== null ? String(book.rating) : "",
      reviewsCount: book.reviewsCount !== null ? String(book.reviewsCount) : "",
      tag: book.tag || "",
      description: book.description || "",
      highlights: "", // Not used anymore, using separate state
      specs: book.specs
        ? book.specs
          .map((spec) => `${spec.label}: ${spec.value}`)
          .join("\n")
        : "",
      aboutAuthorBio: book.aboutAuthor?.bio || "",
      aboutAuthorAchievements: Array.isArray(book.aboutAuthor?.achievements)
        ? book.aboutAuthor?.achievements.join("\n")
        : "",
    });
  }, [book, form]);

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
        highlights: highlights, // Use the highlights state directly
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
        formData.append("file", pendingImage);
      }

      await updateBook({ id, data: formData }).unwrap();
      SuccessToast("Book updated successfully.");
      router.push("/management/books");
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to update book.";
      ErrorToast(msg);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-4">
        <Title title="Edit Book" />
        {isLoading ? (
          <p className="flex items-center justify-center gap-2 h-[50vh]">
            <Loader className="animate-spin size-8" />
          </p>
        ) : isError || !book ? (
          <p className="flex items-center justify-center gap-2 h-[50vh] text-red-500">
            Failed to load book.
          </p>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="space-y-6">
                <Card>
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1">
                        <CardTitle>Core details</CardTitle>
                        <CardDescription>
                          Update the key information readers and search tools
                          rely on.
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
                              <Input placeholder="Unique slug" {...field} />
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
                            <FormControl>
                              <Input
                                placeholder="Play Group & Nursery"
                                {...field}
                              />
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
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 350" {...field} />
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
                              <Input placeholder="e.g., 450" {...field} />
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
                              <Input placeholder="Adventure" {...field} />
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
                    </div>

                    <div className="space-y-4">
                      <FormLabel>Cover image</FormLabel>
                      <div className="space-y-4">
                        {pendingImage && (
                          <div className="overflow-hidden w-52 rounded-2xl border bg-background shadow-sm">
                            <img
                              src={URL.createObjectURL(pendingImage)}
                              alt="New cover preview"
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

                        {!pendingImage && book.coverImage && (
                          <div className="overflow-hidden w-52 rounded-2xl border bg-background shadow-sm">
                            <div
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
                              className="w-full cursor-pointer group"
                            >
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="h-64 w-full object-cover group-hover:brightness-75 transition"
                              />
                              <div className="flex items-center justify-between gap-3 border-t px-4 py-3 text-sm group-hover:bg-muted/50 transition">
                                <p className="text-muted-foreground text-xs">
                                  Current cover image
                                </p>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent parent click
                                      setPendingImage(null); // This will show upload button
                                    }}
                                  >
                                    <X />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {!pendingImage && !book.coverImage && (
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
                        Optional: upload a new image to replace the current
                        cover.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="space-y-3">
                    <CardTitle>Description & author</CardTitle>
                    <CardDescription>
                      Add detailed description and author information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
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
                          <FormDescription>
                            Add detailed description with rich formatting.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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

                <Card>
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
                          <FormDescription>
                            Enter specifications as "Label: Value" pairs, one per line. These will be parsed and sent as structured data.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="space-y-3">
                    <CardTitle>Storytelling</CardTitle>
                    <CardDescription>
                      Refine how the book is presented to your readers.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                          size="sm"
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

                <Card>
                  <CardHeader>
                    <CardTitle>Save changes</CardTitle>
                    <CardDescription>
                      Review your updates before saving them to the catalog.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                      Changes will be visible wherever this book appears.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/management/books")}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        className="gap-2"
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Updating..." : "Update book"}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </form>
          </Form>
        )}
      </div>
    </PageLayout>
  );
};

export default EditBookForm;
