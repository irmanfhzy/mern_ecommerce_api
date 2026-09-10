export default function AddressForm({
  form,

  provinces = [],
  cities = [],
  districts = [],
  villages = [],

  onChange,
  onProvinceChange,
  onCityChange,
  onDistrictChange,
  onVillageChange,

  showRecipient = true,
  showLabel = true,
  showDefault = true,
}) {
  return (
    <>
      {showRecipient && (
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Recipient Name
            </label>

            <input
              type="text"
              name="recipientName"
              value={form.recipientName}
              onChange={onChange}
              placeholder="John Doe"
              className="w-full rounded-lg border px-4 py-2 outline-none transition focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="08123456789"
              className="w-full rounded-lg border px-4 py-2 outline-none transition focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {showLabel && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Address Label
          </label>

          <input
            type="text"
            name="label"
            value={form.label}
            onChange={onChange}
            placeholder="Home, Office, Boarding House"
            className="w-full rounded-lg border px-4 py-2 outline-none transition focus:border-blue-500"
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Province</label>

          <select
            value={form.provinceId}
            onChange={onProvinceChange}
            className="w-full rounded-lg border px-4 py-2 outline-none transition focus:border-blue-500"
          >
            <option value="">Select Province</option>

            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.province}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            City / Regency
          </label>

          <select
            value={form.cityId}
            onChange={onCityChange}
            disabled={!form.provinceId}
            className="w-full rounded-lg border px-4 py-2 outline-none transition focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">Select City / Regency</option>

            {cities.map((city) => (
              <option key={city.code} value={city.code}>
                {city.regency}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">District</label>

          <select
            value={form.districtId}
            onChange={onDistrictChange}
            disabled={!form.cityId}
            className="w-full rounded-lg border px-4 py-2 outline-none transition focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">Select District</option>

            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.district}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Village</label>

          <select
            value={form.villageId}
            onChange={onVillageChange}
            disabled={!form.districtId}
            className="w-full rounded-lg border px-4 py-2 outline-none transition focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
          >
            <option value="">Select Village</option>

            {villages.map((village) => (
              <option key={village.code} value={village.code}>
                {village.village}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Postal Code</label>

        <input
          type="text"
          name="postalCode"
          value={form.postalCode}
          readOnly
          placeholder="Select village first"
          className="w-full cursor-not-allowed rounded-lg border bg-gray-100 px-4 py-2 text-gray-600 outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Street Address</label>

        <textarea
          name="street"
          rows={4}
          value={form.street}
          onChange={onChange}
          placeholder="House number, street name, RT/RW, landmark..."
          className="w-full resize-none rounded-lg border px-4 py-2 outline-none transition focus:border-blue-500"
        />
      </div>

      {showDefault && (
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={onChange}
          />

          <span className="text-sm">Set as default address</span>
        </label>
      )}
    </>
  );
}
