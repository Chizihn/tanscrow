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
      <CardHeader className="space-y-1 y text-primary-foreground ">
        <CardTitle className="text-2xl font-bold text-left">{title}</CardTitle>
        <CardDescription className="text-left text-primary-foreground/80">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
}
