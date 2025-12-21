import NotesMain from "./components/NotesMain";

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">All Notes</h2>
        <p className="text-muted-foreground">Manage your notes and ideas</p>
      </div>
      <NotesMain />
    </div>
  );
}
