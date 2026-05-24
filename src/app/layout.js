import LenisProvider from "@/components/LenisProvider";
import "./globals.css";

export const metadata = {
  title: "HG",
  description: "A Personal Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
