import LenisProvider from "@/components/LenisProvider";
import "./globals.css";
import { ViewTransitions } from "next-view-transitions";
import localFont from "next/font/local";

export const metadata = {
  title: "HG",
  description: "A Personal Website",
};

export const moniqaDisplay = localFont({
  src: "./font/Moniqa-Display.otf",
  variable: "--font-moniqa-display",
  display: "swap",
});

export const moniqaHeading = localFont({
  src: "./font/Moniqa-Heading.otf",
  variable: "--font-moniqa-heading",
  display: "swap",
});

export const moniqaParagraph = localFont({
  src: "./font/Moniqa-Paragraph.otf",
  variable: "--font-moniqa-paragraph",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <ViewTransitions>
      <html
        lang="en"
        className={`${moniqaDisplay.variable} ${moniqaHeading.variable} ${moniqaParagraph.variable}`}
      >
        <body>
          <LenisProvider>{children}</LenisProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
