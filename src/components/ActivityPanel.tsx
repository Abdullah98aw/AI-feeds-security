import { Activity } from 'lucide-react';

export interface ActivityItem {
  id: string;
  time: string;
  label: string;
  detail: string;
}

export function ActivityPanel({ items }: { items: ActivityItem[] }) {
  return (
    <aside className="rounded-lg border border-line bg-panel p-4">
      <div className="flex items-center gap-2">
        <Activity size={18} className="text-signal" />
        <h2 className="font-semibold">Live activity</h2>
      </div>
      <div className="mt-4 max-h-[38rem] space-y-0 overflow-y-auto pr-1 thin-scrollbar">
        {items.map((item, index) => (
          <div key={item.id} className="grid grid-cols-[3.4rem_1fr] gap-3">
            <span className="pt-1 text-xs text-slate-500">{item.time}</span>
            <div className="border-l border-line pb-4 pl-3">
              <span className={`-ml-[1.12rem] mt-1 block h-2.5 w-2.5 rounded-full ${index === 0 ? 'bg-signal' : 'bg-slate-600'}`} />
              <p className="-mt-4 text-sm font-medium text-slate-200">{item.label}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
