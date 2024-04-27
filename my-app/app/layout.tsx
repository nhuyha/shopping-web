"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { negotiateLanguages } from '@fluent/langneg';
import { FluentBundle, FluentResource } from '@fluent/bundle';
import { LocalizationProvider, ReactLocalization } from '@fluent/react';
import en from "./trans/en"
import vn from "./trans/vn"

// Store all translations as a simple object which is available 
// synchronously and bundled with the rest of the code.
const RESOURCES: Record<string, FluentResource> = {
    'vi-VN': new FluentResource(vn),
    'en-US': new FluentResource(en),
  
};

// A generator function responsible for building the sequence 
// of FluentBundle instances in the order of user's language
// preferences.
function* generateBundles(userLocales: readonly string[]) {
    // Choose locales that are best for the user.
    const currentLocales = negotiateLanguages(
        userLocales,
        ['vi-VN', 'en-US'],
        { defaultLocale: 'vi-VN' }
    );

    for (const locale of currentLocales) {
        const bundle = new FluentBundle(locale);
        bundle.addResource(RESOURCES[locale]);
        yield bundle;
    }
}

// The ReactLocalization instance stores and caches the sequence of generated
// bundles. You can store it in your app's state.
let l10n = new ReactLocalization(generateBundles(['vi-VN']));

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LocalizationProvider l10n={l10n}>
      <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    </LocalizationProvider>

  );
}
