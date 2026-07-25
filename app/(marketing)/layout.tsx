import { SiteHeader } from "@/components/features/site-header";
import { SiteFooter } from "@/components/features/site-footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
