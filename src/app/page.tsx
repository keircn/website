import Link from "next/link";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="font-mono min-h-screen flex text-foreground bg-background">
      <Sidebar />
      <main className="flex-1 p-2">
        <div className="text-sm text-muted-foreground">
          <h1 className="text-2xl font-bold mb-4">Welcome to tuxbkt_</h1>
        </div>
      </main>
    </div>
  );
}
