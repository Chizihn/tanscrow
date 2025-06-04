// components/AuthCard.jsx
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

interface Props {
  children: React.ReactNode;
  title?: string;
  description?: string;
  classname?: string;
}

export function AuthCard({ children, title, description, classname }: Props) {
  return (
    <Card className={`w-full p-0 ${classname}`}>
      <CardHeader className="space-y-1 ">
        <CardTitle className="text-2xl font-bold text-left">{title}</CardTitle>
        <CardDescription className="text-left ">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 lg:p-4">{children}</CardContent>
    </Card>
  );
}
