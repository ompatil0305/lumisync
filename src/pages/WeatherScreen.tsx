import { useNavigate } from 'react-router';
import { useWeather, useUniversityInfo } from '../hooks/useUniversity';
import {
  ArrowLeft, Sun, Cloud, CloudRain, CloudLightning, CloudSnow,
  CloudDrizzle, CloudFog, Wind, Droplets, Eye, Thermometer,
  Sunrise, Sunset, Navigation, Gauge
} from 'lucide-react';
import { motion } from 'framer-motion';

function WeatherIcon({ icon, size = 24 }: { icon: string; size?: number }) {
  const props = { size, className: 'shrink-0' };
  switch (icon) {
    case 'sun': return <Sun {...props} className="text-amber-500" />;
    case 'sun-dim': return <Sun {...props} className="text-amber-400" />;
    case 'cloud-sun': return <Cloud {...props} className="text-amber-400" />;
    case 'cloud': return <Cloud {...props} className="text-gray-400" />;
    case 'cloud-fog': return <CloudFog {...props} className="text-gray-400" />;
    case 'cloud-drizzle': return <CloudDrizzle {...props} className="text-blue-400" />;
    case 'cloud-rain': return <CloudRain {...props} className="text-blue-500" />;
    case 'snowflake': return <CloudSnow {...props} className="text-blue-300" />;
    case 'cloud-lightning': return <CloudLightning {...props} className="text-purple-500" />;
    case 'moon': return <Sun {...props} className="text-indigo-300" />;
    default: return <Sun {...props} className="text-amber-500" />;
  }
}

export default function WeatherScreen() {
  const navigate = useNavigate();
  const info = useUniversityInfo();
  const { data: weather, isLoading } = useWeather();

  if (isLoading || !weather) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold">Weather</h1>
            <p className="text-xs text-muted-foreground">{info.location.city}, {info.location.state}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-6">
        {/* Current Weather Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-3xl p-6 border border-primary/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <WeatherIcon icon={weather.current.icon} size={48} />
                <div>
                  <span className="text-5xl font-bold">{weather.current.temp}°</span>
                  <span className="text-lg text-muted-foreground ml-1">F</span>
                </div>
              </div>
              <p className="text-lg font-medium">{weather.current.condition}</p>
              <p className="text-sm text-muted-foreground">
                Feels like {weather.current.feelsLike}°
              </p>
              {weather.dataSource === 'live' ? (
                <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Live Data
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                  Demo Data
                </span>
              )}
            </div>
            <div className="text-right space-y-2">
              <div className="text-xs text-muted-foreground">
                H: {weather.daily[0]?.high}° L: {weather.daily[0]?.low}°
              </div>
            </div>
          </div>
        </motion.div>

        {/* Weather Details Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-base font-semibold mb-3">Current Details</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Droplets, label: 'Humidity', value: `${weather.current.humidity}%`, color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: Wind, label: 'Wind', value: `${weather.current.windSpeed} mph`, color: 'text-teal-500', bg: 'bg-teal-50' },
              { icon: Eye, label: 'UV Index', value: `${weather.current.uvIndex}`, color: 'text-purple-500', bg: 'bg-purple-50' },
              { icon: Gauge, label: 'Pressure', value: `${weather.current.pressure} hPa`, color: 'text-gray-500', bg: 'bg-gray-50' },
              { icon: Navigation, label: 'Visibility', value: `${weather.current.visibility} km`, color: 'text-indigo-500', bg: 'bg-indigo-50' },
              { icon: Thermometer, label: 'Feels Like', value: `${weather.current.feelsLike}°F`, color: 'text-orange-500', bg: 'bg-orange-50' },
            ].map((detail) => (
              <div key={detail.label} className="bg-card border border-border rounded-xl p-4">
                <div className={`w-8 h-8 ${detail.bg} rounded-lg flex items-center justify-center mb-2`}>
                  <detail.icon size={16} className={detail.color} />
                </div>
                <p className="text-xs text-muted-foreground">{detail.label}</p>
                <p className="text-lg font-semibold">{detail.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hourly Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-base font-semibold mb-3">Hourly Forecast</h2>
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-1">
              {weather.hourly.map((hour, i) => (
                <div key={i} className="flex flex-col items-center gap-2 min-w-[56px]">
                  <span className="text-[11px] text-muted-foreground">{hour.time}</span>
                  <WeatherIcon icon={hour.icon} size={20} />
                  <span className="text-sm font-medium">{hour.temp}°</span>
                  <div className="flex items-center gap-0.5">
                    <Droplets size={10} className="text-blue-400" />
                    <span className="text-[10px] text-blue-400">{hour.precipitation}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 7-Day Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-base font-semibold mb-3">7-Day Forecast</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {weather.daily.map((day, i) => (
              <div
                key={day.date}
                className={`flex items-center justify-between px-4 py-3 ${
                  i < weather.daily.length - 1 ? 'border-b border-border/50' : ''
                }`}
              >
                <div className="flex items-center gap-3 w-20">
                  <span className="text-sm font-medium">{day.dayName}</span>
                </div>
                <div className="flex items-center gap-2 flex-1 justify-center">
                  <WeatherIcon icon={day.icon} size={20} />
                  <span className="text-xs text-muted-foreground hidden sm:inline">{day.condition}</span>
                </div>
                <div className="flex items-center gap-1 w-16 justify-end">
                  <Droplets size={12} className="text-blue-400" />
                  <span className="text-xs text-blue-400">{day.precipitation}%</span>
                </div>
                <div className="flex items-center gap-3 w-20 justify-end">
                  <span className="text-sm font-medium">{day.high}°</span>
                  <span className="text-sm text-muted-foreground">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sunrise/Sunset */}
        {weather.daily[0] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-2xl p-4"
          >
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center gap-2">
                <Sunrise size={24} className="text-amber-500" />
                <span className="text-xs text-muted-foreground">Sunrise</span>
                <span className="text-sm font-medium">{weather.daily[0].sunrise}</span>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="flex flex-col items-center gap-2">
                <Sunset size={24} className="text-orange-500" />
                <span className="text-xs text-muted-foreground">Sunset</span>
                <span className="text-sm font-medium">{weather.daily[0].sunset}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Data Source */}
        <div className="text-center pb-4">
          <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider">
            {weather.dataSource === 'live' ? 'Live Weather Data via Open-Meteo API' : 'Demo Weather Data'}
          </span>
        </div>
      </div>
    </div>
  );
}
