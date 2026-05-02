"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { MonthCalendar } from "@/app/features/reservaciones/components/Calendar/MonthCalendar";
import { Card } from "@/app/features/reservaciones/components/Card";
import { EventsAndConflictsCard } from "@/app/features/reservaciones/components/EventsAndConflictCard";
import { ProposedSchedulesCard } from "@/app/features/reservaciones/components/ProposedSchedulesCard";
import { ReservationFooter } from "@/app/features/reservaciones/components/ReservationFooter";
import { ReservationTimelineCard } from "@/app/features/reservaciones/components/ReservationTimelineCard";
import PageTransition from "@/app/components/PageTransition/PageTransition";

import {
  apiGetExternalEventsInInterval,
  apiGetSpaceReservationsByDay,
  createMockApiJson,
  toTimelineEvent,
} from "@/app/features/reservaciones/data/mockReservations";

import {
  createCalendarCells,
  getFirstAvailableDateId,
} from "@/app/features/reservaciones/lib/dates";

import {
  blockOverlapsApiReservation,
  hasOverlappingBlocks,
} from "@/app/features/reservaciones/lib/conflicts";

import {
  formatDateRanges,
  formatShortDateById,
  uniqueSortedIds,
} from "@/app/features/reservaciones/lib/formatting";

import { cn } from "@/app/features/reservaciones/lib/cn";

import type {
  DayEvent,
  SelectionMode,
  TimeBlock,
  TimelineEvent,
} from "@/app/features/reservaciones/types/reservaciones";

export default function ReservationSchedulerPage() {
  const calendarCells = useMemo(() => createCalendarCells(), []);

  const defaultDateIds = useMemo(
    () =>
      calendarCells
        .filter((cell) => !cell.isWeekend)
        .slice(0, 4)
        .map((cell) => cell.id),
    [calendarCells],
  );

  const selectedSpaceName = "Sala A";

  const [selectionMode, setSelectionMode] = useState<SelectionMode>("multiple");

  const [selectedDateIds, setSelectedDateIds] =
    useState<string[]>(defaultDateIds);

  const [activeDayId, setActiveDayId] = useState(
    defaultDateIds[0] ?? getFirstAvailableDateId(calendarCells),
  );

  const [dayBlocks, setDayBlocks] = useState<Record<string, TimeBlock[]>>({});

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
  const [editedSavedDateIds, setEditedSavedDateIds] = useState<string[]>([]);

  const apiJson = useMemo(
    () => createMockApiJson(calendarCells),
    [calendarCells],
  );

  const navigationDateIds = useMemo(
    () => uniqueSortedIds(selectedDateIds),
    [selectedDateIds],
  );

  const modifiedDateIds = useMemo(
    () => uniqueSortedIds(Object.keys(dayBlocks)),
    [dayBlocks],
  );

  function isWeekendDateId(dateId: string) {
    return calendarCells.find((cell) => cell.id === dateId)?.isWeekend ?? false;
  }

  function getAffectedDateIdsForBlock(block: TimeBlock) {
    if (!block.applyToAllSelected) {
      return isWeekendDateId(activeDayId) ? [] : [activeDayId];
    }

    const selectableDateIds = selectedDateIds.filter(
      (dateId) => !isWeekendDateId(dateId),
    );

    return selectableDateIds.length > 0
      ? selectableDateIds
      : isWeekendDateId(activeDayId)
        ? []
        : [activeDayId];
  }

  const affectedDateIdsForPendingBlocks = useMemo(
    () =>
      uniqueSortedIds(
        pendingBlocks.flatMap((block) => getAffectedDateIdsForBlock(block)),
      ),
    [activeDayId, calendarCells, pendingBlocks, selectedDateIds],
  );

  const conflictDateIds = useMemo(() => {
    const conflictIds = new Set<string>();

    Object.entries(dayBlocks).forEach(([dateId, blocks]) => {
      const spaceReservationsForDate = apiJson.spaceReservations.filter(
        (reservation) =>
          reservation.dateId === dateId &&
          reservation.location === selectedSpaceName,
      );

      const hasInternalConflict = hasOverlappingBlocks(blocks);

      const hasSpaceConflict = blocks.some((block) =>
        spaceReservationsForDate.some((reservation) =>
          blockOverlapsApiReservation(block, reservation),
        ),
      );

      if (hasInternalConflict || hasSpaceConflict) {
        conflictIds.add(dateId);
      }
    });

    pendingBlocks.forEach((block) => {
      getAffectedDateIdsForBlock(block).forEach((dateId) => {
        const hasPendingSpaceConflict = apiJson.spaceReservations.some(
          (reservation) =>
            reservation.dateId === dateId &&
            reservation.location === selectedSpaceName &&
            blockOverlapsApiReservation(block, reservation),
        );

        if (hasPendingSpaceConflict) {
          conflictIds.add(dateId);
        }
      });
    });

    return uniqueSortedIds(Array.from(conflictIds));
  }, [
    activeDayId,
    apiJson.spaceReservations,
    calendarCells,
    dayBlocks,
    pendingBlocks,
    selectedDateIds,
    selectedSpaceName,
  ]);

  const activeBlocks = dayBlocks[activeDayId] ?? [];

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

  const externalTimelineEventsForActiveDay = useMemo(
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

  const selectedSavedBlocksHaveSpaceConflict = selectedDateIds.some(
    (dateId) => {
      if (isWeekendDateId(dateId)) return false;

      const blocksForDate = dayBlocks[dateId] ?? [];

      return blocksForDate.some((block) =>
        apiJson.spaceReservations.some(
          (reservation) =>
            reservation.dateId === dateId &&
            reservation.location === selectedSpaceName &&
            blockOverlapsApiReservation(block, reservation),
        ),
      );
    },
  );

  const pendingBlocksHaveSpaceConflict = pendingBlocks.some((block) =>
    getAffectedDateIdsForBlock(block).some((dateId) =>
      apiJson.spaceReservations.some(
        (reservation) =>
          reservation.dateId === dateId &&
          reservation.location === selectedSpaceName &&
          blockOverlapsApiReservation(block, reservation),
      ),
    ),
  );

  const hasBlockingSpaceConflict =
    selectedSavedBlocksHaveSpaceConflict || pendingBlocksHaveSpaceConflict;

  const hasPendingChanges = pendingBlocks.length > 0;
  const hasSavedBlockEdits = editedSavedDateIds.length > 0;

  const hasValidPendingTarget =
    !hasPendingChanges || affectedDateIdsForPendingBlocks.length > 0;

  const canSaveChanges =
    ((hasPendingChanges && hasValidPendingTarget) || hasSavedBlockEdits) &&
    !hasBlockingSpaceConflict;

  const canContinue =
    !hasBlockingSpaceConflict &&
    (selectedDateIds.length > 0 ||
      affectedDateIdsForPendingBlocks.length > 0 ||
      hasSavedBlockEdits);

  useEffect(() => {
    let cancelled = false;

    apiGetSpaceReservationsByDay({
      apiJson,
      dateId: activeDayId,
      spaceName: selectedSpaceName,
    }).then((events) => {
      if (!cancelled) setSpaceReservationsForActiveDay(events);
    });

    return () => {
      cancelled = true;
    };
  }, [activeDayId, apiJson, selectedSpaceName]);

  useEffect(() => {
    let cancelled = false;

    const intervalDateIds = calendarCells.map((cell) => cell.id);

    apiGetExternalEventsInInterval({
      apiJson,
      dateIds: intervalDateIds,
    }).then((externalEvents) => {
      if (cancelled) return;
      setExternalEventsForInterval(externalEvents);
    });

    return () => {
      cancelled = true;
    };
  }, [apiJson, calendarCells]);

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
      const nextDayId = !isWeekendDateId(activeDayId)
        ? activeDayId
        : (selectedDateIds.find((dateId) => !isWeekendDateId(dateId)) ??
          getFirstAvailableDateId(calendarCells));

      setSelectedDateIds([nextDayId]);
      setActiveDayId(nextDayId);
      setHasAppliedCurrentSelection(false);
    }
  }

  function handleSingleDaySelect(dayId: string) {
    if (isWeekendDateId(dayId)) return;

    setSelectedDateIds([dayId]);
    setActiveDayId(dayId);
    setHasAppliedCurrentSelection(false);
  }

  function handleToggleDay(dayId: string) {
    if (isWeekendDateId(dayId)) return;

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
    const draggedDateIds = uniqueSortedIds(
      dateIds.filter((dateId) => !isWeekendDateId(dateId)),
    );

    setSelectedDateIds((previousDateIds) => {
      const nextDateIds = hasAppliedCurrentSelection
        ? draggedDateIds
        : uniqueSortedIds([...previousDateIds, ...draggedDateIds]);

      return nextDateIds;
    });

    setHasAppliedCurrentSelection(false);
    setActiveDayId(draggedDateIds[0] ?? activeDayId);
  }

  function handleRepeatDaySelect(dayId: string) {
    if (isWeekendDateId(dayId)) return;

    const selectedCell = calendarCells.find((cell) => cell.id === dayId);
    if (!selectedCell) return;

    const repeatedDateIds = calendarCells
      .filter(
        (cell) =>
          !cell.isWeekend &&
          cell.date >= selectedCell.date &&
          cell.date.getDay() === selectedCell.date.getDay(),
      )
      .map((cell) => cell.id);

    setSelectedDateIds(uniqueSortedIds(repeatedDateIds));
    setActiveDayId(dayId);
    setHasAppliedCurrentSelection(false);
  }

  function clearSelection() {
    setSelectedDateIds([]);
    setHasAppliedCurrentSelection(false);
  }
  function deleteSavedBlock(dateId: string, blockId: string) {
    setDayBlocks((previousBlocks) => {
      const blocksForDate = previousBlocks[dateId] ?? [];

      return {
        ...previousBlocks,
        [dateId]: blocksForDate.filter((block) => block.id !== blockId),
      };
    });

    setEditedSavedDateIds((previousDateIds) =>
      uniqueSortedIds([...previousDateIds, dateId]),
    );
  }
  function updateSavedBlock(
    dateId: string,
    blockId: string,
    field: "start" | "end",
    value: string,
  ) {
    setDayBlocks((previousBlocks) => {
      const blocksForDate = previousBlocks[dateId] ?? [];

      return {
        ...previousBlocks,
        [dateId]: blocksForDate.map((block) =>
          block.id === blockId
            ? {
                ...block,
                [field]: value,
                conflict: undefined,
              }
            : block,
        ),
      };
    });

    setEditedSavedDateIds((previousDateIds) =>
      uniqueSortedIds([...previousDateIds, dateId]),
    );
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
    if (!canSaveChanges) return;

    if (pendingBlocks.length > 0) {
      setSelectedDateIds((previousDateIds) =>
        uniqueSortedIds([
          ...previousDateIds,
          ...affectedDateIdsForPendingBlocks,
        ]),
      );

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

    setEditedSavedDateIds([]);
    setHasAppliedCurrentSelection(true);
  }

  function handleContinue() {
    if (!canContinue) return;

    if (pendingBlocks.length > 0) {
      applyPendingBlocks();
    }

    // Aquí navegarías a la siguiente pantalla:
    // router.push("/reservations/confirm");
  }
  return (
    <PageTransition>
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

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-5">
            <Card className="p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-3"></div>

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

              <ReservationTimelineCard
                activeDayId={activeDayId}
                activeBlocks={activeBlocks}
                pendingBlocks={pendingBlocks}
                spaceReservationsForActiveDay={spaceReservationsForActiveDay}
                externalTimelineEventsForActiveDay={
                  externalTimelineEventsForActiveDay
                }
              />
            </Card>

            <ProposedSchedulesCard
              activeDayId={activeDayId}
              activeBlocks={activeBlocks}
              pendingBlocks={pendingBlocks}
              onAddPendingBlock={addPendingBlock}
              onDeletePendingBlock={deletePendingBlock}
              onDeleteSavedBlock={deleteSavedBlock}
              onTogglePendingBlockScope={togglePendingBlockScope}
              onUpdatePendingBlock={updatePendingBlock}
              onUpdateSavedBlock={updateSavedBlock}
            />

            <ReservationFooter
              selectedCount={selectedDateIds.length}
              activeSavedBlocksCount={activeBlocks.length}
              pendingBlocksCount={pendingBlocks.length}
              savedEditsCount={editedSavedDateIds.length}
              hasBlockingSpaceConflict={hasBlockingSpaceConflict}
              canSaveChanges={canSaveChanges}
              canContinue={canContinue}
              onSaveChanges={applyPendingBlocks}
              onContinue={handleContinue}
            />
          </div>
          <aside className="sticky top-5 self-start space-y-5 ">
            {" "}
            <Card className="p-5">
              <div className="mb-4 grid grid-cols-3 rounded-xl border border-slate-200 bg-slate-50 p-1 text-sm font-semibold text-slate-600">
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

                <button
                  type="button"
                  onClick={() => handleModeChange("repeat")}
                  className={cn(
                    "rounded-lg px-3 py-2 transition",
                    selectionMode === "repeat"
                      ? "bg-violet-700 text-white shadow-sm"
                      : "hover:bg-white",
                  )}
                >
                  Repetir
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
                onRepeatDaySelect={handleRepeatDaySelect}
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
            <EventsAndConflictsCard
              events={activeDayExternalEvents}
              visibleEvents={visibleEvents}
              conflictCount={conflictCount}
              showAllEvents={showAllEvents}
              onToggleShowAllEvents={() => setShowAllEvents((value) => !value)}
            />
          </aside>
        </div>
      </main>
    </PageTransition>
  );
}
