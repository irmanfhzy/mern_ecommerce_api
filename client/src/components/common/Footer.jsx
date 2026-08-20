import { useContext } from "react";
import { AppSettingContext } from "../../contexts/AppSettingContext";

export default function Footer() {
  const { appSetting } = useContext(AppSettingContext);

  const address = appSetting?.address;
  const contacts = appSetting?.contact ?? [];
  const socialMedia = appSetting?.socialMedia ?? [];

  return (
    <footer className="border-t bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {appSetting?.appName}
            </h2>

            {appSetting?.appDescription && (
              <p className="mt-3 max-w-xs text-sm leading-6 text-gray-400">
                {appSetting.appDescription}
              </p>
            )}
          </div>

          {address && (
            <div>
              <h3 className="font-semibold text-white">Address</h3>

              <div className="mt-3 text-sm leading-6 text-gray-400">
                <p>{address.street}</p>
                <p>
                  {address.village}, {address.district}
                </p>
                <p>
                  {address.city}, {address.province}
                </p>
                <p>{address.postalCode}</p>
              </div>
            </div>
          )}

          {contacts.length > 0 && (
            <div>
              <h3 className="font-semibold text-white">Contact</h3>

              <div className="mt-3 space-y-2 text-sm">
                {contacts.map((contact, index) => (
                  <div key={index}>
                    {contact.link ? (
                      <a
                        href={contact.link}
                        target={
                          contact.link.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          contact.link.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="text-gray-400 transition hover:text-white"
                      >
                        {contact.label}: {contact.value}
                      </a>
                    ) : (
                      <p className="text-gray-400">
                        {contact.label}: {contact.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {socialMedia.length > 0 && (
            <div>
              <h3 className="font-semibold text-white">Follow Us</h3>

              <div className="mt-3 space-y-2 text-sm">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-gray-400 transition hover:text-white"
                  >
                    {social.label}: {social.value}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          &copy; 2026 {appSetting?.appName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
