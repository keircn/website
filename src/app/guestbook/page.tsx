import { getGuestbookEntries } from "~/app/actions/guestbook";
import Guestbook from "~/components/Guestbook";

export const dynamic = "force-dynamic";

export default async function GuestbookPage() {
  const data = await getGuestbookEntries(1);

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-4rem)] py-8 sm:py-12">
      <div className="w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl 4xl:max-w-[1800px] px-4">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Guestbook</h1>
          <p className="text-muted-foreground">
            Leave a message for me and other visitors!
          </p>
        </div>
        <Guestbook initialData={data} />
      </div>
    </div>
  );
}
