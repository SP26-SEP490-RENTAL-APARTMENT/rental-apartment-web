import { Badge } from "@/components/ui/badge";

type BadgeConfig = {
  className: string;
  label: string;
};

export const renderBadge = (
  value: string | null | undefined,
  config: Record<string, BadgeConfig>,
  t: (key: string) => string
) => {
  const item = value ? config[value] : null;

  if (!item) {
    return <Badge variant="secondary">{t("apartment.unknown")}</Badge>;
  }

  return (
    <Badge className={item.className}>
      {t(item.label)}
    </Badge>
  );
};