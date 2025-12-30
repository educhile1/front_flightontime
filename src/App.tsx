import React from 'react';
import { FlightForm } from './components/FlightForm';
import { FlightStats } from './components/FlightStats';
import { type FlightData } from './services/api';

function App() {
  const [data, setData] = React.useState<FlightData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Initial load to show something (as per screenshot it looks populated)
  // Or maybe wait for user. Let's wait for user or set default.
  // The screenshot shows data, so maybe it loads default or after interaction.
  // We'll set a default state for the demo if user interactions are needed.
  React.useEffect(() => {
    // Optional: Load default data
    handleSearch('Latam', 'GIG', 'GRU', '01/01/2026');
  }, []);

  const handleSearch = async (airline: string, _origin: string, _destination: string, _date: string) => {
    setIsLoading(true);

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      {/* Laptop Frame Mockup (White Container) */}
      <div className="bg-white w-full max-w-5xl aspect-[16/10] rounded-xl shadow-2xl overflow-hidden flex flex-col relative border-8 border-gray-200">

        {/* Fake Browser Top Bar */}
        <div className="h-8 border-b flex items-center px-4 bg-white">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border border-gray-400"></div>
            <div className="w-2.5 h-2.5 rounded-full border border-gray-400"></div>
            <div className="w-2.5 h-2.5 rounded-full border border-gray-400"></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-12 flex flex-col items-center">

          <h1 className="text-4xl text-black font-medium mb-16 tracking-tight">Revisión de vuelos</h1>

          <div className="flex w-full justify-between px-16">
            {/* Left Column: Form */}
            <div className="w-1/3">
              <FlightForm onSearch={handleSearch} isLoading={isLoading} />
            </div>

            {/* Right Column: Chart */}
            <div className="w-1/2 flex justify-center items-center">
              <FlightStats data={data} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
