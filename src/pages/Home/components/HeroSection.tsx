import { MapPin, Shield, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

function HeroSection() {
  const { t } = useTranslation("common");
  return (
    <div className="bg-linear-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-16 sm:py-20 rounded-bl-4xl rounded-br-4xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
            {t("slogan.slogan")}
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
            {t("slogan.description")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center gap-3 bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
            <MapPin className="h-10 w-10 shrink-0 fill-yellow-500" />
            <div>
              <p className="font-semibold text-black">
                {t("slogan.primeLocation")}
              </p>
              <p className="text-sm text-blue-500">
                {t("slogan.locationDescription")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
            <Star className="h-10 w-10 shrink-0 fill-orange-500" />
            <div>
              <p className="font-semibold text-black">
                {t("slogan.verifiedListings")}
              </p>
              <p className="text-sm text-blue-500">
                {t("slogan.verifiedDescription")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white bg-opacity-10 backdrop-blur rounded-lg p-4">
            <Shield className="h-10 w-10 shrink-0 fill-blue-500" />
            <div>
              <p className="font-semibold text-black">
                {t("slogan.secureBooking")}
              </p>
              <p className="text-sm text-blue-500">
                {t("slogan.secureDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
