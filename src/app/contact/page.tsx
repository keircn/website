import type { Metadata } from "next";
import Link from "next/link";
import PageContainer from "~/components/PageContainer";

export const metadata: Metadata = {
  title: "keiran | contact",
  openGraph: {
    title: "keiran | contact",
    images: [
      {
        url: "/avatar-roxy.jpg",
        width: 736,
        height: 736,
        alt: "keiran avatar",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    title: "keiran | contact",
    images: ["/avatar-roxy.jpg"],
  },
};

export default function Contact() {
  return (
    <PageContainer>
      <div className="text-md text-muted-foreground space-y-4">
        <section className="relative mb-8">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Get in Touch
            </h1>
            <p className="text-md text-muted-foreground max-w-2xl">
              Feel free to reach out through any of these methods. I'm usually
              pretty responsive, especially on Discord.
            </p>
          </div>
        </section>

        <section id="contact" className="scroll-mt-16">
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
    </PageContainer>
  );
}
