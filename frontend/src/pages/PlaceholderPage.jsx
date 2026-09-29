export default function PlaceholderPage({ title }) {
  return (
    <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
      <div className="bg-slate-800/50 border border-slate-700/60 p-8 rounded-2xl max-w-md w-full shadow-xl">
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
        <p className="text-slate-400 text-sm mb-6">
          Esta sección está preparada en la barra lateral y lista para recibir su desarrollo completo.
        </p>
        <span className="inline-block bg-blue-600/20 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/30">
          Próximamente en MV Motos
        </span>
      </div>
    </div>
  );
}