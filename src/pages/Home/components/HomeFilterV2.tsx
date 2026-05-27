import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  RotateCcw,
  PawPrint,
  User,
} from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useTranslation } from "react-i18next";

interface FilterValues {
  checkInDate?: string;
  checkOutDate?: string;
  maxOccupants: number;
  maxInfants: number;
  isPetAllowed: boolean;
}

interface Props {
  onApply: (values: any) => void;
}

function HomeFilterV2({ onApply }: Props) {
  const { t } = useTranslation("filter");
  const [date, setDate] = useState<DateRange | undefined>();
  const [filter, setFilter] = useState<FilterValues>({
    maxOccupants: 1,
    maxInfants: 0,
    isPetAllowed: false,
  });
  const filterRef = useRef<HTMLDivElement>(null);
  const [filterWidth, setFilterWidth] = useState(0);

  useEffect(() => {
    if (filterRef.current) {
      setFilterWidth(filterRef.current.offsetWidth);
    }
  }, []);

  const handleApply = () => {
    onApply({
      ...filter,
      checkInDate: date?.from?.toLocaleDateString(),
      checkOutDate: date?.to?.toLocaleDateString(),
    });
  };

  const handleReset = () => {
    setDate(undefined);

    setFilter({
      maxOccupants: 1,
      maxInfants: 0,
      isPetAllowed: false,
    });

    onApply({});
  };

  return (
    <div
      ref={filterRef}
      className="flex items-center bg-white border shadow-xl rounded-full px-3 py-2 w-fit gap-2"
    >
      {/* Date */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="px-5 py-3 rounded-full hover:bg-slate-100 transition text-left min-w-60">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon size={16} className="text-blue-500" />
              <span>Check-in & Check-out</span>
            </div>

            <p className="font-semibold text-sm mt-1">
              {date?.from ? (
                <>
                  {format(date.from, "dd/MM")} -{" "}
                  {date?.to ? format(date.to, "dd/MM") : t("selectDate")}
                </>
              ) : (
                t("selectDate")
              )}
            </p>
          </button>
        </PopoverTrigger>

        <PopoverContent
          style={{ width: filterWidth }}
          className="p-0 rounded-2xl shadow-xl"
          align="start"
        >
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={date}
            onSelect={setDate}
            className="w-full"
            classNames={{
              months: "flex w-full",
              month: "flex-1 w-full",
              table: "w-full",
            }}
          />
        </PopoverContent>
      </Popover>

      <div className="h-10 w-px bg-slate-200" />

      {/* Guests */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="px-5 py-3 rounded-full hover:bg-slate-100 transition min-w-37.5 text-left">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User size={16} className="text-blue-500" />
              <span>{t("maxOccupants")}</span>
            </div>
            <div className="font-semibold">{filter.maxOccupants} {t("person")}</div>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-72 rounded-2xl p-5 space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>{t("adult")} + {t("children")}</span>
              <span>{filter.maxOccupants}</span>
            </div>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[filter.maxOccupants]}
              onValueChange={(v) =>
                setFilter({
                  ...filter,
                  maxOccupants: v[0],
                })
              }
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span>{t("infant")}</span>
              <span>{filter.maxInfants}</span>
            </div>
            <Slider
              min={0}
              max={5}
              step={1}
              value={[filter.maxInfants]}
              onValueChange={(v) =>
                setFilter({
                  ...filter,
                  maxInfants: v[0],
                })
              }
            />
          </div>
        </PopoverContent>
      </Popover>

      <div className="h-10 w-px bg-slate-200" />

      {/* Pet */}
      <div className="px-5 py-3 flex items-center gap-3 rounded-full hover:bg-slate-100 transition">
        <PawPrint size={18} className="text-blue-500" />
        <div>
          <p className="text-sm text-muted-foreground">{t("pet")}</p>
          <p className="text-sm font-medium">
            {filter.isPetAllowed ? t("allowed") : t("notAllowed")}
          </p>
        </div>

        <Switch
          checked={filter.isPetAllowed}
          onCheckedChange={(checked) =>
            setFilter({
              ...filter,
              isPetAllowed: checked,
            })
          }
        />
      </div>

      <div className="h-10 w-px bg-slate-200" />

      {/* Actions */}
      <div className="flex items-center gap-2 pl-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleReset}
        >
          <RotateCcw size={18} />
        </Button>

        <Button
          onClick={handleApply}
          className="rounded-full px-6 h-12 text-base"
        >
          {t("search")}
        </Button>
      </div>
    </div>
  );
}

export default HomeFilterV2;
