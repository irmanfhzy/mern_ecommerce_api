export default function Badge({ label }) {
  return (
    <span
      className="
    inline-flex
    w-fit
    items-center
    rounded-full
    bg-linear-to-r
    from-indigo-500
    to-blue-600
    px-4
    py-1.5
    text-sm
    font-semibold
    text-white
    shadow-md
    shadow-blue-500/20
  "
    >
      {label}
    </span>
  );
}
