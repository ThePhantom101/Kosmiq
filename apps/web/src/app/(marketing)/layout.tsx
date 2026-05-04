import NavHUD from "@/components/NavHUD";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavHUD />
      <main className="flex-grow pt-16">{children}</main>
    </>
  );
}
