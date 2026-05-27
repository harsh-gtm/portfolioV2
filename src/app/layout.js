import LenisProvider from "@/components/LenisProvider";
import "./globals.css";
import { ViewTransitions } from "next-view-transitions";

export const metadata = {
  title: "HG",
  description: "A Personal Website",
};

export default function RootLayout({ children }) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body>
          <LenisProvider>{children}</LenisProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
