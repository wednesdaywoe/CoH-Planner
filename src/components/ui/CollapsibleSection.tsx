import { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({ title, defaultOpen = true, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-1.5 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-950 border-y border-slate-700/50 cursor-pointer select-none hover:text-slate-400 transition-colors"
      >
        <span className={`text-[8px] transition-transform duration-150 ${open ? 'rotate-0' : '-rotate-90'}`}>
          ▼
        </span>
        {title}
      </button>
      {open && children}
    </div>
  );
}
