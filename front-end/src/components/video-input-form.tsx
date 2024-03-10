import { FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useMemo, useRef, useState } from "react";

export function VideoInputForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const promptInput = useRef<HTMLTextAreaElement>(null);

  function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) return;

    const selectedFile = files[0];

    setVideoFile(selectedFile);
  }

  function handleVideoUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = promptInput.current?.value;

    if (!videoFile) return;


  }

  const previewURL = useMemo(() => {
    if (!videoFile) return null;

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <form onSubmit={handleVideoUpload} className="space-y-6">
      <label
        htmlFor="video"
        className="relative text-primary border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center hover:bg-primary-foreground"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none absolute inset-0"
          />
        ) : (
          <>
            <FileVideo className="w-8 h-8" />
            Upload Video
          </>
        )}
      </label>

      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Add Prompts...</Label>
        <Textarea
          ref={promptInput}
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
