
"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

import Title from "@/components/ui/Title";
import { SuccessToast } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import PageLayout from "@/layout/PageLayout";
import LegalEditorSkeleton from "@/components/skeleton/LegalSkeleton";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const Terms = () => {
  const [content, setContent] = useState("");
  const editor = useRef(null);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  const addTermsLoading = false;

  useEffect(() => {
    const fakeTerms = ``;
    setContent(fakeTerms);
    setIsLoading(false);
  }, []);

  const handleSubmit = () => {
    SuccessToast("Terms saved successfully");
  };

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
      placeholder: "Terms placeholder",
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
        background: currentTheme === "dark" ? "#0f172a" : "#ffffff",
        color: currentTheme === "dark" ? "#e2e8f0" : "#0f172a",
      },
    };
  }, [theme]);

  return (
    <PageLayout
      pagination={
        !isLoading && (
          <Button
            disabled={addTermsLoading}
            className="w-24 mx-auto mt-4"
            onClick={handleSubmit}
          >
            Save
          </Button>
        )
      }
    >
      <Title title="Terms" />

      {isLoading ? (
        <LegalEditorSkeleton />
      ) : (
        <div className="rounded-lg shadow p-4">
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

export default Terms;
