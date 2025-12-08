import { getRequestConfig } from 'next-intl/server';
import { locales } from './settings';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !locales.includes(locale as any)) {
        locale = 'fr';
    }

    return {
        locale,
        messages: (await import(`@/locales/${locale}/common.json`)).default,
    };
});
