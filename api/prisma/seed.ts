import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.prompt.deleteMany();

  await prisma.prompt.create({
    data: {
      title: "YouTube Title",
      template: `
      Your function is to generate three titles for a video on YouTube.

      Below you will receive a transcript of this video, use this transcript to generate the titles.
      Below you will also receive a list of titles, use this list as a reference for the titles to be generated.
      
      Titles must have a maximum of 60 characters.
      Titles must be catchy and attractive to maximize clicks.

      Return ONLY the three titles in list format as in the example below:
      '''
      - Title 1
      - Title 2
      - Title 3
      '''
      transcription:
      '''{transcription}'''
      
      `.trim(),
    },
  });

  await prisma.prompt.create({
    data: {
      title: "YouTube Description",
      template: `
      Your function is to generate a succinct description for a YouTube video.
      
      Below you will receive a transcript of this video, use this transcript to generate the description.
      The description must have a maximum of 80 words in the first person containing the main points of the video.
      Use eye-catching words that capture the attention of those reading.
      
      Additionally, at the end of the description include a list of 3 to 10 hashtags in lowercase letters containing the video's keywords.
      
      The return must follow the following format:
      '''
      Description...
      #hashtag1 #hashtag2 #hashtag3 ...
      '''
      Transcription:
      '''{transcription}'''
      
      `.trim(),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
