import "./globals.css";

export const metadata = {
  title: "Jimmy Cornejo | Espacio Digital",
  description: "Espacio personal y portafolio de operaciones y sistemas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
