import Link from "next/link";

export default function Contact() {
  return (
    <main className="flex-1 pt-12 md:pt-2">
      <div className="text-md text-muted-foreground max-w-4xl px-3 md:pl-4 space-y-4">
        <section>
          <h1 className="text-2xl font-bold font-mono"># Get in touch</h1>
        </section>

        <section id="contact" className="scroll-mt-16">
          <h2 className="text-xl font-semibold font-mono mb-4">
            ## contact methods
          </h2>
          <p className="mb-6">
            Feel free to reach out to me through any of these methods. I'm
            usually pretty responsive, especially on Discord.
          </p>

          <div className="space-y-6">
            <div className="border border-border bg-muted/10 rounded p-4">
              <h3 className="text-lg font-medium text-foreground mb-3">
                Primary Contact
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <Link
                    href="mailto:keiran@keircn.com"
                    className="text-sm text-foreground hover:text-foreground/80 transition-all underline"
                  >
                    keiran@keircn.com
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Discord</span>
                  <Link
                    href="https://discord.com/users/1230319937155760131"
                    target="_blank"
                    className="text-sm text-foreground hover:text-foreground/80 transition-all underline"
                  >
                    keircn
                  </Link>
                </div>
              </div>
            </div>

            <div className="border border-border bg-muted/10 rounded p-4">
              <h3 className="text-lg font-medium text-foreground mb-3">
                Alternative Contact
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Personal Email
                  </span>
                  <Link
                    href="mailto:keiran@incel.email"
                    className="text-sm text-foreground hover:text-foreground/80 transition-all underline"
                  >
                    keiran@incel.email
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Important Stuff
                  </span>
                  <Link
                    href="mailto:keiran@proton.me"
                    className="text-sm text-foreground hover:text-foreground/80 transition-all underline"
                  >
                    keircn@proton.me
                  </Link>
                </div>
              </div>
            </div>

            <div className="border border-border bg-muted/10 rounded p-4">
              <h3 className="text-lg font-medium text-foreground mb-3">
                Security
              </h3>
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-muted-foreground">
                    PGP Key ID
                  </span>
                  <span className="text-sm text-foreground font-mono">
                    7E9BD127A2CF9332
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-muted-foreground">
                    Fingerprint
                  </span>
                  <span className="text-sm text-foreground font-mono text-right break-all">
                    EF4A 62F5 D811 3782 21EB 6071 7E9B D127 A2CF 9332
                  </span>
                </div>
                <div className="pt-2">
                  <Link
                    href="/pgp-key.asc"
                    className="text-sm text-foreground hover:text-foreground/80 transition-all underline"
                  >
                    Download PGP Public Key
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
