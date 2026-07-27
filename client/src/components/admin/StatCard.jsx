export default function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h3 className="mt-2 text-3xl font-bold text-gray-800">{value}</h3>

          <p className="mt-2 min-h-5 text-sm text-gray-400">{subtitle}</p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl text-2xl text-white ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
