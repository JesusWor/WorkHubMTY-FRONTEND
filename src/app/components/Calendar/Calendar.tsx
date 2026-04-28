"use client";

function generateDays(startingDay: Date, interval: number) {
  const lastDay = new Date();
  lastDay.setDate(startingDay.getDate() + interval);
  if (startingDay > lastDay) {
    console.log(startingDay);
    console.log(lastDay);
    throw new Error("starting date must be before the end of the interval");
  }

  const days: Date[] = [];
  for (let i = 0; i < 21; i++) {
    const currentDay = new Date(startingDay);
    currentDay.setDate(currentDay.getDate() + i);
    days.push(currentDay);
  }

  return days;
}

export default function Calendar({
  startingDay = new Date(),
}: {
  startingDay: Date;
}) {
  const days = generateDays(new Date(), 21);
  const WEEY_DAYS = ["D", "L", "M", "M", "J", "V", "S"];
  return (
    <div className="grid grid-cols-[repeat(7, minmax(0, 1fr))] grid-rows-[repeat(6, minmax(0, 1fr))] gap-1 p-2 bg-container rounded">
      {WEEY_DAYS.map((day, index) => (
        <span
          key={index}
          className="flex items-center justify-center p-2 row-start-1 font-bold select-none"
        >
          {day}
        </span>
      ))}
      {days.map((day) => (
        <span
          key={String(day)}
          className="flex justify-self-center self-center items-center justify-center p-2 h-8 w-8 select-none rounded-full hover:bg-primary-1 hover:text-on-primary-1 cursor-pointer"
          style={{
            gridColumn: day.getDay() + 1,
          }}
        >
          {day.getDate()}
        </span>
      ))}
    </div>
  );
}
