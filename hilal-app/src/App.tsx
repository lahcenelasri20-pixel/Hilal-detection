import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import {
  Moon,
  MapPin,
  Calendar,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  Navigation,
  Clock,
  Info,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { majorCities, type City } from "@/data/cities";
import {
  calculateMoonAge,
  findNewMoon,
  generateLunarParameters,
  calculateVisibility,
  calculateSunsetTime,
  type Location,
  type VisibilityResult,
} from "@/lib/calculator";

function App() {
  const [, setSelectedCity] = useState<City | null>(null);
  const [cityQuery, setCityQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    visibility: VisibilityResult;
    newMoonDate: Date;
    location: Location;
    moonAge: number;
    sunsetTime: string;
  } | null>(null);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>("");

  // Advanced mode inputs
  const [beta, setBeta] = useState("");
  const [maxBeta, setMaxBeta] = useState("");
  const [phi, setPhi] = useState("");
  const [sinPhi, setSinPhi] = useState("");

  // Refs for GSAP animations
  const headerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const suggestionsDropdownRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const inputsRef = useRef<HTMLDivElement>(null);
  const resultItemsRef = useRef<HTMLDivElement>(null);
  const calculateBtnRef = useRef<HTMLButtonElement>(null);
  const modeToggleRef = useRef<HTMLDivElement>(null);

  // Header entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header image fade in
      gsap.fromTo(
        ".header-bg",
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }
      );

      // Icon animation with pulse
      gsap.fromTo(
        iconRef.current,
        { opacity: 0, y: 30, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" }
      );

      // Icon continuous floating animation
      gsap.to(iconRef.current, {
        y: -8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 1.1,
      });

      // Icon glow pulse
      gsap.to(".icon-glow", {
        scale: 1.2,
        opacity: 0.4,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Heading slide up
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: "power3.out" }
      );

      // Paragraph fade in
      gsap.fromTo(
        paragraphRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.7, ease: "power2.out" }
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  // Form container entrance animation
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.9, ease: "power2.out" }
      );
    }
  }, []);

  // Form card stagger animation
  useEffect(() => {
    if (formCardRef.current && !result) {
      const elements = formCardRef.current.querySelectorAll(".animate-form-item");
      gsap.fromTo(
        elements,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, delay: 1.1, ease: "power2.out" }
      );
    }
  }, [result, advancedMode]);

  // Suggestions dropdown animation
  useEffect(() => {
    if (suggestionsDropdownRef.current) {
      if (showSuggestions && filteredCities.length > 0) {
        gsap.fromTo(
          suggestionsDropdownRef.current,
          { opacity: 0, y: -10, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" }
        );
        
        // Stagger animate suggestion items
        const items = suggestionsDropdownRef.current.querySelectorAll(".suggestion-item");
        gsap.fromTo(
          items,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }
        );
      } else {
        gsap.to(suggestionsDropdownRef.current, {
          opacity: 0,
          y: -10,
          scale: 0.95,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    }
  }, [showSuggestions, cityQuery]);

  // Result animation
  useEffect(() => {
    if (result && resultRef.current) {
      const ctx = gsap.context(() => {
        // Main result card entrance
        gsap.fromTo(
          resultRef.current,
          { opacity: 0, scale: 0.9, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "power3.out" }
        );

        // Result icon bounce
        gsap.fromTo(
          ".result-icon",
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 0.5, delay: 0.3, ease: "back.out(2)" }
        );

        // Result title slide
        gsap.fromTo(
          ".result-title",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, delay: 0.4, ease: "power2.out" }
        );

        // Result items stagger
        if (resultItemsRef.current) {
          const items = resultItemsRef.current.querySelectorAll(".result-item");
          gsap.fromTo(
            items,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, delay: 0.5, ease: "power2.out" }
          );
        }
      }, resultRef);

      return () => ctx.revert();
    }
  }, [result]);

  // Mode toggle animation
  useEffect(() => {
    if (modeToggleRef.current) {
      gsap.fromTo(
        modeToggleRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.2, ease: "power2.out" }
      );
    }
  }, [advancedMode]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Button hover animations
  const handleButtonHover = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.02,
      duration: 0.2,
      ease: "power2.out",
    });
  }, []);

  const handleButtonLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  }, []);

  // Input focus animation
  const handleInputFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.01,
      duration: 0.2,
      ease: "power2.out",
    });
  }, []);

  const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  }, []);

  // Suggestion item hover
  const handleSuggestionHover = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      x: 4,
      duration: 0.2,
      ease: "power2.out",
    });
  }, []);

  const handleSuggestionLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      x: 0,
      duration: 0.2,
      ease: "power2.out",
    });
  }, []);

  // Calculate button click animation
  const handleCalculateClick = useCallback(() => {
    if (calculateBtnRef.current) {
      gsap.to(calculateBtnRef.current, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }
    calculateSimple();
  }, []);

  const filteredCities = cityQuery.length >= 2
    ? majorCities
        .filter(
          (city) =>
            city.name.toLowerCase().includes(cityQuery.toLowerCase()) ||
            city.country.toLowerCase().includes(cityQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setLocation({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
    });
    setCityQuery(`${city.name}, ${city.country}`);
    setShowSuggestions(false);
    setLocationStatus("Location set");
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation not supported");
      return;
    }

    setLocationStatus("Getting location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc: Location = {
          name: "Your Location",
          country: "",
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setLocation(loc);
        setSelectedCity(null);
        setCityQuery("Your Current Location");
        setLocationStatus("Location detected");
      },
      (error) => {
        setLocationStatus("Could not detect location");
        console.error("Location error:", error);
      }
    );
  };

  const calculateSimple = () => {
    if (!location) {
      setLocationStatus("Please enter your city or use location detection");
      return;
    }

    if (!month) {
      setLocationStatus("Please select a month");
      return;
    }

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      try {
        const [year, monthNum] = month.split("-");
        const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);

        const moonAge = calculateMoonAge(date);
        const newMoonDate = findNewMoon(date);
        const params = generateLunarParameters(newMoonDate, location);

        const visibility = calculateVisibility(
          params.beta,
          params.maxBeta,
          params.phi,
          params.sinPhi
        );

        const visibilityDate = new Date(newMoonDate);
        visibilityDate.setDate(visibilityDate.getDate() + 1);
        const sunsetTime = calculateSunsetTime(location.lat, visibilityDate);

        setResult({
          visibility,
          newMoonDate,
          location,
          moonAge,
          sunsetTime,
        });
      } catch (error) {
        console.error("Calculation error:", error);
        setLocationStatus("Error during calculation");
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const calculateAdvanced = () => {
    const b = parseFloat(beta);
    const mb = parseFloat(maxBeta);
    const p = parseFloat(phi);
    const sp = parseFloat(sinPhi);

    if (isNaN(b) || isNaN(mb) || isNaN(p) || isNaN(sp)) {
      setLocationStatus("Please fill in all fields with valid numbers");
      return;
    }

    const visibility = calculateVisibility(b, mb, p, sp);
    const today = new Date();

    setResult({
      visibility,
      newMoonDate: today,
      location: { name: "Custom Location", country: "", lat: 0, lon: 0 },
      moonAge: 15,
      sunsetTime: "18:00",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div ref={headerRef} className="relative w-full h-[320px] sm:h-[380px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="header-bg absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/header-ramadan.jpg')" }}
        />
        {/* Gradient Overlay - from bottom to top */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-8 px-4">
          {/* Styled Icon */}
          <div ref={iconRef} className="relative mb-4">
            <div className="icon-glow absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150" />
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-background/90 backdrop-blur-sm shadow-lg border border-primary/20">
              <Moon className="w-10 h-10 text-primary" strokeWidth={1.5} />
              <Star className="absolute -top-1 -right-1 w-5 h-5 text-primary/60 fill-primary/60" />
            </div>
          </div>
          
          {/* Heading */}
          <h1 ref={headingRef} className="text-3xl sm:text-4xl font-bold text-foreground text-center tracking-tight mb-2">
            When is Ramadan?
          </h1>
          
          {/* Paragraph */}
          <p ref={paragraphRef} className="text-sm sm:text-base text-muted-foreground text-center max-w-md">
            Discover the precise moment when the new crescent moon heralds the beginning of Ramadan in your city
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-6 -mt-4">
        <div
          ref={containerRef}
          className="w-full max-w-md space-y-6"
        >

        {/* Info Badge */}
        <div className="animate-form-item">
          <Badge variant="secondary" className="w-full justify-center py-2 text-xs font-normal">
            <Info className="w-3 h-3 mr-2 flex-shrink-0" />
            Simply enter your city and the month you want to check. We'll calculate everything automatically!
          </Badge>
        </div>

        {/* Main Card */}
        <Card ref={formCardRef}>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg animate-form-item">Moon Visibility Calculator</CardTitle>
            <CardDescription className="animate-form-item">
              {advancedMode
                ? "Enter astronomical parameters manually"
                : "Enter your location and date"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!advancedMode ? (
              <>
                {/* City Input */}
                <div className="space-y-2 animate-form-item" ref={suggestionsRef}>
                  <Label htmlFor="city" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Your City
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="city"
                      placeholder="e.g., Marrakesh, Rabat, Casablanca..."
                      value={cityQuery}
                      onChange={(e) => {
                        setCityQuery(e.target.value);
                        setShowSuggestions(true);
                        if (e.target.value === "") {
                          setSelectedCity(null);
                          setLocation(null);
                          setLocationStatus("");
                        }
                      }}
                      onFocus={(e) => {
                        setShowSuggestions(true);
                        handleInputFocus(e);
                      }}
                      onBlur={handleInputBlur}
                      className="pl-10"
                    />
                    {showSuggestions && filteredCities.length > 0 && (
                      <div 
                        ref={suggestionsDropdownRef}
                        className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg overflow-hidden"
                      >
                        {filteredCities.map((city) => (
                          <button
                            key={`${city.name}-${city.country}`}
                            onClick={() => handleCitySelect(city)}
                            onMouseEnter={handleSuggestionHover}
                            onMouseLeave={handleSuggestionLeave}
                            className="suggestion-item w-full px-4 py-3 text-left hover:bg-muted transition-colors border-b last:border-b-0"
                          >
                            <div className="font-medium text-sm">{city.name}</div>
                            <div className="text-xs text-muted-foreground">{city.country}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 animate-form-item">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={detectLocation}
                      onMouseEnter={handleButtonHover}
                      onMouseLeave={handleButtonLeave}
                      className="text-xs"
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      Use My Location
                    </Button>
                    {locationStatus && (
                      <span className="text-xs text-muted-foreground">
                        {locationStatus}
                      </span>
                    )}
                  </div>
                </div>

                {/* Month Input */}
                <div className="space-y-2 animate-form-item">
                  <Label htmlFor="month" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Month & Year
                  </Label>
                  <Input
                    id="month"
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </div>

                {/* Calculate Button */}
                <Button
                  ref={calculateBtnRef}
                  onClick={handleCalculateClick}
                  disabled={loading}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                  className="w-full animate-form-item"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>Calculate Moon Visibility</>
                  )}
                </Button>
              </>
            ) : (
              <>
                {/* Advanced Mode Inputs */}
                <div ref={inputsRef} className="space-y-3">
                  <div className="space-y-2 animate-form-item">
                    <Label htmlFor="beta">Moon's Declination β (degrees)</Label>
                    <Input
                      id="beta"
                      type="number"
                      step="0.01"
                      placeholder="e.g., -4.48"
                      value={beta}
                      onChange={(e) => setBeta(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>

                  <div className="space-y-2 animate-form-item">
                    <Label htmlFor="maxBeta">Maximum β (degrees)</Label>
                    <Input
                      id="maxBeta"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 5.148"
                      value={maxBeta}
                      onChange={(e) => setMaxBeta(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>

                  <div className="space-y-2 animate-form-item">
                    <Label htmlFor="phi">φ (degrees)</Label>
                    <Input
                      id="phi"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 1.22"
                      value={phi}
                      onChange={(e) => setPhi(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>

                  <div className="space-y-2 animate-form-item">
                    <Label htmlFor="sinPhi">sin φ</Label>
                    <Input
                      id="sinPhi"
                      type="number"
                      step="0.0001"
                      placeholder="e.g., 0.0213"
                      value={sinPhi}
                      onChange={(e) => setSinPhi(e.target.value)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </div>

                  <Button 
                    onClick={calculateAdvanced} 
                    className="w-full animate-form-item"
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonLeave}
                  >
                    Calculate
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div ref={resultRef}>
            <Card
              className={`border-2 ${
                result.visibility.isVisible
                  ? "border-green-500/20 bg-green-50/50 dark:bg-green-950/20"
                  : "border-red-500/20 bg-red-50/50 dark:bg-red-950/20"
              }`}
            >
              <CardContent className="pt-6">
                <div className="text-center space-y-2 mb-6">
                  <div className="result-icon inline-flex items-center justify-center w-12 h-12 rounded-full bg-background shadow-sm mb-2">
                    {result.visibility.isVisible ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <h3 className="result-title text-lg font-semibold">
                    {result.visibility.isVisible
                      ? "Moon Will Be Visible!"
                      : "Moon Not Visible"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      const d = new Date(result.newMoonDate);
                      d.setDate(d.getDate() + 1);
                      return formatDate(d);
                    })()}
                  </p>
                </div>

                <Separator className="my-4" />

                <div ref={resultItemsRef} className="space-y-3">
                  <div className="result-item flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Angular Separation</span>
                    <span className="font-medium">
                      {result.visibility.angularSep.toFixed(2)}°
                    </span>
                  </div>

                  <div className="result-item flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Moon Age</span>
                    <span className="font-medium">
                      {result.moonAge.toFixed(1)} days
                    </span>
                  </div>

                  <div className="result-item flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium text-right">
                      {result.location.name}
                      {result.location.country && `, ${result.location.country}`}
                    </span>
                  </div>

                  <div className="result-item flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Sunset Time
                    </span>
                    <span className="font-medium">{result.sunsetTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mode Toggle */}
        <div ref={modeToggleRef} className="text-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAdvancedMode(!advancedMode)}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {advancedMode ? (
              <>
                <ChevronUp className="w-3 h-3 mr-1" />
                Simple Mode
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3 mr-1" />
                Advanced Mode (for experts)
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  </div>
  );
}

export default App;
