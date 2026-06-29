export default function Loading({ text = "Loading...", fullScreen = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen ? "min-h-screen" : "py-12"
      }`}
    >
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />

      <p className="text-gray-500 text-sm font-medium">{text}</p>
    </div>
  );
}
