function PlaceholderPage({ title, description }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="text-slate-600">{description}</p>
    </section>
  );
}

export default PlaceholderPage;
