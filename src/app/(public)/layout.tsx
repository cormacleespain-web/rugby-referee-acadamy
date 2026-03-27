import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <PublicHeader />
      <main id="main-content" className="flex flex-1 flex-col w-full">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
