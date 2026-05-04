import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-black">
      <Sidebar />
      <main className="flex-grow overflow-y-auto p-8 relative">
        {/* Subtitle background glow for the main area */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-10">
          <div className="absolute -top-1/4 -right-1/4 w-full h-full bg-gold/5 blur-[150px] rounded-full" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
