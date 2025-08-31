import Link from "next/link";

export default function Home() {
  return (
      <main className="flex-1 pt-2 px-4">
        <div className="text-sm text-muted-foreground">
          <h1 className="text-2xl font-bold mb-4">Welcome to <span className="text-foreground bg-muted/30 p-0.5 px-1.5 rounded">tuxbkt</span></h1>
          <p>
            tuxbkt is a minimalist, open-source cloud-based file storage solution that syncs instantly to your devices and allows you to share files with one click. It is designed to be simple, secure, and efficient, providing a seamless experience for users who want to store and access their files from anywhere.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2">How it works</h2>
          <p>
            When you sign up for tuxbkt, you create a secure account that allows you to upload and manage your files in the cloud. The intuitive interface makes it easy to drag and drop files, organize them into folders, and share them with others. You can also use an API key to integrate tuxbkt with your own applications and workflows for enhanced productivity.
          </p>
          <h2 className="text-xl font-semibold mt-6 mb-2">Pricing</h2>
          <p>
            tuxbkt offers a variety of pricing plans to suit your needs, including a free tier with basic features and paid plans for more advanced functionality. You can find detailed information about our pricing on the <Link href="/pricing" className="text-foreground underline">pricing page</Link>. We will <span className="text-foreground italic">always</span> offer a lifetime free tier.
          </p>
          <div className="bottom-8 fixed right-4">
            <Link href="/login" className="text-foreground bg-muted/30 p-4 rounded hover:bg-muted/20 transition-all">Get started</Link>
          </div>
          </div>
      </main>
  );
}
