"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  loading?: boolean;
}

const ConfirmationModal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText,
  loading,
}: ConfirmationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            size={"sm"}
            onClick={() => onOpenChange(false)}
          >
            {"Cancel"}
          </Button>
          <Button
            loading={loading}
            size={"sm"}
            onClick={onConfirm}
            variant="destructive"
          >
            {confirmText || "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
