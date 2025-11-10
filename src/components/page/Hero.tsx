
interface Props { pageTitle: string, pageDescription: string, backgroundImage: string }

export default function PageHero({ pageTitle, pageDescription, backgroundImage } : Props) {
  return (
    <section id="page-hero" className="relative bg-gray-100 bg-cover bg-center py-12"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: '512px' }}
    >
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">{pageTitle}</h1>
          {pageDescription && <p className="text-gray-300">{pageDescription}</p>}
        </div>
      </div>
    </section>
  );
}
