import { useTranslation } from 'react-i18next';
import { Link } from './Link';

export function Hero() {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen flex items-center justify-center text-white">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute min-w-full min-h-full object-cover"
        >
          <source src="/videos/header_video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Content */}
      <div className="relative z-10 text-center px-8 py-10 bg-black bg-opacity-40 backdrop-blur-sm rounded-lg max-w-6xl mx-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-4xl mx-auto">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="#shop"
            className="bg-[#ff9900] hover:bg-[#e68a00] text-white px-8 py-3 rounded-full font-semibold transition-colors"
          >
            {t('hero.shopButton')}
          </Link>
          <Link
            href="#sustainability"
            className="border-2 border-white hover:bg-white hover:text-[#003366] text-white px-8 py-3 rounded-full font-semibold transition-colors"
          >
            {t('hero.learnButton')}
          </Link>
        </div>
      </div>
    </div>
  );
}