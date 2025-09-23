import React, { useEffect, useState, useRef, Component } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
  LayersControl,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import VideoModal from "./VideoModal";
import {
  SearchIcon,
  LayersIcon,
  MapPinIcon,
  BuildingIcon,
  BriefcaseIcon,
  GlobeIcon,
  ShoppingBagIcon,
  HeartIcon,
  MaximizeIcon,
  MinimizeIcon,
  XIcon,
} from "lucide-react";
// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});
// Custom icon factory
const createCustomIcon = (color, IconComponent) => {
  return L.divIcon({
    className: "custom-marker-icon",
    html: `
      <div class="w-8 h-8 flex items-center justify-center rounded-full bg-${color}-100 border-2 border-${color}-500 text-${color}-500 shadow-md">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${
            IconComponent === MapPinIcon
              ? '<circle cx="12" cy="10" r="3"></circle><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"></path>'
              : IconComponent === BuildingIcon
              ? '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path>'
              : IconComponent === BriefcaseIcon
              ? '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>'
              : IconComponent === GlobeIcon
              ? '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>'
              : IconComponent === ShoppingBagIcon
              ? '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>'
              : IconComponent === HeartIcon
              ? '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>'
              : '<circle cx="12" cy="12" r="10"></circle>'
          }
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};
// Custom component for map search
const MapSearch = ({ points, onSelectLocation }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    if (query.length > 1) {
      setIsSearching(true);
      const searchResults = points.filter(
        (point) =>
          point.name.toLowerCase().includes(query.toLowerCase()) ||
          point.description.toLowerCase().includes(query.toLowerCase()) ||
          point.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(searchResults);
      setIsSearching(false);
    } else {
      setResults([]);
    }
  }, [query, points]);
  return (
    <div className="absolute top-4 left-4 z-[2000] w-64 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <input
          type="text"
          placeholder="Search locations..."
          className="w-full py-3 pl-10 pr-4 bg-white border-b border-gray-200 focus:outline-none text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <SearchIcon
          size={16}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
      </div>
      {isSearching && (
        <div className="p-4 text-center">
          <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-primary rounded-full mx-auto"></div>
        </div>
      )}
      {results.length > 0 && (
        <div className="max-h-60 overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={index}
              className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                onSelectLocation(result);
                setQuery("");
                setResults([]);
              }}
            >
              <div className="font-medium text-sm">{result.name}</div>
              <div className="text-xs text-gray-500">{result.category}</div>
            </div>
          ))}
        </div>
      )}
      {query.length > 1 && results.length === 0 && !isSearching && (
        <div className="p-4 text-sm text-gray-500 text-center">
          No locations found
        </div>
      )}
    </div>
  );
};
// Category filter component
const CategoryFilter = ({ categories, activeCategories, onToggleCategory }) => {
  return (
    <div className="absolute bottom-4 left-4 z-[2000] bg-white rounded-lg shadow-lg p-2">
      <div className="flex flex-col space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`flex items-center px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              activeCategories.includes(category.id)
                ? `bg-${category.color}-100 text-${category.color}-700`
                : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => onToggleCategory(category.id)}
          >
            <span className={`mr-2 text-${category.color}-500`}>
              {category.icon}
            </span>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};
// Custom component to add map interactions
const MapInteractions = ({ points, activeCategories, onMapReady }) => {
  const map = useMap();
  useEffect(() => {
    // Add map to ref when ready
    if (onMapReady) {
      onMapReady(map);
    }
    // Fit bounds to include all markers
    if (points.length > 0) {
      const filteredPoints =
        activeCategories.length > 0
          ? points.filter((point) => activeCategories.includes(point.category))
          : points;
      if (filteredPoints.length > 0) {
        const bounds = L.latLngBounds(
          filteredPoints.map((point) => point.position)
        );
        map.fitBounds(bounds, {
          padding: [50, 50],
        });
      }
    }
  }, [map, points, activeCategories, onMapReady]);
  return null;
};
const HeroSection = () => {
  const sectionRef = useRef(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [mapRef, setMapRef] = useState(null);
  const [activeCategories, setActiveCategories] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef(null);
  // Abu Dhabi coordinates and points of interest
  const mainPosition = [24.4539, 54.3773];
  const categoryIcons = {
    government: <BuildingIcon size={16} />,
    business: <BriefcaseIcon size={16} />,
    tourism: <GlobeIcon size={16} />,
    retail: <ShoppingBagIcon size={16} />,
    healthcare: <HeartIcon size={16} />,
    landmark: <MapPinIcon size={16} />,
  };
  const categories = [
    {
      id: "government",
      name: "Government",
      color: "blue",
      icon: categoryIcons.government,
    },
    {
      id: "business",
      name: "Business",
      color: "purple",
      icon: categoryIcons.business,
    },
    {
      id: "tourism",
      name: "Tourism",
      color: "green",
      icon: categoryIcons.tourism,
    },
    {
      id: "retail",
      name: "Retail",
      color: "yellow",
      icon: categoryIcons.retail,
    },
    {
      id: "healthcare",
      name: "Healthcare",
      color: "red",
      icon: categoryIcons.healthcare,
    },
    {
      id: "landmark",
      name: "Landmarks",
      color: "gray",
      icon: categoryIcons.landmark,
    },
  ];
  const mapPoints = [
    {
      position: mainPosition,
      name: "Abu Dhabi",
      description: "The capital of the United Arab Emirates",
      category: "landmark",
      icon: createCustomIcon("gray", MapPinIcon),
    },
    {
      position: [24.4241, 54.4436],
      name: "Yas Island",
      description:
        "Entertainment destination with Ferrari World and Yas Waterworld",
      category: "tourism",
      icon: createCustomIcon("green", GlobeIcon),
    },
    {
      position: [24.5014, 54.357],
      name: "Saadiyat Island",
      description:
        "Cultural district with Louvre Abu Dhabi and upcoming Guggenheim",
      category: "tourism",
      icon: createCustomIcon("green", GlobeIcon),
    },
    {
      position: [24.4813, 54.3576],
      name: "Al Maryah Island",
      description: "Financial district with Abu Dhabi Global Market",
      category: "business",
      icon: createCustomIcon("purple", BriefcaseIcon),
    },
    {
      position: [24.4672, 54.363],
      name: "Abu Dhabi Global Market",
      description: "International Financial Centre",
      category: "business",
      icon: createCustomIcon("purple", BriefcaseIcon),
    },
    {
      position: [24.5246, 54.4311],
      name: "Masdar City",
      description: "Planned sustainable city project",
      category: "business",
      icon: createCustomIcon("purple", BriefcaseIcon),
    },
    {
      position: [24.4821, 54.3606],
      name: "Cleveland Clinic Abu Dhabi",
      description: "Multispecialty hospital",
      category: "healthcare",
      icon: createCustomIcon("red", HeartIcon),
    },
    {
      position: [24.5133, 54.3717],
      name: "Sheikh Zayed Grand Mosque",
      description: "Iconic landmark and cultural site",
      category: "landmark",
      icon: createCustomIcon("gray", MapPinIcon),
    },
    {
      position: [24.4512, 54.3969],
      name: "Yas Mall",
      description: "Premier shopping destination",
      category: "retail",
      icon: createCustomIcon("yellow", ShoppingBagIcon),
    },
    {
      position: [24.4527, 54.3725],
      name: "Abu Dhabi Municipality",
      description: "Government services and administration",
      category: "government",
      icon: createCustomIcon("blue", BuildingIcon),
    },
  ];
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
        }
      },
      {
        threshold: 0.1,
      }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("keydown", handleEscKey);
    // Control body scroll when in fullscreen
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [isFullscreen]);
  const handleExploreClick = () => {
    // Scroll to growth areas section
    const growthAreasSection = document.getElementById("growth-areas");
    if (growthAreasSection) {
      growthAreasSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  const handleDirectoryClick = () => {
    // Scroll to directory section
    const directorySection = document.getElementById("directory");
    if (directorySection) {
      directorySection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  const handleSelectLocation = (location) => {
    if (mapRef) {
      mapRef.setView(location.position, 15);
      // Find marker with matching position and open its popup
      setTimeout(() => {
        const markers = document.querySelectorAll(".leaflet-marker-icon");
        markers.forEach((marker) => {
          if (marker._leaflet_pos) {
            const markerPoint = mapRef.latLngToLayerPoint(location.position);
            if (
              Math.abs(markerPoint.x - marker._leaflet_pos.x) < 20 &&
              Math.abs(markerPoint.y - marker._leaflet_pos.y) < 20
            ) {
              marker.click();
            }
          }
        });
      }, 100);
    }
  };
  const handleToggleCategory = (categoryId) => {
    setActiveCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Give the map a moment to resize after state change
    setTimeout(() => {
      if (mapRef) {
        mapRef.invalidateSize();
        // Re-fit bounds after toggling fullscreen
        const filteredPoints =
          activeCategories.length > 0
            ? mapPoints.filter((point) =>
                activeCategories.includes(point.category)
              )
            : mapPoints;
        if (filteredPoints.length > 0) {
          const bounds = L.latLngBounds(
            filteredPoints.map((point) => point.position)
          );
          mapRef.fitBounds(bounds, {
            padding: [50, 50],
          });
        }
      }
    }, 100);
  };
  const filteredPoints =
    activeCategories.length > 0
      ? mapPoints.filter((point) => activeCategories.includes(point.category))
      : mapPoints;
  // Custom popup content component
  const CustomPopupContent = ({ point }) => {
    const handleViewDetails = () => {
      console.log(`View details for ${point.name}`);
      // This would typically navigate to a details page
    };
    return (
      <div className="font-body p-1">
        <div className="flex items-center mb-2">
          <div
            className={`w-4 h-4 rounded-full bg-${
              point.category === "government"
                ? "blue"
                : point.category === "business"
                ? "purple"
                : point.category === "tourism"
                ? "green"
                : point.category === "retail"
                ? "yellow"
                : point.category === "healthcare"
                ? "red"
                : "gray"
            }-100 flex items-center justify-center mr-2`}
          >
            <div
              className={`w-2 h-2 rounded-full bg-${
                point.category === "government"
                  ? "blue"
                  : point.category === "business"
                  ? "purple"
                  : point.category === "tourism"
                  ? "green"
                  : point.category === "retail"
                  ? "yellow"
                  : point.category === "healthcare"
                  ? "red"
                  : "gray"
              }-500`}
            ></div>
          </div>
          <span className="text-xs uppercase font-medium text-gray-500">
            {point.category}
          </span>
        </div>
        <h3 className="font-bold text-base mb-1">{point.name}</h3>
        <p className="text-sm text-gray-600">{point.description}</p>
        <button
          className="mt-3 text-xs text-primary font-medium hover:underline inline-flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
        >
          View Details
          <svg
            className="w-3 h-3 ml-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    );
  };
  return (
    <section
      id="about"
      ref={sectionRef}
      className="min-h-screen pt-28 pb-20 px-6 md:px-12 flex flex-col justify-center opacity-0 -translate-y-4 transition-all duration-1000"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight mb-8">
              Discover <span className="text-primary">Abu Dhabi</span>
            </h1>
            <p className="font-body text-xl md:text-2xl text-gray-700 mb-10 max-w-xl leading-relaxed">
              A thriving global business hub at the crossroads of East and West,
              offering unparalleled opportunities for growth and innovation.
            </p>
            <div className="flex flex-wrap gap-5">
              <button
                className="px-8 py-4 bg-primary text-white font-body font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
                onClick={handleExploreClick}
              >
                Explore Growth Areas
              </button>
              <button
                className="px-8 py-4 border-2 border-primary text-primary font-body font-medium rounded-lg hover:bg-primary hover:text-white transition-colors"
                onClick={handleDirectoryClick}
              >
                Explore Directory
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <p className="text-4xl font-display font-bold text-primary mb-2">
                  200+
                </p>
                <p className="font-body text-gray-600">Global Companies</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <p className="text-4xl font-display font-bold text-primary mb-2">
                  $400B
                </p>
                <p className="font-body text-gray-600">GDP</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <p className="text-4xl font-display font-bold text-primary mb-2">
                  #1
                </p>
                <p className="font-body text-gray-600">Ease of Business</p>
              </div>
            </div>
          </div>
          {/* Map Container */}
          <div
            ref={mapContainerRef}
            className={`order-1 lg:order-2 relative ${
              isFullscreen
                ? "map-fullscreen"
                : "h-[400px] md:h-[550px] rounded-2xl overflow-hidden shadow-2xl"
            }`}
          >
            {/* Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-[10000] bg-white p-2 rounded-md shadow-md hover:bg-gray-100 transition-colors"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <MinimizeIcon size={20} className="text-gray-700" />
              ) : (
                <MaximizeIcon size={20} className="text-gray-700" />
              )}
            </button>
            {/* Close button only shown in fullscreen mode */}
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-16 z-[10000] bg-white p-2 rounded-md shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Close fullscreen"
              >
                <XIcon size={20} className="text-gray-700" />
              </button>
            )}
            <MapContainer
              center={mainPosition}
              zoom={11}
              style={{
                height: "100%",
                width: "100%",
              }}
              zoomControl={false}
              attributionControl={false}
              className={isFullscreen ? "fullscreen-map" : ""}
            >
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Light">
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Satellite">
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Streets">
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                </LayersControl.BaseLayer>
              </LayersControl>
              <ZoomControl position="topright" />
              {/* Business district highlight */}
              <Circle
                center={[24.4813, 54.3576]}
                radius={1000}
                pathOptions={{
                  fillColor: "#0030E3",
                  fillOpacity: 0.1,
                  color: "#0030E3",
                  weight: 1,
                }}
              />
              {filteredPoints.map((point, index) => (
                <Marker
                  key={index}
                  position={point.position}
                  icon={point.icon}
                  eventHandlers={{
                    click: (e) => {
                      e.target.openPopup();
                    },
                  }}
                >
                  <Popup className="map-popup">
                    <CustomPopupContent point={point} />
                  </Popup>
                </Marker>
              ))}
              <MapInteractions
                points={mapPoints}
                activeCategories={activeCategories}
                onMapReady={setMapRef}
              />
            </MapContainer>
            <MapSearch
              points={mapPoints}
              onSelectLocation={handleSelectLocation}
            />
            <CategoryFilter
              categories={categories}
              activeCategories={activeCategories}
              onToggleCategory={handleToggleCategory}
            />
            <div className="absolute top-4 right-28 z-[2000] bg-white rounded-lg shadow-lg p-2">
              <div className="text-xs text-gray-500 px-2 py-1">
                <span className="font-medium">Business District</span>
              </div>
            </div>
            {/* Fullscreen overlay instructions */}
            {isFullscreen && (
              <div className="absolute bottom-4 right-4 z-[2000] bg-white bg-opacity-90 rounded-lg shadow-lg p-3 max-w-xs">
                <p className="text-xs text-gray-700">
                  <span className="font-medium">Tip:</span> Press ESC key or use
                  the buttons in the top-right to exit fullscreen mode
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoId="dQw4w9WgXcQ" // This is a placeholder - replace with your actual video ID
      />
    </section>
  );
};
export default HeroSection;
