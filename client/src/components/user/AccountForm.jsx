import Button from "../common/Button";

export default function AccountForm({
  title,
  description,
  children,
  loading,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>

        <p className="mt-2 text-gray-500">{description}</p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <form onSubmit={onSubmit}>
          <div className="space-y-5">{children}</div>

          <div className="mt-8 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>

            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
