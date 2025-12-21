import CalendarMain from "./components/CalendarMain";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Calendar</h2>
        <p className="text-muted-foreground">Manage your schedule and events</p>
      </div>

      <CalendarMain />
    </div>
  );
}
