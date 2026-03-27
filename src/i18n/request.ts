import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // MVP: single locale (en). Later: read from cookie or Accept-Language.
  const locale = "en";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
