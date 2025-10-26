import Image from "next/image";
import RecentManga from "~/components/RecentManga";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)]">
      <div className="flex flex-row justify-between items-center w-full max-w-2xl space-x-24">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold">
            hi, i&apos;m <span className="text-fuchsia-300">key</span>
          </h1>
          <p className="text-lg font-medium text-neutral-400">dev · 16 · UK</p>
          <p className="text-sm text-neutral-400 mt-4">
            I&apos;m a developer and weeb from the UK. I&apos;ve been using Arch
            for about 2 years and I code sometimes, not that I&apos;m very good
            at it.
          </p>
        </div>
        <Image
          src="/avatar.jpg"
          alt="avatar"
          className="rounded w-64"
          width={128}
          height={128}
        />
      </div>
      {/* <div className="flex flex-row space-x-4 mt-12"></div> */}
      <div className="w-full max-w-2xl mt-12">
        <RecentManga />
      </div>
    </div>
  );
}
