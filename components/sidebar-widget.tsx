export function SidebarWidget({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white/2 border border-white/5 p-6 rounded-sm">
      <div className="flex items-center gap-3 mb-4 text-[#006ec2]">
        {icon}
        <span className="text-xs font-black uppercase tracking-widest text-white">{title}</span>
      </div>
      {children}
    </div>
  );
}