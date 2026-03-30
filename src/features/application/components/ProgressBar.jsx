import { cn } from '../../../utils/cn';

function ProgressBar({ progress }) {
  const isComplete = progress >= 100;
  
  return (
    <div className="w-full bg-gray-50 rounded-full h-1.5 overflow-hidden">
      <div 
        className={cn(
          "h-full transition-all duration-1000 ease-out",
          isComplete 
            ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" 
            : "bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.4)]"
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default ProgressBar;
