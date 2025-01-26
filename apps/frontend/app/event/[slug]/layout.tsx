export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-green-400/40">
      <div>
        <h1>Hello</h1>
      </div>
      {children}
    </section>
  );
}
