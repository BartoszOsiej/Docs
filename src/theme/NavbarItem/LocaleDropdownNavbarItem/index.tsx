import React, { type ReactNode } from 'react';
import { useLocalPathname } from '@docusaurus/theme-common/internal';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type Props = {
  mobile?: boolean;
  dropdownItemsBefore: unknown[];
  dropdownItemsAfter: unknown[];
  className?: string;
  [key: string]: unknown;
};

/**
 * Language switcher: two always-visible buttons (EN | PL) instead of the
 * default hover-dropdown with a globe icon — much easier to find.
 *
 * Note: Docusaurus localizes `siteConfig.baseUrl` (e.g. "/Docs/" on EN pages
 * but "/Docs/pl/" on PL pages), so we derive the global base ourselves to
 * build correct absolute links for both locales.
 */
export default function LocaleDropdownNavbarItemWrapper(props: Props): ReactNode {
  const pathname = useLocalPathname();
  const { i18n, siteConfig } = useDocusaurusContext();
  const current = i18n.currentLocale;

  // Strip the current locale from the localized baseUrl to get the global one.
  const globalBase = (() => {
    let base = siteConfig.baseUrl;
    for (const locale of i18n.locales) {
      if (locale === i18n.defaultLocale) continue;
      if (base.endsWith(`${locale}/`)) {
        base = base.slice(0, -(locale.length + 1));
        break;
      }
    }
    return base.endsWith('/') ? base : `${base}/`;
  })();

  // Strip the current locale prefix so we can rebuild the path for the
  // other locale while staying on the same page.
  const stripLocale = (p: string): string => {
    for (const locale of i18n.locales) {
      if (locale === i18n.defaultLocale) continue;
      const prefix = `/${locale}`;
      if (p === prefix) return '/';
      if (p.startsWith(`${prefix}/`)) return p.slice(prefix.length);
    }
    return p;
  };

  const targetPath = stripLocale(pathname);
  const suffix = targetPath === '/' || targetPath === '' ? '/' : targetPath;

  return (
    <div className="locale-switcher" itemScope itemType="https://schema.org/Language">
      {i18n.locales.map((locale) => {
        const localePart = locale === i18n.defaultLocale ? '' : `${locale}/`;
        const href = `${globalBase}${localePart}${suffix.replace(/^\//, '')}`;
        return (
          <a
            key={locale}
            href={href}
            lang={locale}
            className={`locale-btn${locale === current ? ' active' : ''}`}
          >
            {locale === 'pl' ? '🇵🇱 PL' : '🇬🇧 EN'}
          </a>
        );
      })}
    </div>
  );
}
