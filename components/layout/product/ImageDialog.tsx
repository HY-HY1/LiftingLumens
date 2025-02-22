import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImageDialogContentProps {
  img?: string
}

export function ImageDialogContent({ img }: ImageDialogContentProps) {
  return (
<DialogContent className="sm:max-w-[425px] bg-white md:min-w-[90vh] max-w-full mx-auto rounded-lg">
        <DialogTitle></DialogTitle>
      <div className="grid gap-4 py-4">
        {img && (
          <img
            src={img}
            alt="Profile"
            className="w-full h-auto rounded-lg object-cover"
          />
        )}
      </div>
    </DialogContent>
  )
}
