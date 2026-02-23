import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RolePage({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Content for {title} will go here.
        </p>
      </CardContent>
    </Card>
  );
}
