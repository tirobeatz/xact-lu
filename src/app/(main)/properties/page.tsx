"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

// Temporary mock data
const mockProperties = [
  {
    id: "1",
    title: "Cozy Family Home",
    slug: "cozy-family-home-strassen",
    location: "Strassen",
    price: 685000,
    type: "HOUSE",
    listingType: "SALE",
    beds: 3,
    baths: 2,
    area: 145,
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop",
    tag: "Popular",
  },
  {
    id: "2",
    title: "Bright City Apartment",
    slug: "bright-city-apartment-bonnevoie",
    location: "Bonnevoie",
    price: 425000,
    type: "APARTMENT",
    listingType: "SALE",
    beds: 2,
    baths: 1,
    area: 78,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop",
    tag: "New",
  },
  {
    id: "3",
    title: "Modern Townhouse",
    slug: "modern-townhouse-esch",
    location: "Esch-sur-Alzette",
    price: 520000,
    type: "HOUSE",
    listingType: "SALE",
    beds: 4,
    baths: 2,
    area: 165,
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2070&auto=format&fit=crop",
    tag: "Great Value",
  },
  {
    id: "4",
    title: "Luxury Penthouse",
    slug: "luxury-penthouse-kirchberg",
    location: "Kirchberg",
    price: 1250000,
    type: "PENTHOUSE",
    listingType: "SALE",
    beds: 3,
    baths: 2,
    area: 195,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    tag: "Premium",
  },
  {
    id: "5",
    title: "Studio in City Center",
    slug: "studio-city-center",
    location: "Luxembourg City",
    price: 1200,
    type: "STUDIO",
    listingType: "RENT",
    beds: 1,
    baths: 1,
    area: 35,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop",
    tag: "Rental",
  },
  {
    id: "6",
    title: "Spacious Family Villa",
    slug: "spacious-family-villa-bertrange",
    location: "Bertrange",
    price: 1450000,
    type: "VILLA",
    listingType: "SALE",
    beds: 5,
    baths: 3,
    area: 320,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop",
    tag: "Featured",
  },
  {
    id: "7",
    title: "Modern Office Space",
    slug: "modern-office-gasperich",
    location: "Gasperich",
    price: 3500,
    type: "OFFICE",
    listingType: "RENT",
    beds: 0,
    baths: 2,
    area: 150,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    tag: "Commercial",
  },
  {
    id: "8",
    title: "Charming Duplex",
    slug: "charming-duplex-limpertsberg",
    location: "Limpertsberg",
    price: 780000,
    type: "DUPLEX",
    listingType: "SALE",
    beds: 3,
    baths: 2,
    area: 135,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    tag: "New",
  },
  {
    id: "9",
    title: "Garden Apartment",
    slug: "garden-apartment-merl",
    location: "Merl",
    price: 595000,
    type: "APARTMENT",
    listingType: "SALE",
    beds: 2,
    baths: 1,
    area: 92,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
    tag: "Garden",
  },
]

const propertyTypes = ["All", "Apartment", "House", "Villa", "Penthouse", "Studio", "Duplex", "Office"]

const locations = [...new Set([
  "All",
  // Luxembourg City Districts
  "Beggen", "Belair", "Bonnevoie-Nord", "Bonnevoie-Sud", "Cents", "Cessange", "Clausen", "Dommeldange", "Eich", "Gare", "Gasperich", "Grund", "Hamm", "Hollerich", "Kirchberg", "Limpertsberg", "Merl", "Mühlenbach", "Neudorf", "Pfaffenthal", "Pulvermühl", "Rollingergrund", "Ville Haute", "Weimerskirch", "Weimershof",
  // Canton Capellen
  "Capellen", "Clemency", "Dippach", "Garnich", "Hobscheid", "Kehlen", "Koerich", "Kopstal", "Mamer", "Septfontaines", "Steinfort", "Bascharage", "Fingig", "Goeblange", "Grass", "Greisch", "Hivange", "Holzem", "Kahler", "Keispelt", "Kleinbettingen", "Linger", "Meispelt", "Nospelt", "Olm", "Roodt", "Schouweiler", "Simmern",
  // Canton Esch-sur-Alzette
  "Belvaux", "Bergem", "Bettembourg", "Differdange", "Dudelange", "Esch-sur-Alzette", "Frisange", "Kayl", "Leudelange", "Mondercange", "Pétange", "Reckange-sur-Mess", "Roeser", "Rumelange", "Sanem", "Schifflange", "Abweiler", "Aspelt", "Bivange", "Burange", "Crauthem", "Fennange", "Foetz", "Hellange", "Huncherange", "Kockelscheuer", "Lamadelaine", "Livange", "Mondorf-les-Bains", "Niederkorn", "Noertzange", "Oberkorn", "Peppange", "Pontpierre", "Rodange", "Soleuvre", "Tétange", "Wickrange",
  // Canton Grevenmacher
  "Betzdorf", "Biwer", "Flaxweiler", "Grevenmacher", "Junglinster", "Manternach", "Mertert", "Wormeldange", "Ahn", "Berg", "Berbourg", "Boudler", "Boudlerbach", "Bourglinster", "Breinert", "Brouch", "Canach", "Ehnen", "Eisenborn", "Eschweiler", "Gonderange", "Godbrange", "Gostingen", "Hagelsdorf", "Imbringen", "Lellig", "Machtum", "Mensdorf", "Munschecker", "Niederdonven", "Oberdonven", "Oetrange", "Potaschberg", "Rodenbourg", "Roodt-sur-Syre", "Wasserbillig", "Wecker", "Weydig",
  // Canton Luxembourg
  "Bertrange", "Contern", "Hesperange", "Luxembourg", "Niederanven", "Sandweiler", "Schuttrange", "Steinsel", "Strassen", "Walferdange", "Weiler-la-Tour", "Alzingen", "Bereldange", "Ernster", "Fentange", "Findel", "Hostert", "Howald", "Itzig", "Moutfort", "Müllendorf", "Munsbach", "Neuhäusgen", "Oberanven", "Rameldange", "Schrassig", "Senningen", "Senningerberg", "Syren", "Uebersyren", "Waldhof",
  // Canton Mersch
  "Bissen", "Boevange-sur-Attert", "Colmar-Berg", "Fischbach", "Heffingen", "Larochette", "Lintgen", "Lorentzweiler", "Mersch", "Nommern", "Tuntange", "Angelsberg", "Blaschette", "Bofferdange", "Buschdorf", "Essingen", "Gosseldange", "Grevenknapp", "Hunsdorf", "Marienthal", "Moesdorf", "Pettingen", "Prettingen", "Reckange", "Reuland", "Rollingen", "Schoenfels", "Schrondweiler", "Stegen",
  // Canton Clervaux
  "Clervaux", "Consthum", "Heinerscheid", "Hosingen", "Kiischpelt", "Munshausen", "Parc Hosingen", "Troisvierges", "Weiswampach", "Wincrange", "Antoniushaff", "Asselborn", "Binsfeld", "Boevange", "Brachtenbach", "Breidfeld", "Bockholtz", "Boxhorn", "Cinqfontaines", "Derenbach", "Dorscheid", "Drinklange", "Eisenbach", "Grindhausen", "Hachiville", "Hamiville", "Hautbellain", "Huldange", "Kalborn", "Leithum", "Lieler", "Marnach", "Mecher", "Neidhausen", "Reuler", "Roder", "Rodershausen", "Rumlange", "Sassel", "Siebenaler", "Stockem", "Stolzembourg", "Urspelt", "Wahlhausen", "Weicherdange", "Weiler", "Wemperhardt", "Wilwerdange",
  // Canton Diekirch
  "Bettendorf", "Bourscheid", "Diekirch", "Ermsdorf", "Erpeldange-sur-Sûre", "Ettelbruck", "Feulen", "Mertzig", "Reisdorf", "Schieren", "Vallée de l'Ernz", "Bastendorf", "Beaufort", "Bigelbach", "Brandenburg", "Burden", "Eppeldorf", "Gilsdorf", "Gralingen", "Haller", "Hoesdorf", "Ingeldorf", "Landscheid", "Lipperscheid", "Longsdorf", "Medernach", "Michelau", "Moestroff", "Niederfeulen", "Oberfeulen", "Warken",
  // Canton Echternach
  "Bech", "Berdorf", "Consdorf", "Echternach", "Mompach", "Rosport-Mompach", "Waldbillig", "Altrier", "Bollendorf-Pont", "Born", "Breidweiler", "Christnach", "Dickweiler", "Dillingen", "Geyershof", "Givenich", "Girst", "Grundhof", "Halsdorf", "Herborn", "Hinkel", "Moersdorf", "Mullerthal", "Osweiler", "Rippig", "Rosport", "Scheidgen", "Steinheim", "Weilerbach", "Zittig",
  // Canton Redange
  "Beckerich", "Ell", "Grosbous", "Préizerdaul", "Rambrouch", "Redange-sur-Attert", "Saeul", "Useldange", "Vichten", "Wahl", "Arsdorf", "Bigonville", "Boulaide", "Buschrodt", "Colpach-Bas", "Colpach-Haut", "Ehner", "Elvange", "Everlange", "Folschette", "Grummelscheid", "Holtz", "Hovelange", "Huttange", "Kapweiler", "Koetschette", "Levelange", "Martelange", "Nagem", "Niederpallen", "Noerdange", "Oberpallen", "Ospern", "Perle", "Petit-Nobressart", "Platen", "Perlé", "Pratz", "Reimberg", "Rippweiler", "Schandel", "Schwebach", "Wolwelange",
  // Canton Remich
  "Bous", "Burmerange", "Dalheim", "Lenningen", "Remich", "Schengen", "Stadtbredimus", "Waldbredimus", "Wellenstein", "Assel", "Bech-Kleinmacher", "Ellange", "Emerange", "Filsdorf", "Greiveldange", "Remerschen", "Rolling", "Schwebsange", "Trintange", "Wintrange",
  // Canton Vianden
  "Vianden", "Putscheid", "Tandel", "Bivels", "Fouhren", "Nachtmanderscheid", "Walsdorf",
  // Canton Wiltz
  "Esch-sur-Sûre", "Goesdorf", "Lac de la Haute-Sûre", "Wiltz", "Winseler", "Alscheid", "Bavigne", "Berlé", "Bonnal", "Buderscheid", "Dahl", "Doncols", "Enscherange", "Eschdorf", "Harlange", "Heiderscheid", "Kaundorf", "Kautenbach", "Liefrange", "Lultzhausen", "Merkholtz", "Nothum", "Nocher", "Pommerloch", "Roullingen", "Schleif", "Selscheid", "Surré", "Tarchamps", "Watrange"
])].sort((a, b) => {
  if (a === "All") return -1
  if (b === "All") return 1
  return a.localeCompare(b)
})

const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function PropertiesPage() {
  const [listingType, setListingType] = useState<"ALL" | "SALE" | "RENT">("ALL")
  const [propertyType, setPropertyType] = useState("All")
  const [location, setLocation] = useState("All")
  const [priceRange, setPriceRange] = useState(2000000)
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  // Filter properties
  const filteredProperties = mockProperties.filter((property) => {
    if (listingType !== "ALL" && property.listingType !== listingType) return false
    if (propertyType !== "All" && property.type !== propertyType.toUpperCase()) return false
    if (location !== "All" && property.location !== location) return false
    if (property.price > priceRange) return false
    return true
  })

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      default:
        return 0
    }
  })

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[#1A1A1A] pt-32 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#B8926A]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B8926A]/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <h1 className="text-4xl md:text-5xl font-semibold text-white">
              Find Your Property
            </h1>
            <p className="text-white/60 mt-3 text-lg">
              {sortedProperties.length} properties available in Luxembourg
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-white rounded-2xl p-2 shadow-2xl"
          >
            <div className="flex flex-wrap gap-2">
              {/* Listing Type Tabs */}
              <div className="flex bg-[#F5F3EF] rounded-xl p-1">
                {[
                  { key: "ALL", label: "All" },
                  { key: "SALE", label: "Buy" },
                  { key: "RENT", label: "Rent" },
                ].map((type) => (
                  <button
                    key={type.key}
                    onClick={() => setListingType(type.key as any)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      listingType === type.key
                        ? "bg-[#1A1A1A] text-white shadow-md"
                        : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Property Type */}
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="flex-1 min-w-[150px] h-11 px-4 rounded-xl bg-[#F5F3EF] text-[#1A1A1A] text-sm outline-none cursor-pointer"
              >
                <option value="All">All Types</option>
                {propertyTypes.slice(1).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {/* Location */}
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 min-w-[150px] h-11 px-4 rounded-xl bg-[#F5F3EF] text-[#1A1A1A] text-sm outline-none cursor-pointer"
              >
                <option value="All">All Locations</option>
                {locations.slice(1).map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>

              {/* More Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="h-11 px-5 rounded-xl bg-[#F5F3EF] text-[#1A1A1A] text-sm font-medium flex items-center gap-2 hover:bg-[#E8E6E3] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Filters
              </button>

              {/* Search Button */}
              <Button className="h-11 px-8 bg-[#B8926A] hover:bg-[#A6825C] text-white rounded-xl">
                Search
              </Button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mt-4 pt-4 border-t border-[#E8E6E3]"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Max Price: €{formatNumber(priceRange)}
                    </label>
                    <input
                      type="range"
                      min="100000"
                      max="3000000"
                      step="50000"
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full h-2 bg-[#E8E6E3] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#B8926A] [&::-webkit-slider-thumb]:rounded-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-[#E8E6E3] bg-white text-[#1A1A1A] text-sm outline-none"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      className="w-full h-11 rounded-xl border-[#E8E6E3]"
                      onClick={() => {
                        setListingType("ALL")
                        setPropertyType("All")
                        setLocation("All")
                        setPriceRange(2000000)
                        setSortBy("newest")
                      }}
                    >
                      Reset All
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-[#6B6B6B]">
              Showing <span className="font-semibold text-[#1A1A1A]">{sortedProperties.length}</span> properties
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-4 rounded-lg border border-[#E8E6E3] bg-white text-[#1A1A1A] text-sm outline-none md:hidden"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price ↑</option>
              <option value="price-high">Price ↓</option>
            </select>
          </div>

          {/* Properties */}
          {sortedProperties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8E6E3] p-16 text-center">
              <div className="w-16 h-16 bg-[#F5F3EF] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">No properties found</h3>
              <p className="text-[#6B6B6B] mb-6">Try adjusting your filters to see more results.</p>
              <Button
                onClick={() => {
                  setListingType("ALL")
                  setPropertyType("All")
                  setLocation("All")
                  setPriceRange(2000000)
                }}
                className="rounded-xl bg-[#1A1A1A]"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/properties/${property.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${property.image}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      
                      {/* Tags */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          property.listingType === "RENT"
                            ? "bg-blue-500 text-white"
                            : "bg-[#B8926A] text-white"
                        }`}>
                          For {property.listingType === "RENT" ? "Rent" : "Sale"}
                        </span>
                      </div>

                      {/* Favorite Button */}
                      <button className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <svg className="w-5 h-5 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>

                      {/* Price */}
                      <div className="absolute bottom-4 left-4">
                        <p className="text-2xl font-bold text-white">
                          €{formatNumber(property.price)}
                          {property.listingType === "RENT" && (
                            <span className="text-sm font-normal opacity-80">/mo</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-[#1A1A1A] group-hover:text-[#B8926A] transition-colors line-clamp-1">
                            {property.title}
                          </h3>
                          <p className="text-sm text-[#6B6B6B] mt-1 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {property.location}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-[#F5F3EF] rounded-md text-xs text-[#6B6B6B]">
                          {property.tag}
                        </span>
                      </div>

                      {/* Features */}
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#E8E6E3]">
                        {property.beds > 0 && (
                          <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            {property.beds} bed
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          </svg>
                          {property.baths} bath
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          {property.area} m²
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Load More */}
          {sortedProperties.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" className="h-12 px-8 rounded-xl border-[#E8E6E3] hover:bg-[#F5F3EF]">
                Load More Properties
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}