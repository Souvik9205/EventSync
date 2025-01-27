"use client";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "/home";
  }
  return (
    <div>
      <div className="w-full relative">{children}</div>
    </div>
  );
}
