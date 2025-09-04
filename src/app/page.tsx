import Link from "next/link";

export default function Home() {
  const asciiArt = `
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣷⣜⢿⣧⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡄⠻⣿⣿⣿⣿⣦⠄⠄
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣿⣿⣿⣿⣮⡻⣷⡙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣆⠙⣿⣿⣿⣿⣧⠄
⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⣿⣿⣿⣿⣿⣿⣧⢸⣿⣿⣿⡘⢿⣮⡛⣷⡙⢿⣿⡏⢻⣿⣿⣿⣧⠙⢿⣿⣿⣷⠘⢿⣿⣆⢿⣿⣿⣿⣿⣆
⣿⣿⣿⣿⣿⣿⣿⣿⡿⠐⣿⣿⣿⣿⣿⣿⠃⠄⢣⠻⣿⣧⠄⠙⢷⡀⠙⢦⡙⢿⡄⠹⣿⣿⣿⣇⠄⠻⣿⣿⣇⠈⢻⣿⡎⢿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⡇⠄⣿⣿⣿⣿⣿⠋⠄⣼⣆⢧⠹⣿⣆⠄⠈⠛⣄⠄⢬⣒⠙⠂⠈⢿⣿⣿⡄⠄⠈⢿⣿⡀⠄⠙⣿⠘⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⡇⠄⣿⣿⣿⣿⠏⢀⣼⣿⣿⣎⠁⠐⢿⠆⠄⠄⠈⠢⠄⠙⢷⣤⡀⠄⠙⠿⠷⠄⠄⠄⠹⠇⠄⠄⠘⠄⢸⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⠄⠄⢻⣿⣿⠏⢀⣾⣿⣿⣿⣿⡦⠄⠄⡘⢆⠄⠄⠄⠄⠄⠄⠙⠻⡄⠄⠄⠉⡆⠄⠄⠄⠑⠄⢠⡀⠄⠄⣿⡿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⠄⠄⢸⣿⠋⣰⣿⣿⡿⢟⣫⣵⣾⣷⡄⢻⣄⠁⠄⠄⠠⣄⠄⠄⠄⠈⠂⠄⠄⠈⠄⠱⠄⠄⠄⠄⢷⢀⣠⣽⡇⣿
⣿⣿⣿⣿⣿⣿⣿⣿⡄⠄⠄⢁⣚⣫⣭⣶⣾⣿⣿⣿⣿⣿⣿⣦⣽⣷⣄⠄⠄⠘⢷⣄⠄⠄⠄⠄⣠⠄⠄⠄⠄⠈⠉⠈⠻⢸⣿⣿⡇⣿
⣿⣿⣿⣿⣿⣿⣿⣿⡇⠄⢠⣾⣿⣿⣿⣿⣿⡿⠿⠿⠟⠛⠿⣿⣿⣿⣿⣷⣤⣤⣤⣿⣷⣶⡶⠋⢀⡠⡐⢒⢶⣝⢿⡟⣿⢸⣿⣿⡃⣿
⣿⣿⣿⢹⣿⢿⣿⣿⣷⢠⣿⣿⣿⣿⣯⠷⠐⠋⠋⠛⠉⠁⠛⠛⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⡏⠊⡼⢷⢱⣿⡾⡷⣿⢸⡏⣿⢰⣿
⣿⣿⣿⢸⣿⡘⡿⣿⣿⠎⣿⠟⠋⢁⡀⡠⣒⡤⠬⢭⣖⢝⢷⣶⣬⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⢃⢔⠭⢵⣣⣿⠓⢵⣿⢸⢃⡇⢸⣿
⣿⣿⣿⡄⣿⡇⠄⡘⣿⣷⡸⣴⣾⣿⢸⢱⢫⡞⣭⢻⡼⡏⣧⢿⣿⣿⣿⣿⣿⣿⣿⡿⣿⢿⡿⣿⣧⣕⣋⣉⣫⣵⣾⣿⡏⢸⠸⠁⢸⡏
⣿⣿⣿⡇⠸⣷⠄⠈⠘⢿⣧⠹⣹⣿⣸⡼⣜⢷⣕⣪⡼⣣⡟⣾⣿⣿⢯⡻⣟⢯⡻⣿⣮⣷⣝⢮⣻⣿⢿⣿⣝⣿⣿⢿⣿⢀⠁⠄⢸⠄
⣿⣿⡿⣇⠄⠹⡆⠄⠄⠈⠻⣧⠩⣊⣷⠝⠮⠕⠚⠓⠚⣩⣤⣝⢿⣿⣯⡿⣮⣷⣿⣾⣿⢻⣿⣿⣿⣾⣷⣽⣿⣿⣿⣿⡟⠄⠄⠄⠄⢸
⠹⣿⡇⢹⠄⠄⠐⠄⠄⠄⠄⠈⠣⠉⡻⣟⢿⣝⢿⣝⠿⡿⣷⣝⣷⣝⣿⣿⣿⣿⣿⣿⣿⣧⢹⣿⣿⣿⣿⣿⣿⣿⣿⡟⣠⠄⠄⠄⠄⠈
⠄⠘⠇⠄⠄⠄⠄⠄⠄⠄⠄⠄⠠⣌⠈⢳⢝⣮⣻⣿⣿⣮⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠄⠄⠄⠄⢀
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢻⣷⣤⣝⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠄⠄⠄⠄⣼
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⢿⣿⣿⣿⣿⣿⣿⣿⠏⠄⠄⠄⠄⣰⢩
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢻⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⠛⠋⠉⠉⠉⠄⠄⠄⠄⣸⣿⣿⣿⣿⡿⠃⠄⠄⠄⠄⣰⣿⣧
⣷⡀⠄⠈⢦⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢻⣯⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⣤⣤⣶⣶⣶⣶⣾⣿⣿⣿⣿⡿⠋⠄⠄⠄⠄⠄⣰⣿⣿⣿
⣿⣿⣦⡱⣌⢻⣦⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠙⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠄⠄⠄⠄⠄⠄⢰⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣷⣿⣿⣦⣐⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠉⠛⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣫⡔⢀⣴⠄⠄⠄⡼⣠⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠉⠉⠉⠙⠛⢛⣛⣛⣭⣾⣿⣴⣿⢇⣤⣦⣾⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⠟⠁⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿`;

  const age = new Date().getFullYear() - 2009;

  return (
    <main className="flex-1 pt-2">
      <div className="text-md text-muted-foreground max-w-3xl pl-4 space-y-8">
        <section>
          <h1 className="text-2xl font-bold">
            # Hey, I&apos;m{" "}
            <span className="text-foreground bg-muted/30 p-0.5 px-1.5 rounded">
              keiran
            </span>
          </h1>
          <pre className="mb-4 text-xs text-muted-foreground font-mono whitespace-pre">
            {asciiArt}
          </pre>
        </section>

        <section id="about">
          <h2 className="text-xl font-semibold mt-4 mb-2">## who am i</h2>
          <p>
            I&apos;m a {age} year old developer and Linux sysadmin from the UK.
            I&apos;ve been using Linux for about 2 years and{" "}
            <code className="font-mono text-foreground bg-muted/30 p-0.5 px-1.5">
              i use arch btw
            </code>
            . I enjoy learning about new technologies and have contributed to
            many open source projects. You can find my work on my{" "}
            <Link
              href="https://github.com/keircn"
              target="_blank"
              className="text-foreground underline hover:text-foreground/80 transition-all"
            >
              GitHub
            </Link>
            .
          </p>
        </section>

        <section id="projects" className="pt-8">
          <h2 className="text-xl font-semibold mb-4">## my projects</h2>
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

        <div className="bottom-8 fixed right-4">
          <Link
            href="/contact"
            className="text-foreground bg-muted/30 p-4 rounded hover:bg-muted/20 transition-all"
          >
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
