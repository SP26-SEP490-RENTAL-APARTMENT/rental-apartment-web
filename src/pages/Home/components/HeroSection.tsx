import { MapPin, ShieldCheck, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

function HeroSection() {
  const { t } = useTranslation("common");

  return (
    <section className="relative overflow-hidden rounded-b-[40px] bg-linear-to-r from-blue-600 via-blue-700 to-indigo-800">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Blur circles */}
        <div className="absolute top-[-120px] left-[-80px] h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute bottom-[-150px] right-[-100px] h-[420px] w-[420px] rounded-full bg-indigo-300/20 blur-3xl" />

        {/* Apartment image overlay */}
        <img
          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop"
          alt="Apartment"
          className="absolute right-0 top-0 h-full w-[48%] object-cover opacity-10"
        />

        {/* Grid effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-18 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* LEFT */}
          <div>
            {/* Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-4 py-2 text-sm text-blue-50 mb-6 shadow-lg">
              <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
              Premium Apartment Booking
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
              {t("slogan.slogan")}
            </h1>

            {/* Desc */}
            <p className="mt-6 text-lg leading-relaxed text-blue-100 max-w-2xl">
              {t("slogan.description")}
            </p>

            {/* Features */}
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {/* Item */}
              <div className="group rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-5 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/30">
                  <MapPin className="h-6 w-6 text-cyan-200" />
                </div>

                <p className="font-semibold text-white text-sm">
                  {t("slogan.primeLocation")}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-blue-100/80">
                  {t("slogan.locationDescription")}
                </p>
              </div>

              {/* Item */}
              <div className="group rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-5 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-400/20">
                  <Star className="h-6 w-6 fill-yellow-300 text-yellow-300" />
                </div>

                <p className="font-semibold text-white text-sm">
                  {t("slogan.verifiedListings")}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-blue-100/80">
                  {t("slogan.verifiedDescription")}
                </p>
              </div>

              {/* Item */}
              <div className="group rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-5 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/20">
                  <ShieldCheck className="h-6 w-6 text-emerald-300" />
                </div>

                <p className="font-semibold text-white text-sm">
                  {t("slogan.secureBooking")}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-blue-100/80">
                  {t("slogan.secureDescription")}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative hidden lg:flex justify-center">
            <div className="relative w-full max-w-130 h-120">
              {/* Main card */}
              <div className="absolute top-0 left-0 w-85 overflow-hidden rounded-[28px] border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop"
                  alt="Apartment"
                  className="h-105 w-full object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-5">
                  <p className="text-lg font-semibold text-white">
                    Luxury Apartment
                  </p>

                  <p className="text-sm text-blue-100">
                    Ho Chi Minh City, Vietnam
                  </p>
                </div>
              </div>

              {/* Floating small card */}
              <div className="absolute right-0 top-20 w-55 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-4 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop"
                  alt="Interior"
                  className="h-40 w-full rounded-2xl object-cover"
                />

                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />

                    <span className="font-semibold text-white">4.9</span>

                    <span className="text-sm text-blue-100">
                      (2.4k reviews)
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-blue-50">
                    Modern stays with premium comfort
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute bottom-4 left-10 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl px-5 py-4 shadow-xl">
                <p className="text-sm text-blue-100">
                  Trusted by thousands of travelers
                </p>

                <p className="mt-1 text-2xl font-bold text-white">
                  15K+ Bookings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;