"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, startTransition } from "react";

import Title from "@/components/ui/Title";
import PageLayout from "@/layout/PageLayout";
import { ErrorToast, SuccessToast, formatDateForDisplay } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Save } from "lucide-react";
import LegalEditorSkeleton from "@/components/skeleton/LegalSkeleton";
import {
  useGetLegalPageQuery,
  useAddOrUpdateLegalPageMutation,
} from "@/redux/feature/legal/legalApi";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const Privacy = () => {
  const [content, setContent] = useState("");
  const editor = useRef(null);
  const initializedRef = useRef(false);
  const { theme } = useTheme();

  // Fetch privacy policy page data
  const { data: privacyData, isLoading: isFetching } =
    useGetLegalPageQuery("privacy-policy");

  // Mutation for saving privacy policy page
  const [addOrUpdatePrivacy, { isLoading: addPrivacyPolicyLoading }] =
    useAddOrUpdateLegalPageMutation();

  // Initialize content from API data only once
  useEffect(() => {
    const apiData = privacyData as { data?: { content?: string } } | undefined;
    if (
      apiData?.data?.content &&
      typeof apiData.data.content === "string" &&
      !initializedRef.current
    ) {
      initializedRef.current = true;
      startTransition(() => {
        setContent(apiData?.data?.content as string);
      });
    }
  }, [privacyData]);

  const handleSubmit = async () => {
    try {
      const res = (await addOrUpdatePrivacy({
        type: "privacy-policy",
        title: "Privacy Policy",
        content: content,
      }).unwrap()) as { message?: string };

      SuccessToast(res.message || "Privacy policy saved successfully");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      const msg = err?.data?.message || "Failed to save privacy policy";
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
      placeholder: "Privacy policy placeholder",
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
      <div className="mb-2">
        <div className="flex justify-between">
          <div className="flex flex-col items-start gap-3">
            <Title title="Privacy Policy" />
            <div>
              {!isLoading &&
                (privacyData as { data?: { updatedAt?: string } } | undefined)
                  ?.data?.updatedAt && (
                  <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <span>•</span>
                    <span>Updated</span>
                    <span className="font-medium text-foreground">
                      {formatDateForDisplay(
                        (privacyData as { data?: { updatedAt?: string } })?.data
                          ?.updatedAt as string
                      )}
                    </span>
                  </div>
                )}
            </div>
          </div>
          {!isLoading && (
            <Button
              disabled={addPrivacyPolicyLoading}
              onClick={handleSubmit}
              loading={addPrivacyPolicyLoading}
              size="sm"
              variant="outline"
            >
              {!addPrivacyPolicyLoading && <Save />}
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <LegalEditorSkeleton />
      ) : (
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <JoditEditor
            ref={editor}
            value={content}
            onBlur={(newContent) => setContent(newContent)}
            config={editorConfig}
          />
        </div>
      )}
    </PageLayout>
  );
};

export default Privacy;
