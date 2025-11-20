"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, startTransition } from "react";
import Title from "@/components/ui/Title";
import { ErrorToast, formatDateForDisplay, SuccessToast } from "@/lib/utils";
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
    const apiData = aboutData as { data?: { content?: string } } | undefined;
    if (apiData?.data?.content && typeof apiData.data.content === "string" && !initializedRef.current) {
      initializedRef.current = true;
      startTransition(() => {
        setContent(apiData?.data?.content as string);
      });
    }
  }, [aboutData]);

  const handleSubmit = async () => {
    try {
      const res = (await addOrUpdateAbout({
        type: "about-us",
        title: "About Us",
        content: content,
      }).unwrap()) as { message?: string };

      SuccessToast(res.message || "About saved successfully");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      const msg = err?.data?.message || "Failed to save about page";
      ErrorToast(msg);
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

  return (
    <PageLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Title title="About Us" />
          {!isLoading && (
            <Button
              disabled={addAboutLoading}
              onClick={handleSubmit}
              className="min-w-[120px] gap-2 shadow-md hover:shadow-lg transition-all duration-200"
              size="default"
            >
              {addAboutLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          )}
        </div>
        {!isLoading && (aboutData as { data?: { updatedAt?: string } } | undefined)?.data?.updatedAt && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-border/50 text-sm">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Last updated</span>
            <span className="font-semibold text-foreground">
              {formatDateForDisplay((aboutData as { data?: { updatedAt?: string } })?.data?.updatedAt as string)}
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
