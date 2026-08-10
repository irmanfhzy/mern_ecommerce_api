import Button from "../common/Button";

export default function ContactTable({ contacts, onChange, onRemove }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-3 text-left">Label</th>
            <th className="p-3 text-left">Value</th>
            <th className="p-3 text-left">Link</th>
            <th className="w-24 p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {contacts.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-6 text-center text-gray-500">
                No contacts.
              </td>
            </tr>
          ) : (
            contacts.map((contact, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">
                  <input
                    type="text"
                    value={contact.label}
                    onChange={(e) => onChange(index, "label", e.target.value)}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </td>

                <td className="p-2">
                  <input
                    type="text"
                    value={contact.value}
                    onChange={(e) => onChange(index, "value", e.target.value)}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </td>

                <td className="p-2">
                  <input
                    type="text"
                    value={contact.link}
                    onChange={(e) => onChange(index, "link", e.target.value)}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </td>

                <td className="p-2 text-center">
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => onRemove(index)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
