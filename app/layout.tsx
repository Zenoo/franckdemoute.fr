import { personalData } from "@/utils/data/personal-data";
import { GoogleTagManager } from "@next/third-parties/google";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/footer";
import ScrollToTop from "./components/helper/scroll-to-top";
import Navbar from "./components/navbar";
import "./css/card.scss";
import "./css/globals.scss";
const inter = Inter({ subsets: ["latin"] });

const data = {
  title: `Portfolio of ${personalData.name} - Full-Stack Developer`,
  description:
    "Full-Stack Developer in La Rochelle. Typescript enthusiast, both Front End & Back End. Here to leave a part of me in the development community.",
  url: "https://franckdemoute.fr",
};

export const metadata: Metadata = {
  title: data.title,
  description: data.description,
  alternates: {
    canonical: data.url,
  },
  openGraph: {
    title: data.title,
    description: data.description,
    url: data.url,
    siteName: data.title,
    type: "website",
    images: [
      {
        url: "https://franckdemoute.fr/opengraph-image.jpg",
        width: 2536,
        height: 1021,
        alt: "Franck Demoute, Full-Stack Developer",
      },
    ]
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />
        <main className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white">
          <Navbar />
          {children}
          <ScrollToTop />
        </main>
        <Footer />
      </body>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM ?? ""} />
      <SpeedInsights />
    </html>
  );
}
