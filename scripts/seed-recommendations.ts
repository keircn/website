import { db } from "~/db";
import { recommendations } from "~/db/schema";

async function addAnimeRecommendation() {
  await db.insert(recommendations).values({
    type: "anime",
    externalId: "21519",
    title: "Your Name.",
    recommendation:
      "Starting off somewhat comedically, this anime is a short but surprisingly tense movie about two high school students who end up swapping bodies, with a twist that I really didn't see coming that made my chest feel tight. A must-watch romantic fantasy movie.",
    coverImage:
      "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21519-SUo3ZQuCbYhJ.png",
    metadata: {
      format: "MOVIE",
      status: "FINISHED",
      score: 9,
    },
    sortOrder: 10,
  });

  console.log("Added anime recommendation");
}

async function addMangaRecommendation() {
  await db.insert(recommendations).values({
    type: "manga",
    externalId: "99609",
    title: "I Want to Eat Your Pancreas",
    recommendation:
      "A beautiful yet sad story that genuinely made me tear up. It explores the depth of a friendship built on mutual understanding and emotional connection that is usually hard to get right, yet the author managed to hook me even with how short the manga is.",
    coverImage:
      "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx99609-hfnudDtTT1n5.jpg",
    metadata: {
      format: "Manga",
      status: "FINISHED",
      score: 10,
    },
    sortOrder: 10,
  });

  console.log("Added manga recommendation");
}

async function addNovelRecommendation() {
  await db.insert(recommendations).values({
    type: "novel",
    externalId: "85470",
    title: "Mushoku Tensei: Jobless Reincarnation",
    recommendation:
      "Regularly considered one of the foundations of modern isekai, Mushoku Tensei is an unparalleled pillar of the subgenre. It tells a beautiful story of a really fucked up dude in an incredibly well developed world.",
    coverImage:
      "https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/nx85470-jt6BF9tDWB2X.jpg",
    metadata: {
      format: "Light Novel",
      status: "FINISHED",
      score: 9,
    },
    sortOrder: 10,
  });

  console.log("Added light novel recommendation");
}

async function addVNRecommendation() {
  await db.insert(recommendations).values({
    type: "vn",
    externalId: "v2002",
    title: "Steins;Gate",
    recommendation:
      "Steins;Gate follows a rag-tag band of tech-savvy young students who discover the means of changing the past via mail, using a modified microwave. Their experiments into how far they can go with their discovery begin to spiral out of control as they become entangled in a conspiracy surrounding SERN, the organisation behind the Large Hadron Collider, and John Titor who claims to be from a dystopian future.",
    coverImage: "https://t.vndb.org/cv/19/77819.jpg",
    metadata: {
      length: 4,
      rating: 8.5,
    },
    sortOrder: 10,
  });

  console.log("Added visual novel recommendation");
}

async function main() {
  console.log("Adding sample recommendations...");

  await addAnimeRecommendation();
  await addMangaRecommendation();
  await addNovelRecommendation();
  await addVNRecommendation();

  console.log("Done! All sample recommendations added.");
  process.exit(0);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
