"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, startTransition } from "react";
import Title from "@/components/ui/Title";
import { SuccessToast } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import PageLayout from "@/layout/PageLayout";
import { Clock, Save, Loader2 } from "lucide-react";
import LegalEditorSkeleton from "@/components/skeleton/LegalSkeleton";
import {
  useGetLegalPageQuery,
  useAddOrUpdateLegalPageMutation,
} from "@/redux/feature/legal/legalApi";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const About = () => {
  const [content, setContent] = useState("");
  const editor = useRef(null);
  const initializedRef = useRef(false);
  const { theme } = useTheme();

  // Fetch about page data
  const { data: aboutData, isLoading: isFetching } =
    useGetLegalPageQuery("about-us");

  // Mutation for saving about page
  const [addOrUpdateAbout, { isLoading: addAboutLoading }] =
    useAddOrUpdateLegalPageMutation();

  // Initialize content from API data only once
  useEffect(() => {
    if (aboutData?.data?.content && !initializedRef.current) {
      initializedRef.current = true;
      startTransition(() => {
        setContent(aboutData.data.content);
      });
    }
  }, [aboutData]);

  const handleSubmit = async () => {
    try {
      await addOrUpdateAbout({
        type: "about-us",
        data: { content: content },
      }).unwrap();
      SuccessToast("About saved successfully");
    } catch {
      SuccessToast("Failed to save about page");
    }
  };

  const isLoading = isFetching;

  const editorConfig = useMemo(() => {
    let currentTheme = theme;
    if (theme === "system") {
      currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    return {
      readonly: false,
      height: 650,
      toolbarAdaptive: false,
      toolbarSticky: false,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      placeholder: "About placeholder",
      theme: currentTheme,
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "link",
        "table",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "fullsize",
      ],
      style: {
        background: currentTheme === "dark" ? "#2a0f0fce" : "#ffffff",
        color: currentTheme === "dark" ? "#e2e8f0" : "#0f172a",
      },
    };
  }, [theme]);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <PageLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Title title="About Us" />
          {!isLoading && (
            <Button
              disabled={addAboutLoading}
              className="min-w-[100px]"
              onClick={handleSubmit}
            >
              {addAboutLoading ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
        {!isLoading && aboutData?.data?.updatedAt && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-border/50 text-sm">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Last updated</span>
            <span className="font-semibold text-foreground">
              {formatDate(aboutData.data.updatedAt)}
            </span>
          </div>
        )}
      </div>

      {isLoading ? (
        <LegalEditorSkeleton />
      ) : (
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <JoditEditor
            ref={editor}
            value={content}
            onBlur={(newContent: string) => setContent(newContent)}
            config={editorConfig}
          />
        </div>
      )}
    </PageLayout>
  );
};

export default About;
