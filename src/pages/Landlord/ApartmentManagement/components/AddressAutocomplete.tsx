import axios from "axios";
import { useEffect, useState } from "react";

type PhotonFeature = {
  properties: {
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    district?: string;
    county?: string;
  };
  geometry: {
    coordinates: [number, number]; // [lng, lat]
  };
};

type Props = {
  value?: string;
  onSelect: (data: {
    address: string;
    city: string;
    district: string;
    lat: number;
    lng: number;
  }) => void;
};

export default function AddressAutocomplete({ onSelect, value }: Props) {
  const [inputValue, setInputValue] = useState<string>("");
  const [results, setResults] = useState<PhotonFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Sync inputValue with value prop when it changes from parent
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const search = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("https://photon.komoot.io/api", {
        params: {
          q: searchQuery,
          limit: 5,
          lang: "en",
        },
      });

      setResults(res.data.features || []);
      setShowResults(true);
    } catch (err) {
      console.error("Photon API error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search based on inputValue changes (when user types)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputValue.length >= 3) {
        search(inputValue);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  const parseAddress = (item: PhotonFeature) => {
    const p = item.properties;

    const city = p.city || p.state || "";

    let district = p.district || p.county || "";

    // normalize English → Vietnamese
    district = district
      ?.replace("District", "Quận")
      ?.replace("district", "Quận");

    const addressParts = [p.name, p.street, district, city].filter(Boolean);

    return {
      address: addressParts.join(", "),
      city,
      district,
      lat: item.geometry.coordinates[1],
      lng: item.geometry.coordinates[0],
    };
  };

  const handleResultClick = (data: ReturnType<typeof parseAddress>) => {
    setInputValue(data.address);
    setResults([]);
    setShowResults(false);
    onSelect(data);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => results.length > 0 && setShowResults(true)}
        onBlur={() => {
          setShowResults(false);
        }}
        placeholder="Enter your address..."
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* Loading indicator */}
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="text-xs text-gray-500">Searching...</div>
        </div>
      )}

      {/* Results dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-y-auto">
          {results.map((item, index) => {
            const data = parseAddress(item);
            return (
              <div
                key={index}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleResultClick(parseAddress(item));
                }}
              >
                <div className="text-sm font-medium text-gray-900">
                  {data.address}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {data.city} {data.district && `• ${data.district}`}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No results message */}
      {!loading &&
        showResults &&
        inputValue.length >= 3 &&
        results.length === 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
            <p className="text-sm text-gray-500 text-center">
              No data found
            </p>
          </div>
        )}
    </div>
  );
}
