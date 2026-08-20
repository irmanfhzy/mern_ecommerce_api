import { useContext, useEffect, useState } from "react";

import { AppSettingContext } from "../../contexts/AppSettingContext";

import AddressForm from "../../components/common/AddressForm";
import ContactTable from "../../components/admin/ContactTable";
import Loading from "../../components/common/Loading";
import Button from "../../components/common/Button";
import ImageUploadField from "../../components/common/ImageUploadField";
import RichTextEditor from "../../components/common/RichTextEditor";

import useIndonesiaRegion from "../../hooks/useIndonesiaRegion";

export default function AppSetting() {
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const { appSetting, saveAppSetting } = useContext(AppSettingContext);

  const {
    form: address,
    setForm: setAddress,
    initializeRegion,

    provinces,
    cities,
    districts,
    villages,

    handleChange: handleAddressChange,
    handleProvinceChange,
    handleCityChange,
    handleDistrictChange,
    handleVillageChange,
  } = useIndonesiaRegion();

  const [form, setForm] = useState({
    appName: "",
    appDescription: "",
    about: "",

    contact: [],
    socialMedia: [],

    logo: null,
    favicon: null,
  });

  const [logoFiles, setLogoFiles] = useState([]);
  const [faviconFiles, setFaviconFiles] = useState([]);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [removeFavicon, setRemoveFavicon] = useState(false);

  useEffect(() => {
    if (!appSetting) return;

    setLoadingPage(true);

    setForm({
      appName: appSetting.appName,
      appDescription: appSetting.appDescription,
      about: appSetting.about,
      contact: appSetting.contact ?? [],
      socialMedia: appSetting.socialMedia ?? [],
      logo: appSetting.logo,
      favicon: appSetting.favicon,
    });

    if (appSetting.address) {
      setAddress(appSetting.address);
      initializeRegion(appSetting.address);
    }

    setLoadingPage(false);
  }, [appSetting, initializeRegion, setAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (type, index, field, value) => {
    setForm((prev) => ({
      ...prev,

      [type]: prev[type].map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const handleAddItem = (type) => {
    setForm((prev) => ({
      ...prev,

      [type]: [
        ...prev[type],

        {
          label: "",
          value: "",
          link: "",
        },
      ],
    }));
  };

  const handleRemoveItem = (type, index) => {
    setForm((prev) => ({
      ...prev,

      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleRemoveLogo = () => {
    setLogoFiles([]);

    setRemoveLogo(true);

    setForm((prev) => ({
      ...prev,
      logo: null,
    }));
  };

  const handleRemoveFavicon = () => {
    setFaviconFiles([]);

    setRemoveFavicon(true);

    setForm((prev) => ({
      ...prev,
      favicon: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoadingButton(true);

      const formData = new FormData();

      formData.append("appName", form.appName);
      formData.append("appDescription", form.appDescription);
      formData.append("about", form.about);
      formData.append("address", JSON.stringify(address));
      formData.append("contact", JSON.stringify(form.contact));
      formData.append("socialMedia", JSON.stringify(form.socialMedia));

      formData.append("removeLogo", removeLogo);
      formData.append("removeFavicon", removeFavicon);

      if (logoFiles.length) {
        formData.append("logo", logoFiles[0]);
      }

      if (faviconFiles.length) {
        formData.append("favicon", faviconFiles[0]);
      }

      await saveAppSetting(formData);

      setLogoFiles([]);
      setFaviconFiles([]);

      setRemoveLogo(false);
      setRemoveFavicon(false);

      alert("App setting updated successfully.");
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoadingButton(false);
    }
  };

  if (loadingPage) {
    return <Loading fullScreen />;
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-8 text-3xl font-bold">App Setting</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold">General Information</h2>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block font-medium">Application Name</label>

              <input
                type="text"
                name="appName"
                value={form.appName}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Description of Application
              </label>

              <textarea
                name="appDescription"
                rows={2}
                value={form.appDescription}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">About</label>

              <RichTextEditor
                value={form.about}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    about: value,
                  }))
                }
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold">Address</h2>

          <AddressForm
            form={address}
            provinces={provinces}
            cities={cities}
            districts={districts}
            villages={villages}
            onChange={handleAddressChange}
            onProvinceChange={handleProvinceChange}
            onCityChange={handleCityChange}
            onDistrictChange={handleDistrictChange}
            onVillageChange={handleVillageChange}
            showLabel={false}
            showDefault={false}
            showRecipient={false}
          />
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Contacts</h2>

            <Button
              type="button"
              onClick={() => handleAddItem("contact")}
              variant="primary"
            >
              Add Contact
            </Button>
          </div>

          <ContactTable
            contacts={form.contact}
            onChange={(index, field, value) =>
              handleItemChange("contact", index, field, value)
            }
            onRemove={(index) => handleRemoveItem("contact", index)}
          />
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Social Media</h2>

            <Button
              type="button"
              onClick={() => handleAddItem("socialMedia")}
              variant="primary"
            >
              Add Social Media
            </Button>
          </div>

          <ContactTable
            contacts={form.socialMedia}
            onChange={(index, field, value) =>
              handleItemChange("socialMedia", index, field, value)
            }
            onRemove={(index) => handleRemoveItem("socialMedia", index)}
          />
        </section>

        <section className="rounded-2xl border bg-white p-6">
          <h2 className="mb-6 text-lg font-semibold">Images</h2>

          <ImageUploadField
            label="Logo"
            multiple={false}
            maxFiles={1}
            images={logoFiles.length ? logoFiles : form.logo ? [form.logo] : []}
            onChange={(files) => setLogoFiles(files)}
            onRemove={handleRemoveLogo}
            imageClassName="h-24 w-auto rounded border object-contain"
          />

          <ImageUploadField
            label="Favicon"
            multiple={false}
            maxFiles={1}
            images={
              faviconFiles.length
                ? faviconFiles
                : form.favicon
                  ? [form.favicon]
                  : []
            }
            onChange={(files) => setFaviconFiles(files)}
            onRemove={handleRemoveFavicon}
          />
        </section>

        <div className="flex justify-end">
          <Button type="submit" loading={loadingButton} variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
