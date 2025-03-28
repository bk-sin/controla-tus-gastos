import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = "es";

  return {
    locale,
    messages: (await import(`../lang/${locale}.json`)).default,
  };
});
