import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
    <main className="flex-1 pt-12 md:pt-2">
      <div className="max-w-6xl mx-auto pl-2 pr-4 border border-border rounded-lg p-4 ml-0 md:ml-6 mr-3">
        <div className="text-md text-muted-foreground max-w-4xl px-2 space-y-8">
          <section>
            <h1 className="text-2xl font-bold font-mono">
              # Hey, I&apos;m{" "}
              <span className="text-foreground bg-muted/30 p-0.5 px-1.5 rounded">
                keiran
              </span>
            </h1>
            <div className="hidden sm:block mt-6">
              <Image
                src="/avatar.webp"
                alt="avatar"
                width={200}
                height={200}
                className="rounded-lg"
                priority
              />
            </div>
          </section>

          <section id="about" className="scroll-mt-16">
            <h2 className="text-xl font-semibold font-mono mt-4 mb-2">
              ## who am i
            </h2>
            <p className="mb-4">
              I'm a 16 year old developer and tech enthusiast from the UK. I've
              been running Linux for about 2 years and i use arch btw. I enjoy
              learning about new technologies and have contributed to many open
              source projects. You can find my work on my{" "}
              <Link
                href="https://github.com/keircn"
                target="_blank"
                className="text-foreground underline hover:text-foreground/80 transition-all"
              >
                GitHub
              </Link>
              .
            </p>
            <p>
              My main hobbies are coding, breaking linux and watching anime.
              Here's my{" "}
              <Link
                className="text-foreground hover:text-foreground/80 transition-all underline"
                href="/anilist"
              >
                AniList
              </Link>{" "}
              if you wanna see how much I love isekai trash. I also have a blog
              I rarely write for at{" "}
              <Link
                href="https://blog.keircn.com"
                className="text-foreground underline hover:text-foreground/80 transition-all"
              >
                blog.keircn.com
              </Link>{" "}
              if you're interested. I also like to poke around in small open
              source projects and hunt for bugs since it can be quite fun to do.
              Other than that, I occasionally play games but not as much as I
              used to.
            </p>

            <div className="mt-6 border border-border bg-muted/10 max-w-sm sm:max-w-md">
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
                    <div className="text-sm text-muted-foreground">
                      Graphics
                    </div>
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

          <div className="fixed right-8 bottom-4 md:bottom-8 hidden sm:block">
            <Link
              href="/contact"
              className="text-foreground bg-muted/30 px-4 py-2 rounded hover:bg-muted/20 transition-all shadow-sm"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
