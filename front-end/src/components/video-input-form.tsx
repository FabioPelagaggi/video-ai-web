import { FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useMemo, useRef, useState } from "react";
import { loadFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";

type Status =
  | "idle"
  | "converting"
  | "uploading"
  | "generating"
  | "success"
  | "error";

const statusMessages = {
  converting: "Converting video to audio...",
  uploading: "Uploading audio file...",
  generating: "Generating transcription...",
  success: "Transcription generated!",
};

export function VideoInputForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");

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

    setStatus("converting");

    const audioFile = await convertVideoToAudio(videoFile);

    // --- Test Conversion and Prompts
    // console.log(audioFile, prompt);

    const formData = new FormData();

    formData.append("file", audioFile);

    setStatus("uploading");

    const response = await api.post("/videos", formData);

    // --- Test Response
    // console.log(response.data);

    const videoId = response.data.video.id;

    setStatus("generating");

    const transcription = await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    });

    // --- Test Transcription
    // console.log(transcription.data);

    setStatus("success");
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

    console.log("Conversion finished.");
    console.log("Audio file created.");

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
          disabled={status != "idle"}
          ref={promptInput}
          id="transcription_prompt"
          className="h-20 leading-relaxed resize-none"
          placeholder="Add video keywords separated by commas (,)."
        />
      </div>
      <Button
        data-success={status == "success"}
        disabled={status != "idle"}
        type="submit"
        className="w-full data-[success=true]:bg-emerald-600"
      >
        {status === "idle" ? (
          <>
            <Upload className="w-5 h-5" />
            Upload Video
          </>
        ) : status === "error" ? (
          "Error occurred"
        ) : (
          statusMessages[status]
        )}
      </Button>
    </form>
  );
}
