import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Users, Baby, RotateCcw, PawPrint } from "lucide-react";
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
  const [date, setDate] = useState<DateRange | undefined>();

  const [filter, setFilter] = useState<FilterValues>({
    maxOccupants: 1,
    maxInfants: 0,
    isPetAllowed: false,
  });

  const handleApply = () => {
    onApply({
      ...filter,
      checkInDate: date?.from?.toISOString(),
      checkOutDate: date?.to?.toISOString(),
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
    <div className="w-full bg-gradient-to-br from-white via-slate-50 to-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
        {/* Date Picker */}
        <div className="space-y-3 lg:col-span-1">
          <label className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 mb-1">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <CalendarIcon className="w-3 h-3 text-white" />
            </div>
            Check-in & Check-out
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-12 justify-start text-left font-medium bg-white/80 backdrop-blur-sm hover:bg-white border-slate-200 border-2 hover:border-blue-300 transition-all duration-200 text-slate-700 shadow-sm"
              >
                <CalendarIcon className="mr-3 h-5 w-5 text-blue-500" />
                <span className="text-sm">
                  {date?.from ? (
                    <>
                      {format(date.from, "dd/MM")} -{" "}
                      {date?.to ? format(date.to, "dd/MM") : "Chọn checkout"}
                    </>
                  ) : (
                    "Chọn ngày"
                  )}
                </span>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0 border-slate-200 shadow-xl rounded-2xl">
              <Calendar
                mode="range"
                numberOfMonths={2}
                selected={date}
                onSelect={setDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Guests Slider */}
        <div className="space-y-3 lg:col-span-1">
          <label className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 mb-1">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Users className="w-3 h-3 text-white" />
            </div>
            Khách
          </label>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-300 transition-colors duration-200 space-y-3 shadow-sm">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500">
                {filter.maxOccupants}
              </span>
              <span className="text-sm text-slate-500 font-medium">người</span>
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
              className="cursor-pointer"
            />
          </div>
        </div>

        {/* Infants Slider */}
        <div className="space-y-3 lg:col-span-1">
          <label className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 mb-1">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
              <Baby className="w-3 h-3 text-white" />
            </div>
            Em bé
          </label>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border-2 border-slate-200 hover:border-pink-300 transition-colors duration-200 space-y-3 shadow-sm">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-pink-500">
                {filter.maxInfants}
              </span>
              <span className="text-sm text-slate-500 font-medium">em</span>
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
              className="cursor-pointer"
            />
          </div>
        </div>

        {/* Pet Toggle */}
        <div className="space-y-3 lg:col-span-1">
          <label className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wide text-slate-600 mb-1">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <PawPrint className="w-3 h-3 text-white" />
            </div>
            Thú cưng
          </label>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-300 transition-colors duration-200 flex items-center justify-center h-12 shadow-sm">
            <div className="flex items-center gap-3">
              <Switch
                checked={filter.isPetAllowed}
                onCheckedChange={(v) =>
                  setFilter({
                    ...filter,
                    isPetAllowed: v,
                  })
                }
                className="data-[state=checked]:bg-amber-500"
              />
              <span className="text-sm font-medium text-slate-600">
                {filter.isPetAllowed ? "Chấp nhận" : "Không"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 lg:col-span-1">
          <Button
            variant="outline"
            className="flex-1 h-12 border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 font-semibold transition-all duration-200 rounded-xl shadow-sm"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button
            className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl active:scale-95"
            onClick={handleApply}
          >
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomeFilterV2;
