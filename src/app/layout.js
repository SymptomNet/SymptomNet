import { Saira } from "next/font/google";
import "./globals.css";

const saira = Saira({
	variable: "--font-saira",
	subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${saira.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
