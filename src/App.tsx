import React from 'react';
import { FlightForm } from './components/FlightForm';
import { FlightStats } from './components/FlightStats';
import { type FlightData } from './services/api';

function App() {
  const [data, setData] = React.useState<FlightData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [isError, setIsError] = React.useState(false);

  // Initial load to show something (as per screenshot it looks populated)
  // Or maybe wait for user. Let's wait for user or set default.
  // The screenshot shows data, so maybe it loads default or after interaction.
  // We'll set a default state for the demo if user interactions are needed.
  React.useEffect(() => {
    // Optional: Load default data
    handleSearch('Latam', 'GIG', 'GRU', '01/01/2026', '12:00');
  }, []);

  const handleSearch = async (airline: string, origin: string, destination: string, date: string, time: string) => {
    setIsLoading(true);
    setMessage(null);
    setIsError(false);

    if (origin === destination) {
      setIsError(true);
      setMessage('No es permitido: El origen y el destino no pueden ser iguales.');
      setIsLoading(false);
      setData(null); // Optional: clear chart or keep previous? Clearing seems safer for "error"
      return;
    }

    setMessage(`Consultando: Vuelo de ${origin} a ${destination} por ${airline} el ${date} a las ${time}`);

    // Simulate API delay for better UX
    setTimeout(() => {
      // Generate two random numbers summing to 100
      const onTime = Math.floor(Math.random() * 101); // 0 to 100
      const delay = 100 - onTime;

      // Generate random average delay minutes (e.g., 0 to 120 minutes)
      const avgDelay = Math.floor(Math.random() * 121);

      const newData: FlightData = {
        airline: airline,
        onTimePercentage: onTime,
        delayPercentage: delay,
        averageDelayMinutes: avgDelay,
      };

      setData(newData);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0 lg:p-4 font-sans">
      {/* Laptop Frame Mockup (White Container) */}
      {/* Laptop Frame Mockup (White Container) - Responsive adjustments */}
      {/* On mobile: full width/height or simple card. On Desktop: Laptop aspect ratio and borders */}
      <div className="bg-white w-full max-w-5xl lg:aspect-[16/10] min-h-screen lg:min-h-0 h-auto rounded-none lg:rounded-xl shadow-none lg:shadow-2xl overflow-y-auto lg:overflow-hidden flex flex-col relative border-0 lg:border-8 border-gray-200">

        {/* Fake Browser Top Bar - Visible mostly on desktop or keep for style but simplify */}
        <div className="h-8 border-b flex items-center px-4 bg-white shrink-0 sticky top-0 z-10">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border border-gray-400"></div>
            <div className="w-2.5 h-2.5 rounded-full border border-gray-400"></div>
            <div className="w-2.5 h-2.5 rounded-full border border-gray-400"></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 lg:p-12 flex flex-col items-center overflow-y-auto lg:overflow-y-auto">

          <h1 className="text-3xl lg:text-4xl text-black font-medium mb-8 tracking-tight text-center">Revisión de vuelos</h1>

          {/* Feedback Message */}
          {message && (
            <div className={`mb-8 px-6 py-3 rounded text-sm font-medium ${isError ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
              {message}
            </div>
          )}

          <div className="flex flex-col lg:flex-row w-full justify-between items-center lg:items-start px-4 lg:px-16 gap-12 lg:gap-0 pb-8 lg:pb-0">
            {/* Left Column: Form */}
            <div className="w-full lg:w-1/3 flex justify-center lg:block">
              <FlightForm onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Right Column: Chart */}
            <div className="w-full lg:w-1/2 flex justify-center items-center">
              <FlightStats data={data} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
