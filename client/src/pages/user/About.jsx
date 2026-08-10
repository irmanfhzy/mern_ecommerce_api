import { useContext } from "react";

import { AppSettingContext } from "../../contexts/AppSettingContext";
import Loading from "../../components/common/Loading";

export default function About() {
  const { appSetting } = useContext(AppSettingContext);

  if (!appSetting) {
    return <Loading fullScreen />;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">About</h1>

      <article
        className="
          prose
          max-w-none

          prose-headings:font-bold
          prose-headings:text-gray-900

          prose-p:text-gray-700
          prose-p:leading-7

          prose-a:text-blue-600
          prose-a:underline
          prose-a:underline-offset-2

          prose-strong:text-gray-900

          prose-blockquote:border-l-4
          prose-blockquote:border-gray-300
          prose-blockquote:text-gray-600

          prose-ul:text-gray-700
          prose-ol:text-gray-700
          prose-li:my-1
        "
        dangerouslySetInnerHTML={{
          __html: appSetting.about ?? "",
        }}
      />
    </div>
  );
}
