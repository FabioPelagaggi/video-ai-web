import { FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export function VideoInputForm() {
  return (
    <form className="space-y-6">
      <label
        htmlFor="video"
        className="text-primary border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center hover:bg-primary-foreground"
      >
        <FileVideo className="w-8 h-8" />
        Upload Video
      </label>

      <input type="file" id="video" accept="video/mp4" className="sr-only" />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Add Prompts...</Label>
        <Textarea
          id="transcription_prompt"
          className="h-20 leading-relaxed resize-none"
          placeholder="Add video keywords separated by commas (,)."
        />
      </div>
      <Button type="submit" className="w-full">
        Upload
        <Upload className="w-4 h-4 m-2" />
      </Button>
    </form>
  );
}
