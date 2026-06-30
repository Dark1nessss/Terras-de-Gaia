import { Timer } from "lucide-react";
import { SidebarWidget } from "@/components/sidebar-widget";

export function SportsCalendar() {
  return (
    <SidebarWidget title="Calendário" icon={<Timer size={18} />}>
      <div className="border border-dashed border-white/10 bg-white/2 px-4 py-5 text-center">
        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-[#006ec2] mb-2">
          Coming soon
        </p>
        <p className="text-xs text-white/45 leading-relaxed">
          Estamos a preparar o calendário de jogos e eventos do desporto.
        </p>
      </div>
    </SidebarWidget>
  );
}
