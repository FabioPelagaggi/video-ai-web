import { FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useMemo, useRef, useState } from "react";
import { loadFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export function VideoInputForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const promptInput = useRef<HTMLTextAreaElement>(null);

  function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) return;

    const selectedFile = files[0];

    setVideoFile(selectedFile);
  }

  async function handleVideoUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = promptInput.current?.value;

    if (!videoFile) return;

    const audioFile = await convertVideoToAudio(videoFile);

    console.log(audioFile);
  }

  const previewURL = useMemo(() => {
    if (!videoFile) return null;

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  async function convertVideoToAudio(video: File) {
    console.log("Converting video to audio...");

    const ffmpeg = await loadFFmpeg();

    await ffmpeg.writeFile("input.mp4", await fetchFile(video));

    // ---  To Debug FFmpeg
    //ffmpeg.on('log', log => console.log(log.message));

    ffmpeg.on("progress", (progress) => {
      console.log(
        "Processing: " + Math.round(progress.progress * 100) + "% done"
      );
    });

    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);

    const data = await ffmpeg.readFile("output.mp3");

    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "audio.mp3", {
      type: "audio/mpeg",
    });

    console.log("Converted video to audio!");

    return audioFile;
  }

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
