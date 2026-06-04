export type RangePreset =
  | 'last_30_days'
  | 'this_day'
  | 'last_day'
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'this_year'
  | 'last_year';

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

function startOfWeek(d: Date) {
  const day = (d.getDay() + 6) % 7; // shift so Monday = 0
  const m = startOfDay(d);
  m.setDate(m.getDate() - day);
  return m;
}

function endOfWeek(d: Date) {
  const m = startOfWeek(d);
  m.setDate(m.getDate() + 6);
  return endOfDay(m);
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

function startOfYear(d: Date) {
  return new Date(d.getFullYear(), 0, 1);
}

function endOfYear(d: Date) {
  return new Date(d.getFullYear(), 11, 31, 23, 59, 59, 999);
}

function toIso(d: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function applyRangePreset(preset: RangePreset): { from: string; to: string } {
  const now = new Date();

  switch (preset) {
    case 'this_day':
      return { from: toIso(startOfDay(now)), to: toIso(endOfDay(now)) };

    case 'last_day': {
      const prev = new Date(now);
      prev.setDate(prev.getDate() - 1);
      return { from: toIso(startOfDay(prev)), to: toIso(endOfDay(prev)) };
    }

    case 'this_week':
      return { from: toIso(startOfWeek(now)), to: toIso(endOfDay(now)) };

    case 'last_week': {
      const prev = new Date(now);
      prev.setDate(prev.getDate() - 7);
      return { from: toIso(startOfWeek(prev)), to: toIso(endOfWeek(prev)) };
    }

    case 'this_month':
      return { from: toIso(startOfMonth(now)), to: toIso(endOfDay(now)) };

    case 'last_month': {
      const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return { from: toIso(startOfMonth(prev)), to: toIso(endOfMonth(prev)) };
    }

    case 'this_year':
      return { from: toIso(startOfYear(now)), to: toIso(endOfDay(now)) };

    case 'last_year': {
      const prev = new Date(now.getFullYear() - 1, 0, 1);
      return { from: toIso(startOfYear(prev)), to: toIso(endOfYear(prev)) };
    }

    case 'last_30_days':
    default: {
      const prev = new Date(now);
      prev.setDate(prev.getDate() - 29);
      return { from: toIso(startOfDay(prev)), to: toIso(endOfDay(now)) };
    }
  }
}
