import { ArrowUpRight } from "lucide-react";

export default function ServiceCard({
  icon,
  title,
  description,
  loading = false,
}) {

  if (loading) {
    return (
      <div className="bg-white rounded-[30px] p-8 border border-slate-100 card-shadow animate-pulse">
        <div className="w-16 h-16 rounded-[22px] bg-slate-200 mb-6"></div>

        <div className="h-8 bg-slate-200 rounded mb-4"></div>

        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-11/12"></div>
          <div className="h-4 bg-slate-200 rounded w-8/12"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-[30px] border border-[#EADBC8] bg-[#FFFDFB] p-8 shadow-[0_15px_40px_rgba(111,78,55,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(111,78,55,0.18)]">

      {/* Icon */}

      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#EADBC8] text-[#6F4E37] transition-all duration-500 group-hover:scale-110 group-hover:bg-[#6F4E37] group-hover:text-white">

        {icon}

      </div>

      {/* Title */}

      <h3 className="mb-4 text-2xl font-bold text-[#2C2C2C]">

        {title}

      </h3>

      {/* Decorative Line */}

      <div className="mb-5 h-1 w-14 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

      {/* Description */}

      <p className="leading-7 text-[#6B7280]">

        {description}

      </p>

    </div>
  );
}