"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarCheck,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  GripVertical,
  Info,
  Lock,
  Plus,
  Settings,
  Trash2,
  Users,
  X,
} from "lucide-react";

type SelectionMode = "single" | "multiple";

type CalendarCell = {
  id: string;
  date: Date;
  dayNumber: number;
  shortLabel: string;
  monthShort: string;
  isStartMonth: boolean;
  isMonthBoundary: boolean;
};

type TimeBlock = {
  id: string;
  label: string;
  start: string;
  end: string;
  conflict?: boolean;
  applyToAllSelected?: boolean;
};

type TimelineEvent = {
  id: string;
  label: string;
  title?: string;
  start: string;
  end: string;
  row: "reserved" | "external";
};

type DayEvent = {
  id: string;
  dateId: string;
  title: string;
  location: string;
  time: string;
  start: string;
  end: string;
  status: "normal" | "conflict" | "partial";
  source: "space" | "user" | "external";
};

type ApiReservation = {
  id: string;
  dateId: string;
  title: string;
  location: string;
  start: string;
  end: string;
};

type MockApiJson = {
  spaceReservations: ApiReservation[];
  externalEvents: ApiReservation[];
};

const DAYS_TO_SHOW = 21;

const timelineHours = [
  "00:00",
  "02:00",
  "04:00",
  "06:00",
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
  "23:59",
];

function createMockApiJson(calendarCells: CalendarCell[]): MockApiJson {
  const idAt = (index: number) =>
    calendarCells[index]?.id ?? calendarCells[0]?.id ?? dateToId(new Date());

  return {
    // JSON 1: reservaciones de espacios.
    // En la pantalla de "Sala A", solo se muestran como ocupado las reservaciones de Sala A.
    spaceReservations: [
      {
        id: "space-a-1",
        dateId: idAt(0),
        title: "Reservación de sala",
        location: "Sala A",
        start: "06:30",
        end: "08:00",
      },
      {
        id: "space-a-2",
        dateId: idAt(0),
        title: "Reservación de sala",
        location: "Sala A",
        start: "11:30",
        end: "13:00",
      },
      {
        id: "space-a-3",
        dateId: idAt(0),
        title: "Reservación de sala",
        location: "Sala A",
        start: "17:00",
        end: "21:30",
      },
      {
        id: "space-a-4",
        dateId: idAt(1),
        title: "Reservación de sala",
        location: "Sala A",
        start: "09:00",
        end: "10:30",
      },
      {
        id: "space-a-5",
        dateId: idAt(4),
        title: "Reservación de sala",
        location: "Sala A",
        start: "14:00",
        end: "16:00",
      },
      {
        id: "space-b-1",
        dateId: idAt(0),
        title: "Reservación de sala",
        location: "Sala B",
        start: "09:00",
        end: "10:00",
      },
      {
        id: "space-c-1",
        dateId: idAt(2),
        title: "Reservación de sala",
        location: "Sala C",
        start: "12:00",
        end: "13:00",
      },
    ],

    // JSON 2: eventos externos/importados del usuario.
    // Puede representar Google Calendar, Outlook, clases, llamadas, etc.
    externalEvents: [
      {
        id: "external-1",
        dateId: idAt(0),
        title: "Presentación de proyecto",
        location: "Calendario externo",
        start: "14:00",
        end: "15:30",
      },
      {
        id: "external-2",
        dateId: idAt(0),
        title: "Sesión de seguimiento",
        location: "Calendario externo",
        start: "15:30",
        end: "16:00",
      },
      {
        id: "external-3",
        dateId: idAt(1),
        title: "Llamada con cliente",
        location: "Online",
        start: "11:00",
        end: "11:30",
      },
      {
        id: "external-4",
        dateId: idAt(6),
        title: "Capacitación interna",
        location: "Online",
        start: "18:30",
        end: "19:30",
      },
    ],
  };
}

function wait(ms = 250) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function toTimelineEvent(
  event: ApiReservation,
  row: "reserved" | "external",
): TimelineEvent {
  return {
    id: event.id,
    label: `${event.start} - ${event.end}`,
    title: `${event.title} · ${event.location}`,
    start: event.start,
    end: event.end,
    row,
  };
}

function toDayEvent(
  event: ApiReservation,
  source: DayEvent["source"],
  status: DayEvent["status"],
): DayEvent {
  return {
    id: event.id,
    dateId: event.dateId,
    title: event.title,
    location: event.location,
    time: `${event.start} - ${event.end}`,
    start: event.start,
    end: event.end,
    source,
    status,
  };
}

async function apiGetSpaceReservationsByDay(
  apiJson: MockApiJson,
  dateId: string,
  spaceName: string,
) {
  await wait();
  return apiJson.spaceReservations
    .filter((event) => event.dateId === dateId && event.location === spaceName)
    .map((event) => toTimelineEvent(event, "reserved"));
}

async function apiGetExternalEventsInInterval(
  apiJson: MockApiJson,
  dateIds: string[],
) {
  await wait();
  const dateSet = new Set(dateIds);
  return apiJson.externalEvents
    .filter((event) => dateSet.has(event.dateId))
    .map((event) => toDayEvent(event, "external", "partial"));
}

const initialBlocks: TimeBlock[] = [
  {
    id: "b1",
    label: "Bloque 1",
    start: "08:00 AM",
    end: "09:30 AM",
    conflict: true,
  },
  {
    id: "b2",
    label: "Bloque 2",
    start: "02:00 PM",
    end: "04:00 PM",
    conflict: true,
  },
  { id: "b3", label: "Bloque 3", start: "06:00 PM", end: "07:30 PM" },
];

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function dateToId(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createCalendarCells() {
  const today = startOfDay(new Date());
  const startMonth = today.getMonth();

  return Array.from({ length: DAYS_TO_SHOW }, (_, index) => {
    const date = addDays(today, index);
    const previousDate = index > 0 ? addDays(today, index - 1) : null;
    const isMonthBoundary = previousDate
      ? previousDate.getMonth() !== date.getMonth()
      : true;

    return {
      id: dateToId(date),
      date,
      dayNumber: date.getDate(),
      shortLabel: date
        .toLocaleDateString("es-MX", { weekday: "short", day: "numeric" })
        .replace(".", ""),
      monthShort: date
        .toLocaleDateString("es-MX", { month: "short" })
        .replace(".", ""),
      isStartMonth: date.getMonth() === startMonth,
      isMonthBoundary,
    } satisfies CalendarCell;
  });
}

function timeToPercent(time: string) {
  const [hoursPart, minutesPart] = time.split(":").map(Number);
  const totalMinutes = hoursPart * 60 + minutesPart;
  return (totalMinutes / 1440) * 100;
}

function getDurationPercent(start: string, end: string) {
  return Math.max(timeToPercent(end) - timeToPercent(start), 0);
}

function blockStyle(start: string, end: string) {
  const left = timeToPercent(start);
  const width = Math.max(timeToPercent(end) - left, 3);
  return { left: `${left}%`, width: `${width}%` };
}

function timeValueToMinutes(value: string) {
  const normalizedValue = value.trim();

  if (normalizedValue.includes("AM") || normalizedValue.includes("PM")) {
    const [timePart, period] = normalizedValue.split(" ");
    const [rawHour, minute] = timePart.split(":").map(Number);
    let hour = rawHour;

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return hour * 60 + minute;
  }

  const [hour, minute] = normalizedValue.split(":").map(Number);
  return hour * 60 + minute;
}

function blocksOverlap(firstBlock: TimeBlock, secondBlock: TimeBlock) {
  const firstStart = timeValueToMinutes(firstBlock.start);
  const firstEnd = timeValueToMinutes(firstBlock.end);
  const secondStart = timeValueToMinutes(secondBlock.start);
  const secondEnd = timeValueToMinutes(secondBlock.end);

  return firstStart < secondEnd && secondStart < firstEnd;
}

function hasOverlappingBlocks(blocks: TimeBlock[]) {
  return blocks.some((block, blockIndex) =>
    blocks.some(
      (nextBlock, nextBlockIndex) =>
        blockIndex < nextBlockIndex && blocksOverlap(block, nextBlock),
    ),
  );
}

function blockHasConflict(block: TimeBlock, blocks: TimeBlock[]) {
  return blocks.some(
    (nextBlock) => nextBlock.id !== block.id && blocksOverlap(block, nextBlock),
  );
}

function blockOverlapsTimelineEvent(block: TimeBlock, event: TimelineEvent) {
  const eventAsBlock: TimeBlock = {
    id: event.id,
    label: event.label,
    start: event.start,
    end: event.end,
  };

  return blocksOverlap(block, eventAsBlock);
}

function blockOverlapsApiReservation(block: TimeBlock, event: ApiReservation) {
  const eventAsBlock: TimeBlock = {
    id: event.id,
    label: event.title,
    start: event.start,
    end: event.end,
  };

  return blocksOverlap(block, eventAsBlock);
}

function getOverlapSegments(
  block: TimeBlock,
  blockers: Array<{ start: string; end: string }>,
) {
  const blockStart = timeValueToMinutes(block.start);
  const blockEnd = timeValueToMinutes(block.end);
  const blockDuration = Math.max(blockEnd - blockStart, 1);

  return blockers
    .map((blocker) => {
      const overlapStart = Math.max(
        blockStart,
        timeValueToMinutes(blocker.start),
      );
      const overlapEnd = Math.min(blockEnd, timeValueToMinutes(blocker.end));

      if (overlapStart >= overlapEnd) return null;

      return {
        left: `${((overlapStart - blockStart) / blockDuration) * 100}%`,
        width: `${((overlapEnd - overlapStart) / blockDuration) * 100}%`,
      };
    })
    .filter(Boolean) as Array<{ left: string; width: string }>;
}

function blockOverlapsDayEvent(block: TimeBlock, event: DayEvent) {
  const eventAsBlock: TimeBlock = {
    id: event.id,
    label: event.title,
    start: event.start,
    end: event.end,
  };

  return blocksOverlap(block, eventAsBlock);
}

function pendingBlockHasBlockingConflict({
  block,
  pendingBlocks,
  savedBlocks,
  spaceReservations,
  externalEvents,
}: {
  block: TimeBlock;
  pendingBlocks: TimeBlock[];
  savedBlocks: TimeBlock[];
  spaceReservations: TimelineEvent[];
  externalEvents: DayEvent[];
}) {
  const overlapsAnotherPending = pendingBlocks.some(
    (nextBlock) => nextBlock.id !== block.id && blocksOverlap(block, nextBlock),
  );
  const overlapsSavedBlock = savedBlocks.some((savedBlock) =>
    blocksOverlap(block, savedBlock),
  );
  const overlapsSpaceReservation = spaceReservations.some((reservation) =>
    blockOverlapsTimelineEvent(block, reservation),
  );
  const overlapsExternalEvent = externalEvents.some((event) =>
    blockOverlapsDayEvent(block, event),
  );

  return (
    overlapsAnotherPending ||
    overlapsSavedBlock ||
    overlapsSpaceReservation ||
    overlapsExternalEvent
  );
}

function savedBlockHasPendingConflict(
  block: TimeBlock,
  pendingBlocks: TimeBlock[],
) {
  return pendingBlocks.some((pendingBlock) =>
    blocksOverlap(block, pendingBlock),
  );
}

function uniqueSortedIds(ids: string[]) {
  return Array.from(new Set(ids)).sort((a, b) => a.localeCompare(b));
}

function getRangeIds(
  startId: string,
  endId: string,
  calendarCells: CalendarCell[],
) {
  const startIndex = calendarCells.findIndex((cell) => cell.id === startId);
  const endIndex = calendarCells.findIndex((cell) => cell.id === endId);

  if (startIndex === -1 || endIndex === -1) return [];

  const min = Math.min(startIndex, endIndex);
  const max = Math.max(startIndex, endIndex);

  return calendarCells.slice(min, max + 1).map((cell) => cell.id);
}

function formatShortDateById(id: string) {
  const [year, month, day] = id.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date
    .toLocaleDateString("es-MX", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
    .replaceAll(".", "");
}

function formatDateRanges(ids: string[]) {
  const sortedIds = uniqueSortedIds(ids);
  if (sortedIds.length === 0) return "Sin días seleccionados";

  const ranges: Array<{ start: string; end: string }> = [];
  let start = sortedIds[0];
  let end = sortedIds[0];

  for (let index = 1; index < sortedIds.length; index += 1) {
    const currentId = sortedIds[index];
    const previousDate = new Date(`${end}T00:00:00`);
    const expectedNextId = dateToId(addDays(previousDate, 1));

    if (currentId === expectedNextId) {
      end = currentId;
    } else {
      ranges.push({ start, end });
      start = currentId;
      end = currentId;
    }
  }

  ranges.push({ start, end });

  return ranges
    .map((range) => {
      if (range.start === range.end) return formatShortDateById(range.start);
      return `${formatShortDateById(range.start)} - ${formatShortDateById(range.end)}`;
    })
    .join(", ");
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-md bg-container", className)}>
      {children}
    </section>
  );
}

function ConflictOverlay({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute inset-y-0 rounded-sm border-x border-red-300",
        "bg-[repeating-linear-gradient(135deg,rgba(248,113,113,.24)_0,rgba(248,113,113,.24)_4px,transparent_4px,transparent_8px)]",
        className,
      )}
      style={style}
    />
  );
}

function TimelineAxis() {
  return (
    <div className="relative ml-32 h-7 text-xs font-medium text-slate-500">
      {timelineHours.map((hour, index) => {
        const left = hour === "23:59" ? 100 : timeToPercent(hour);
        const isFirst = index === 0;
        const isLast = index === timelineHours.length - 1;

        return (
          <span
            key={hour}
            className={cn(
              "absolute top-0 whitespace-nowrap",
              isFirst && "translate-x-0 text-left",
              isLast && "-translate-x-full text-right",
              !isFirst && !isLast && "-translate-x-1/2 text-center",
            )}
            style={{ left: `${left}%` }}
          >
            {hour}
          </span>
        );
      })}
    </div>
  );
}

function TimelineBlock({
  event,
  variant,
}: {
  event: TimelineEvent;
  variant: "reserved" | "external";
}) {
  const durationPercent = getDurationPercent(event.start, event.end);
  const isVeryShort = durationPercent < 5;
  const isShort = durationPercent < 7;

  return (
    <div
      title={event.title ?? event.label}
      className={cn(
        "group absolute top-1/2 flex h-8 -translate-y-1/2 items-center justify-center rounded-lg border text-xs font-medium",
        "overflow-hidden whitespace-nowrap",
        isVeryShort ? "px-1" : "px-3",
        variant === "reserved" &&
          "border-slate-300 bg-slate-200 text-slate-700",
        variant === "external" &&
          "border-slate-300 bg-slate-100 text-slate-600",
      )}
      style={blockStyle(event.start, event.end)}
    >
      {isVeryShort ? (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      ) : (
        <span className="block max-w-full truncate">
          {isShort ? event.start : event.label}
        </span>
      )}
    </div>
  );
}

function SelectionBlock({
  block,
  variant = "pending",
  conflictSegments = [],
}: {
  block: TimeBlock;
  variant?: "saved" | "pending";
  conflictSegments?: Array<{ left: string; width: string }>;
}) {
  const start =
    block.start.includes("AM") || block.start.includes("PM")
      ? to24Hour(block.start)
      : block.start;
  const end =
    block.end.includes("AM") || block.end.includes("PM")
      ? to24Hour(block.end)
      : block.end;
  const durationPercent = getDurationPercent(start, end);
  const isShort = durationPercent < 8;

  return (
    <div
      title={`${block.label}: ${block.start} - ${block.end}`}
      className={cn(
        "absolute top-1/2 flex h-10 -translate-y-1/2 items-center justify-center overflow-hidden rounded-lg border-2 px-3 text-xs font-semibold shadow-sm",
        variant === "saved" && "border-slate-400 bg-slate-100 text-slate-700",
        variant === "pending" &&
          "border-violet-600 bg-violet-50/80 text-violet-700",
      )}
      style={blockStyle(start, end)}
    >
      <span
        className={cn(
          "absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 bg-white",
          variant === "saved" ? "border-slate-400" : "border-violet-600",
        )}
      />
      <span className="block max-w-full truncate px-1">
        {isShort
          ? block.start.replace(" AM", "").replace(" PM", "")
          : `${block.start.replace(" AM", "").replace(" PM", "")} - ${block.end.replace(" AM", "").replace(" PM", "")}`}
      </span>
      {conflictSegments.map((segment, index) => (
        <ConflictOverlay
          key={`${block.id}-conflict-${index}`}
          style={{ left: segment.left, width: segment.width }}
        />
      ))}
      <span
        className={cn(
          "absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 bg-white",
          variant === "saved" ? "border-slate-400" : "border-violet-600",
        )}
      />
    </div>
  );
}

function to24Hour(value: string) {
  const [timePart, period] = value.split(" ");
  const [rawHour, minute] = timePart.split(":").map(Number);
  let hour = rawHour;

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function MonthCalendar({
  activeDayId,
  selectionMode,
  selectedDateIds,
  modifiedDateIds,
  conflictDateIds,
  calendarCells,
  onSingleDaySelect,
  onToggleDay,
  onDragRangeSelect,
}: {
  activeDayId: string;
  selectionMode: SelectionMode;
  selectedDateIds: string[];
  modifiedDateIds: string[];
  conflictDateIds: string[];
  calendarCells: CalendarCell[];
  onSingleDaySelect: (dayId: string) => void;
  onToggleDay: (dayId: string) => void;
  onDragRangeSelect: (dateIds: string[]) => void;
}) {
  const [dragStartId, setDragStartId] = useState<string | null>(null);
  const [dragPreviewIds, setDragPreviewIds] = useState<string[]>([]);

  const selectedDatesSet = new Set(selectedDateIds);
  const modifiedDatesSet = new Set(modifiedDateIds);
  const conflictDatesSet = new Set(conflictDateIds);
  const dragPreviewDatesSet = new Set(dragPreviewIds);
  const canDragSelect = selectionMode === "multiple";

  function handlePointerDown(dayId: string) {
    if (selectionMode === "single") {
      onSingleDaySelect(dayId);
      return;
    }

    setDragStartId(dayId);
    setDragPreviewIds([dayId]);
  }

  function handlePointerEnter(dayId: string) {
    if (!canDragSelect || dragStartId === null) return;
    setDragPreviewIds(getRangeIds(dragStartId, dayId, calendarCells));
  }

  function finishDrag() {
    if (dragStartId === null) return;

    if (dragPreviewIds.length <= 1) {
      onToggleDay(dragStartId);
    } else {
      onDragRangeSelect(dragPreviewIds);
    }

    setDragStartId(null);
    setDragPreviewIds([]);
  }

  return (
    <div onPointerUp={finishDrag} onPointerLeave={finishDrag}>
      <div className="mb-4 flex items-center justify-between">
        <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-semibold text-slate-800">
          {calendarCells[0]?.date.toLocaleDateString("es-MX", {
            month: "short",
            day: "numeric",
          })}{" "}
          -{" "}
          {calendarCells[calendarCells.length - 1]?.date.toLocaleDateString(
            "es-MX",
            { month: "short", day: "numeric" },
          )}
        </p>
        <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid select-none grid-cols-7 gap-y-3 text-center text-xs">
        {calendarCells.map((cell) => {
          const isSelected = selectedDatesSet.has(cell.id);
          const isModified = modifiedDatesSet.has(cell.id);
          const hasConflict = conflictDatesSet.has(cell.id);
          const isPreview = dragPreviewDatesSet.has(cell.id);
          const isActive = activeDayId === cell.id;
          const isModifiedAndSelected = isModified && isSelected;
          const isConflictAndSelected = hasConflict && isSelected;

          return (
            <button
              key={cell.id}
              type="button"
              onPointerDown={() => handlePointerDown(cell.id)}
              onPointerEnter={() => handlePointerEnter(cell.id)}
              title={cell.date.toLocaleDateString("es-MX", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
              className={cn(
                "relative mx-auto flex h-10 w-10 flex-col items-center justify-center rounded-md text-xs font-medium transition",
                !cell.isStartMonth &&
                  "bg-slate-50 text-slate-500 ring-1 ring-slate-200",
                cell.isMonthBoundary &&
                  !cell.isStartMonth &&
                  "border-l-4 border-slate-300",
                !isSelected &&
                  !isModified &&
                  !hasConflict &&
                  !isPreview &&
                  "hover:bg-slate-100",
                isSelected &&
                  !isModified &&
                  !hasConflict &&
                  "border border-violet-200 bg-violet-50 text-violet-700",
                isModified &&
                  !isSelected &&
                  !hasConflict &&
                  "bg-violet-600 text-white shadow-sm",
                isModifiedAndSelected &&
                  !hasConflict &&
                  "border-2 border-violet-950 bg-violet-600 text-white shadow-sm ring-4 ring-violet-100",
                hasConflict &&
                  !isConflictAndSelected &&
                  "bg-red-500 text-white shadow-sm ring-2 ring-red-100",
                isConflictAndSelected &&
                  "border-2 border-red-950 bg-red-500 text-white shadow-sm ring-4 ring-red-100",
                isPreview &&
                  !isModified &&
                  !hasConflict &&
                  "border-2 border-violet-600 bg-violet-50 text-violet-700",
                isPreview &&
                  (isModified || hasConflict) &&
                  "ring-4 ring-violet-100",
                isActive &&
                  !isPreview &&
                  "outline outline-2 outline-offset-2 outline-violet-300",
              )}
            >
              <span>{cell.dayNumber}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ReservationSchedulerPage() {
  const calendarCells = useMemo(() => createCalendarCells(), []);
  const defaultDateIds = useMemo(
    () => calendarCells.slice(0, 4).map((cell) => cell.id),
    [calendarCells],
  );

  const [selectionMode, setSelectionMode] = useState<SelectionMode>("multiple");
  const [selectedDateIds, setSelectedDateIds] =
    useState<string[]>(defaultDateIds);
  const [activeDayId, setActiveDayId] = useState(
    defaultDateIds[0] ?? dateToId(new Date()),
  );
  const [dayBlocks, setDayBlocks] = useState<Record<string, TimeBlock[]>>({
    [defaultDateIds[0] ?? dateToId(new Date())]: initialBlocks,
    [defaultDateIds[1] ?? dateToId(addDays(new Date(), 1))]: [
      {
        id: "b1",
        label: "Bloque 1",
        start: "09:00 AM",
        end: "10:30 AM",
        conflict: true,
      },
      { id: "b2", label: "Bloque 2", start: "03:00 PM", end: "04:00 PM" },
    ],
  });
  const [pendingBlocks, setPendingBlocks] = useState<TimeBlock[]>([]);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [showSelectedDays, setShowSelectedDays] = useState(false);
  const [hasAppliedCurrentSelection, setHasAppliedCurrentSelection] =
    useState(false);
  const [spaceReservationsForActiveDay, setSpaceReservationsForActiveDay] =
    useState<TimelineEvent[]>([]);
  const [externalEventsForInterval, setExternalEventsForInterval] = useState<
    DayEvent[]
  >([]);

  const apiJson = useMemo(
    () => createMockApiJson(calendarCells),
    [calendarCells],
  );
  const selectedSpaceName = "Sala A";

  const navigationDateIds = useMemo(
    () => uniqueSortedIds(selectedDateIds),
    [selectedDateIds],
  );

  const modifiedDateIds = useMemo(
    () => uniqueSortedIds(Object.keys(dayBlocks)),
    [dayBlocks],
  );

  const conflictDateIds = useMemo(
    () =>
      uniqueSortedIds(
        Object.entries(dayBlocks)
          .filter(([, blocks]) => hasOverlappingBlocks(blocks))
          .map(([dateId]) => dateId),
      ),
    [dayBlocks],
  );

  const activeBlocks = dayBlocks[activeDayId] ?? [];
  const activeDayHasConflict = hasOverlappingBlocks([
    ...activeBlocks,
    ...pendingBlocks,
  ]);
  const activeDayLabel = formatShortDateById(activeDayId);
  const activeNavigationIndex = Math.max(
    navigationDateIds.findIndex((dateId) => dateId === activeDayId),
    0,
  );
  const selectedDaysSummary = formatDateRanges(selectedDateIds);
  const activeDayExternalEvents = useMemo(
    () =>
      externalEventsForInterval.filter((event) => event.dateId === activeDayId),
    [activeDayId, externalEventsForInterval],
  );

  const userTimelineEventsForActiveDay = useMemo(
    () =>
      activeDayExternalEvents.map((event) =>
        toTimelineEvent(event, "external"),
      ),
    [activeDayExternalEvents],
  );

  const conflictCount = activeDayExternalEvents.filter(
    (event) => event.status !== "normal",
  ).length;
  const visibleEvents = showAllEvents
    ? activeDayExternalEvents
    : activeDayExternalEvents
        .filter((event) => event.status !== "normal")
        .slice(0, 2);

  useEffect(() => {
    let cancelled = false;

    apiGetSpaceReservationsByDay(apiJson, activeDayId, selectedSpaceName).then(
      (events) => {
        if (!cancelled) setSpaceReservationsForActiveDay(events);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [activeDayId, apiJson, selectedSpaceName]);

  useEffect(() => {
    let cancelled = false;
    const intervalDateIds = calendarCells.map((cell) => cell.id);

    apiGetExternalEventsInInterval(apiJson, intervalDateIds).then(
      (externalEvents) => {
        if (cancelled) return;
        setExternalEventsForInterval(externalEvents);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [apiJson, calendarCells]);

  function getAffectedDateIdsForBlock(block: TimeBlock) {
    if (!block.applyToAllSelected) return [activeDayId];
    return selectedDateIds.length > 0 ? selectedDateIds : [activeDayId];
  }

  function goToSelectedDay(direction: "previous" | "next") {
    if (navigationDateIds.length === 0) return;

    const currentIndex = navigationDateIds.includes(activeDayId)
      ? navigationDateIds.findIndex((dateId) => dateId === activeDayId)
      : 0;

    const nextIndex =
      direction === "next"
        ? (currentIndex + 1) % navigationDateIds.length
        : (currentIndex - 1 + navigationDateIds.length) %
          navigationDateIds.length;

    setActiveDayId(navigationDateIds[nextIndex]);
  }

  function handleModeChange(mode: SelectionMode) {
    setSelectionMode(mode);

    if (mode === "single") {
      const nextDayId =
        activeDayId || selectedDateIds[0] || calendarCells[0]?.id;
      setSelectedDateIds([nextDayId]);
      setActiveDayId(nextDayId);
      setHasAppliedCurrentSelection(false);
    }
  }

  function handleSingleDaySelect(dayId: string) {
    setSelectedDateIds([dayId]);
    setActiveDayId(dayId);
    setHasAppliedCurrentSelection(false);
  }

  function handleToggleDay(dayId: string) {
    if (hasAppliedCurrentSelection) {
      setSelectedDateIds([dayId]);
      setActiveDayId(dayId);
      setHasAppliedCurrentSelection(false);
      return;
    }

    setSelectedDateIds((previousDateIds) => {
      const alreadySelected = previousDateIds.includes(dayId);
      const nextDateIds = alreadySelected
        ? previousDateIds.filter((selectedDayId) => selectedDayId !== dayId)
        : [...previousDateIds, dayId];
      return uniqueSortedIds(nextDateIds);
    });

    setActiveDayId(dayId);
  }

  function handleDragRangeSelect(dateIds: string[]) {
    const draggedDateIds = uniqueSortedIds(dateIds);

    setSelectedDateIds((previousDateIds) => {
      const nextDateIds = hasAppliedCurrentSelection
        ? draggedDateIds
        : uniqueSortedIds([...previousDateIds, ...draggedDateIds]);
      return nextDateIds;
    });

    setHasAppliedCurrentSelection(false);
    setActiveDayId(draggedDateIds[0] ?? activeDayId);
  }

  function clearSelection() {
    setSelectedDateIds([]);
    setHasAppliedCurrentSelection(false);
  }

  function updatePendingBlock(
    blockId: string,
    field: "start" | "end",
    value: string,
  ) {
    setPendingBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.id === blockId ? { ...block, [field]: value } : block,
      ),
    );
  }

  function togglePendingBlockScope(blockId: string) {
    setPendingBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.id === blockId
          ? { ...block, applyToAllSelected: !block.applyToAllSelected }
          : block,
      ),
    );
  }

  function deletePendingBlock(blockId: string) {
    setPendingBlocks((currentBlocks) =>
      currentBlocks.filter((block) => block.id !== blockId),
    );
  }

  function addPendingBlock() {
    const nextNumber = pendingBlocks.length + 1;

    setPendingBlocks((currentBlocks) => [
      ...currentBlocks,
      {
        id: `p-${Date.now()}`,
        label: `Nuevo ${nextNumber}`,
        start: "08:00 PM",
        end: "09:00 PM",
        applyToAllSelected: true,
      },
    ]);
  }

  function applyPendingBlocks() {
    if (pendingBlocks.length === 0) return;

    const affectedDateIds = uniqueSortedIds(
      pendingBlocks.flatMap((block) => getAffectedDateIdsForBlock(block)),
    );

    setSelectedDateIds((previousDateIds) =>
      uniqueSortedIds([...previousDateIds, ...affectedDateIds]),
    );
    setHasAppliedCurrentSelection(true);
    setDayBlocks((previousBlocks) => {
      const nextDayBlocks = { ...previousBlocks };

      pendingBlocks.forEach((block, blockIndex) => {
        const dateIdsForBlock = getAffectedDateIdsForBlock(block);

        dateIdsForBlock.forEach((dateId) => {
          const currentBlocksForDate = nextDayBlocks[dateId] ?? [];

          nextDayBlocks[dateId] = [
            ...currentBlocksForDate,
            {
              ...block,
              id: `b-${dateId}-${Date.now()}-${blockIndex}`,
              label: `Bloque ${currentBlocksForDate.length + 1}`,
              applyToAllSelected: undefined,
            },
          ];
        });
      });

      return nextDayBlocks;
    });
    setPendingBlocks([]);
  }

  return (
    <main className="min-h-screen bg-background-page p-4 text-slate-950 sm:p-6 lg:p-8">
      <header className="mb-5 flex items-center justify-between rounded-2xl px-5">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Ajusta tu reservación · {selectedSpaceName}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Revisa disponibilidad, arrastra días y configura múltiples
              horarios.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="space-y-5">
          <Card className="p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-3">
                {navigationDateIds.slice(0, 5).map((dateId) => (
                  <button
                    key={dateId}
                    onClick={() => setActiveDayId(dateId)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition",
                      activeDayId === dateId
                        ? "border-violet-700 bg-violet-700 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                    )}
                  >
                    <CalendarDays className="h-4 w-4" />
                    {formatShortDateById(dateId)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1">
                <button
                  type="button"
                  onClick={() => goToSelectedDay("previous")}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setShowSelectedDays((value) => !value)}
                  className="flex min-w-36 items-center justify-center gap-1 rounded-lg px-2 py-1 text-center hover:bg-slate-50"
                >
                  <span>
                    <span className="block text-xs font-semibold text-slate-800">
                      {activeDayLabel}
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      {navigationDateIds.length > 0
                        ? activeNavigationIndex + 1
                        : 0}{" "}
                      de {navigationDateIds.length} seleccionados
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-slate-400 transition",
                      showSelectedDays && "rotate-180",
                    )}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => goToSelectedDay("next")}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {showSelectedDays && (
              <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Días seleccionados
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowSelectedDays(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Ocultar
                  </button>
                </div>

                <div className="flex max-h-24 flex-wrap gap-2 overflow-y-auto pr-1">
                  {navigationDateIds.map((dateId) => {
                    const isModified = modifiedDateIds.includes(dateId);
                    const hasConflict = conflictDateIds.includes(dateId);
                    const isActive = activeDayId === dateId;

                    return (
                      <button
                        key={dateId}
                        type="button"
                        onClick={() => setActiveDayId(dateId)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                          !isModified &&
                            !hasConflict &&
                            "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100",
                          isModified &&
                            !hasConflict &&
                            "border-violet-600 bg-violet-600 text-white hover:bg-violet-700",
                          hasConflict &&
                            "border-red-600 bg-red-500 text-white hover:bg-red-600",
                          isActive &&
                            "outline outline-2 outline-offset-2 outline-violet-300",
                        )}
                      >
                        {formatShortDateById(dateId)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="overflow-x-auto pb-2">
              <div className="min-w-[880px]">
                <TimelineAxis />

                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                  <div className="grid grid-cols-[128px_1fr] border-b border-slate-200">
                    <div className="flex items-center gap-3 border-r border-slate-200 bg-white px-3 py-5">
                      <Lock className="h-4 w-4" />
                      <p className="text-xs font-semibold leading-tight text-slate-800">
                        Espacio
                        <br />
                        ocupado
                      </p>
                    </div>
                    <div className="relative min-h-[72px] bg-[linear-gradient(to_right,rgba(148,163,184,.18)_1px,transparent_1px)] bg-[length:calc(100%/24)_100%]">
                      {spaceReservationsForActiveDay.map((event) => (
                        <TimelineBlock
                          key={event.id}
                          event={event}
                          variant="reserved"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-[128px_1fr] border-b border-slate-200">
                    <div className="flex items-center gap-3 border-r border-slate-200 bg-white px-3 py-5">
                      <CalendarCheck className="h-4 w-4" />
                      <p className="text-xs font-semibold leading-tight text-violet-700">
                        Selección
                        <br />
                        actual
                      </p>
                    </div>
                    <div className="relative min-h-[72px] bg-[linear-gradient(to_right,rgba(148,163,184,.18)_1px,transparent_1px)] bg-[length:calc(100%/24)_100%]">
                      {activeBlocks.slice(0, 3).map((block) => (
                        <SelectionBlock
                          key={`${activeDayId}-${block.id}`}
                          block={block}
                          variant="saved"
                          conflictSegments={getOverlapSegments(block, [
                            ...pendingBlocks,
                            ...spaceReservationsForActiveDay,
                          ])}
                        />
                      ))}
                      {pendingBlocks.slice(0, 3).map((block) => (
                        <SelectionBlock
                          key={`pending-${block.id}`}
                          block={block}
                          variant="pending"
                          conflictSegments={getOverlapSegments(block, [
                            ...activeBlocks,
                            ...pendingBlocks.filter(
                              (pendingBlock) => pendingBlock.id !== block.id,
                            ),
                            ...spaceReservationsForActiveDay,
                          ])}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-[128px_1fr]">
                    <div className="flex items-center gap-3 border-r border-slate-200 bg-white px-3 py-5">
                      <Users className="h-4 w-4" />
                      <p className="text-xs font-semibold leading-tight text-slate-800">
                        Eventos
                        <br />
                        externos
                      </p>
                    </div>
                    <div className="relative min-h-[72px] bg-[linear-gradient(to_right,rgba(148,163,184,.18)_1px,transparent_1px)] bg-[length:calc(100%/24)_100%]">
                      {userTimelineEventsForActiveDay.map((event) => (
                        <TimelineBlock
                          key={event.id}
                          event={event}
                          variant="external"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-5 border-b border-slate-200 pb-4 text-xs text-slate-600">
              <span className="flex items-center gap-2">
                <span className="h-4 w-7 rounded border border-slate-400 bg-slate-100" />
                Horario guardado
              </span>
              <span className="flex items-center gap-2">
                <span className="h-4 w-7 rounded border border-violet-600 bg-violet-50" />
                Horario a aplicar
              </span>
              <span className="flex items-center gap-2">
                <span className="h-4 w-7 rounded border border-red-300 bg-[repeating-linear-gradient(135deg,rgba(248,113,113,.25)_0,rgba(248,113,113,.25)_4px,transparent_4px,transparent_8px)]" />
                Conflicto
              </span>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-950">
                    Horarios propuestos
                  </h2>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50">
                    <Settings className="h-4 w-4" />
                    Preconfiguración
                  </button>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Los guardados ya existen en el día activo; los nuevos se
                  aplicarán a la selección.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              {activeBlocks.length === 0 && pendingBlocks.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    Este día todavía no tiene horarios guardados.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Agrega un horario para crear bloques en los días
                    seleccionados.
                  </p>
                </div>
              )}

              {activeBlocks.map((block) => {
                const blockConflict =
                  block.conflict ||
                  blockHasConflict(block, [...activeBlocks, ...pendingBlocks]);

                return (
                  <div
                    key={`saved-${block.id}`}
                    className={cn(
                      "grid grid-cols-[32px_36px_minmax(90px,1fr)_minmax(120px,160px)_24px_minmax(120px,160px)_40px] items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 last:border-b-0",
                      blockConflict && "bg-red-50/70",
                    )}
                  >
                    <GripVertical className="h-5 w-5 text-slate-300" />
                    <span
                      className={cn(
                        "h-3 w-3 rounded-full",
                        blockConflict ? "bg-red-500" : "bg-slate-400",
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-700">
                        {block.label}
                      </span>
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                          blockConflict
                            ? "border-red-200 bg-red-100 text-red-700"
                            : "border-slate-200 bg-white text-slate-500",
                        )}
                      >
                        {blockConflict ? "Empalme" : "Guardado"}
                      </span>
                    </div>
                    <div className="h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500">
                      {block.start}
                    </div>
                    <span className="text-center text-slate-400">-</span>
                    <div className="h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-500">
                      {block.end}
                    </div>
                    <span className="text-slate-300">—</span>
                  </div>
                );
              })}

              {pendingBlocks.map((block) => (
                <div
                  key={block.id}
                  className={cn(
                    "grid grid-cols-[32px_36px_minmax(90px,1fr)_minmax(120px,160px)_24px_minmax(120px,160px)_40px] items-center gap-3 border-b border-violet-100 bg-violet-50/40 px-4 py-3 last:border-b-0",
                    blockHasConflict(block, [
                      ...activeBlocks,
                      ...pendingBlocks,
                    ]) && "border-red-200 bg-red-50/80",
                  )}
                >
                  <GripVertical className="h-5 w-5 text-slate-400" />
                  <span
                    className={cn(
                      "h-3 w-3 rounded-full",
                      blockHasConflict(block, [
                        ...activeBlocks,
                        ...pendingBlocks,
                      ])
                        ? "bg-red-500"
                        : "bg-violet-600",
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-violet-700">
                      {block.label}
                    </span>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        blockHasConflict(block, [
                          ...activeBlocks,
                          ...pendingBlocks,
                        ])
                          ? "border-red-200 bg-red-100 text-red-700"
                          : "border-violet-200 bg-white text-violet-700",
                      )}
                    >
                      {blockHasConflict(block, [
                        ...activeBlocks,
                        ...pendingBlocks,
                      ])
                        ? "Empalme"
                        : "Por aplicar"}
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePendingBlockScope(block.id)}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition",
                        block.applyToAllSelected
                          ? "border-violet-300 bg-violet-100 text-violet-700 hover:bg-violet-200"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
                      )}
                      title={
                        block.applyToAllSelected
                          ? "Se aplicará a todos los días seleccionados"
                          : "Se aplicará solo al día activo"
                      }
                    >
                      {block.applyToAllSelected
                        ? "Todos los días"
                        : "Solo este día"}
                    </button>
                  </div>
                  <label className="relative">
                    <input
                      value={block.start}
                      onChange={(event) =>
                        updatePendingBlock(
                          block.id,
                          "start",
                          event.target.value,
                        )
                      }
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                    />
                    <Clock3 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </label>
                  <span className="text-center text-slate-400">-</span>
                  <label className="relative">
                    <input
                      value={block.end}
                      onChange={(event) =>
                        updatePendingBlock(block.id, "end", event.target.value)
                      }
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                    />
                    <Clock3 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  </label>
                  <button
                    onClick={() => deletePendingBlock(block.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addPendingBlock}
              className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-violet-400 px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              <Plus className="h-5 w-5" />
              Agregar horario
            </button>
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-lg font-bold text-slate-950">
              Resumen de cambios
            </h2>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryItem
                  icon={<CalendarDays className="h-6 w-6" />}
                  label={`${selectedDateIds.length} días`}
                  sublabel="seleccionados"
                />
                <SummaryItem
                  icon={<Clock3 className="h-6 w-6" />}
                  label={`${activeBlocks.length}`}
                  sublabel="horarios guardados"
                  accent
                />
                <SummaryItem
                  icon={<CalendarCheck className="h-6 w-6" />}
                  label={`${modifiedDateIds.length}`}
                  sublabel="días con horarios"
                />
                <SummaryItem
                  icon={<AlertTriangle className="h-6 w-6" />}
                  label={`${conflictDateIds.length}`}
                  sublabel="días con empalme"
                  danger
                />
              </div>

              <div className="flex gap-3">
                <button className="rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={applyPendingBlocks}
                  className="rounded-xl bg-violet-700 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  disabled={pendingBlocks.length === 0}
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-5">
          <Card className="p-5">
            <div className="mb-4 grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-50 p-1 text-sm font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => handleModeChange("single")}
                className={cn(
                  "rounded-lg px-3 py-2 transition",
                  selectionMode === "single"
                    ? "bg-violet-700 text-white shadow-sm"
                    : "hover:bg-white",
                )}
              >
                Un día
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("multiple")}
                className={cn(
                  "rounded-lg px-3 py-2 transition",
                  selectionMode === "multiple"
                    ? "bg-violet-700 text-white shadow-sm"
                    : "hover:bg-white",
                )}
              >
                Varios días
              </button>
            </div>

            <MonthCalendar
              activeDayId={activeDayId}
              selectionMode={selectionMode}
              selectedDateIds={selectedDateIds}
              modifiedDateIds={modifiedDateIds}
              conflictDateIds={conflictDateIds}
              calendarCells={calendarCells}
              onSingleDaySelect={handleSingleDaySelect}
              onToggleDay={handleToggleDay}
              onDragRangeSelect={handleDragRangeSelect}
            />

            <div className="mt-5 space-y-3 border-t border-slate-200 pt-4 text-sm">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full border border-violet-200 bg-violet-50" />
                  Seleccionado
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-violet-600" />
                  Con horarios
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-red-500 ring-2 ring-red-100" />
                  Empalme
                </span>
              </div>

              <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                  Selección
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {selectedDaysSummary}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={clearSelection}
                  disabled={selectedDateIds.length === 0}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  <X className="h-3.5 w-3.5" />
                  Limpiar selección
                </button>
                <button
                  type="button"
                  onClick={() => setShowSelectedDays((value) => !value)}
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition",
                      showSelectedDays && "rotate-180",
                    )}
                  />
                  {showSelectedDays ? "Ocultar días" : "Ver días"}
                </button>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-lg font-bold text-slate-950">
              Eventos y conflictos
            </h2>
            <div className="my-4 grid grid-cols-2 gap-3">
              <div className="flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-3 text-sm font-semibold text-slate-700">
                <CalendarDays className="h-5 w-5 text-blue-500" />
                {activeDayExternalEvents.length} eventos
              </div>
              <div className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-3 text-sm font-semibold text-slate-700">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                {conflictCount} conflictos
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {visibleEvents.map((event) => {
                const isConflict = event.status !== "normal";

                return (
                  <article
                    key={event.id}
                    className="grid grid-cols-[12px_1fr_auto] gap-3 py-4"
                  >
                    <span
                      className={cn(
                        "mt-1.5 h-2.5 w-2.5 rounded-full",
                        isConflict ? "bg-red-500" : "bg-blue-500",
                      )}
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">
                        {event.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {event.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-600">
                        {event.time}
                      </p>
                      {isConflict && (
                        <span className="mt-2 inline-flex whitespace-pre-line rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-bold leading-tight text-red-600">
                          {event.status === "conflict"
                            ? "Conflicto"
                            : "Conflicto\nparcial"}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowAllEvents((value) => !value)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              {showAllEvents
                ? "Ver menos"
                : `Ver todos los eventos (${activeDayExternalEvents.length})`}
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition",
                  showAllEvents && "rotate-90",
                )}
              />
            </button>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function SummaryItem({
  icon,
  label,
  sublabel,
  accent,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 border-slate-200 lg:border-r lg:last:border-r-0">
      <div
        className={cn(
          "text-slate-500",
          accent && "text-violet-700",
          danger && "text-red-500",
        )}
      >
        {icon}
      </div>
      <div>
        <p
          className={cn(
            "text-sm font-bold text-slate-900",
            danger && "text-red-600",
          )}
        >
          {label}
        </p>
        <p className="text-xs font-medium text-slate-500">{sublabel}</p>
      </div>
    </div>
  );
}
