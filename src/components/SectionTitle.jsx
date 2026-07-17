export default function SectionTitle({
  badge,
  title,
  description,
  center = false,
}) {
  return (
    <div
      className={`${center ? "text-center mx-auto" : ""
        } max-w-3xl`}
    >

      {/* Badge */}

      {badge && (

        <div className="inline-flex items-center rounded-full border border-[#DCCBB8] bg-[#FFF8F3] px-5 py-2 text-sm font-semibold text-[#6F4E37] shadow-sm mb-5">

          {badge}

        </div>

      )}

      {/* Title */}

      <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-[#2C2C2C]">

        {title}

      </h2>

      {/* Decorative Line */}

      <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#6F4E37] via-[#B08968] to-[#EADBC8]" />

      {/* Description */}

      <p className="mt-6 text-lg leading-8 text-[#6B7280]">

        {description}

      </p>

    </div>
  );
}