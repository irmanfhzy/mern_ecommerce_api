import Button from "../common/Button";

export default function ContactForm({ contacts, onChange, onRemove }) {
  return (
    <div className="space-y-4">
      {contacts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-gray-500">
          No contacts.
        </div>
      ) : (
        contacts.map((contact, index) => (
          <div key={index} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-gray-800">Contact {index + 1}</h3>

              <Button
                type="button"
                variant="danger"
                onClick={() => onRemove(index)}
              >
                Delete
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Label
                </label>

                <input
                  type="text"
                  value={contact.label}
                  onChange={(e) => onChange(index, "label", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  placeholder="e.g. Email"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Value
                </label>

                <input
                  type="text"
                  value={contact.value}
                  onChange={(e) => onChange(index, "value", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  placeholder="e.g. support@example.com"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Link
                </label>

                <input
                  type="text"
                  value={contact.link}
                  onChange={(e) => onChange(index, "link", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  placeholder="e.g. mailto:support@example.com"
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
