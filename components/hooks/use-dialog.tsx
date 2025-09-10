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
import { cn } from "@/lib/utils";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

// hooks 需要时使用
interface OpenProps {
  content: React.ReactNode;
  title?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  cancelVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  manualClose?: boolean; // 是否手动控制关闭
  className?: string;
}

// Internal state of the provider
type DialogState = OpenProps & { isOpen: boolean };

// Context shape
interface DialogContextType {
  openDialog: (props: OpenProps) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

// 放在layout里，全局
export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialog, setDialog] = useState<Partial<DialogState>>({
    isOpen: false,
    manualClose: false,
  });

  const openDialog = useCallback((props: OpenProps) => {
    setDialog({ ...props, isOpen: true });
  }, []);

  const closeDialog = useCallback(() => {
    if (dialog.onCancel) {
      dialog.onCancel();
    }
    setDialog((prev) => ({ ...prev, isOpen: false }));
  }, [dialog]);

  const handleConfirm = () => {
    if (dialog.onConfirm) {
      dialog.onConfirm();
    }
    if (!dialog.manualClose) {
      setDialog((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleCancel = () => {
    if (dialog.onCancel) {
      dialog.onCancel();
    }
    if (!dialog.manualClose) {
      setDialog((prev) => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      <Dialog
        open={dialog.isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleCancel();
          }
        }}
      >
        <DialogContent
          className={cn("sm:max-w-[425px]", dialog.className)}
          showCloseButton={!dialog.manualClose}
        >
          {dialog.title && (
            <DialogHeader className="space-y-0">
              <DialogTitle>{dialog.title}</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
          )}
          <div className="py-4 overflow-y-auto max-h-[80vh] px-1">
            {dialog.content}
          </div>
          <DialogFooter>
            <Button
              onClick={handleCancel}
              variant={dialog.cancelVariant || "outline"}
            >
              {dialog.cancelText || "取消"}
            </Button>
            <Button
              onClick={handleConfirm}
              variant={dialog.confirmVariant || "default"}
            >
              {dialog.confirmText || "确认"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (context === null) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
