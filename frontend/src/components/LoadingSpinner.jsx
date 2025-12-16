import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ height = "300px" }) => {
  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: height }}
    >
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );
};

export default LoadingSpinner;
