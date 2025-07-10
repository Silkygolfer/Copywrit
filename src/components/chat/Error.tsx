import { CircleAlert } from 'lucide-react';

export default function Error({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-[#e63946]/30 bg-[#e63946]/5 backdrop-blur-sm px-5 py-4 text-[#e63946] flex items-center gap-4 shadow-sm max-w-[85%]">
      <CircleAlert size={24} aria-hidden="true" />
      <p className="text-sm leading-relaxed">{message}</p>
    </div>
  );
}
