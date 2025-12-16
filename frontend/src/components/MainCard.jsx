import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MainCard = ({ title, children, className = "" }) => {
  return (
    <Card className={`w-full bg-white ${className}`}>
      <CardHeader className="text-xl">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default MainCard;
