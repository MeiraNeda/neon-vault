import "./globals.css";
import { Inter } from "next/font/google";
import { SupabaseProvider } from '../components/providers/SupabaseProvider';
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "Vault Cyber - Business, argent en ligne, contenu viral",
    template: "%s | Vault Cyber"
  },
  description:
    "Apprends à gagner de l'argent en ligne, créer du contenu viral, développer des compétences rentables et lancer un business digital en 2026.",

  keywords: [
    "gagner argent en ligne",
    "tiktok viral",
    "instagram croissance",
    "freelance débutant",
    "dropshipping 2026",
    "business en ligne",
    "revenus passifs",
    "développement personnel",
    "fitness perte de poids",
    "streaming twitch"
  ],

  authors: [{ name: "Vault Cyber" }],
  creator: "Vault Cyber",

  openGraph: {
    title: "Vault Cyber",
    description:
      "Stratégies pour gagner de l'argent en ligne et développer des compétences rentables.",
    type: "website",
    locale: "fr_FR"
  },

  twitter: {
    card: "summary_large_image",
    title: "Vault Cyber",
    description: "Business, argent en ligne et croissance personnelle"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SupabaseProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-73px)]">
            {children}
          </main>
        </SupabaseProvider>
      </body>
    </html>
  );
}