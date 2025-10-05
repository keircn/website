import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LastfmViewer from "~/components/LastfmViewer";
import PageContainer from "~/components/PageContainer";

export const metadata: Metadata = {
  title: "keiran | home",
  openGraph: {
    title: "keiran | home",
  },
  twitter: {
    title: "keiran | home",
  },
};

export default function Home() {
  return (
    <PageContainer>
      <div className="text-md text-muted-foreground max-w-4xl px-2 space-y-8">
        <section>
          <h1 className="text-2xl font-bold text-foreground/90">
            Hey, I&apos;m{" "}
            <span className="text-foreground bg-muted/30 p-0.5 px-1.5 rounded">
              keiran
            </span>
          </h1>
          <div className="hidden sm:block mt-6">
            <Image
              src="/avatar-roxy.webp"
              alt="avatar"
              width={200}
              height={200}
              className="rounded-lg shadow-glow"
              priority
            />
          </div>
        </section>

        <LastfmViewer />

        <section id="about" className="scroll-mt-16">
          <h2 className="text-xl font-semibold font-mono mt-4 mb-2">
            ## who am i
          </h2>
          <p className="mb-4">
            I'm a 16 y/o developer and weeb from the UK. I've been running Linux
            for about two years now -- and yes, I use{" "}
            <span className="text-blue-300">Arch</span>, btw. I enjoy diving
            into new technologies and love contributing to the OSS community.
            You can find my projects and contributions on my{" "}
            <Link
              href="https://github.com/keircn"
              target="_blank"
              className="text-foreground underline hover:text-foreground/80 transition-all"
            >
              GitHub
            </Link>
          </p>
          <p>
            When I'm not coding, my main hobbies include breaking Linux and
            watching anime. If you want to see just how much I love shitty
            isekais, you can peek at my{" "}
            <Link
              className="text-foreground hover:text-foreground/80 transition-all underline"
              href="/anilist"
            >
              AniList
            </Link>{" "}
            . I also occasionally hunt for bugs in small open-source projects --
            it's quite fun! If you're interested, I also have a blog I rarely
            write for at{" "}
            <Link
              href="https://blog.keircn.com"
              className="text-foreground underline hover:text-foreground/80 transition-all"
            >
              blog.keircn.com
            </Link>
          </p>

          <div className="mt-6 border border-border bg-muted/10 max-w-sm sm:max-w-md rounded">
            <div className="py-3 border-b border-border flex items-center justify-between mx-4">
              <h3 className="text-lg font-medium text-foreground">
                ThinkPad X240
              </h3>
              <span className="text-lg font-medium text-muted-foreground">
                Specs
              </span>
            </div>
            <div className="p-4">
              <div className="divide-y divide-border">
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="text-sm text-muted-foreground">CPU</div>
                  <div className="text-sm text-foreground text-right">
                    Intel Core i5-4200U
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="text-sm text-muted-foreground">RAM</div>
                  <div className="text-sm text-foreground text-right">
                    8 GB DDR3L 1600 MHz
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="text-sm text-muted-foreground">Storage</div>
                  <div className="text-sm text-foreground text-right">
                    160 GB SATA SSD
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="text-sm text-muted-foreground">Display</div>
                  <div className="text-sm text-foreground text-right">
                    12.5" IPS 1366x768
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="text-sm text-muted-foreground">Graphics</div>
                  <div className="text-sm text-foreground text-right">
                    Intel HD Graphics 4400
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="text-sm text-muted-foreground">OS</div>
                  <div className="text-sm text-foreground text-right">
                    Arch Linux
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="scroll-mt-16">
          <h2 className="text-xl font-semibold font-mono mb-4">
            ## my projects
          </h2>
          <div className="space-y-4">
            <div className="border border-border rounded p-4 bg-muted/10">
              <h3 className="text-lg font-medium text-foreground mb-2">
                Coming Soon
              </h3>
              <p className="text-sm">
                Projects showcase will be added here. Check back soon or visit
                my{" "}
                <Link
                  href="https://github.com/keircn"
                  target="_blank"
                  className="text-foreground underline hover:text-foreground/80 transition-all"
                >
                  GitHub
                </Link>{" "}
                for now.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
