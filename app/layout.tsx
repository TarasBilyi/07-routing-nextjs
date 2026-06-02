import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TanStackProvider from "../components/TanStackProvider/TanStackProvider";

export const metadata: Metadata = {
  title: "NoteHub",
  description: "Manage your notes efficiently",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>
        <TanStackProvider>
          <Header />
          {children}
          {modal}
          <Footer />
          <div id="modal-root"></div>
        </TanStackProvider>
      </body>
    </html>
  );
}
