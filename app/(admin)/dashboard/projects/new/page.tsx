import ProjectForm from "../components/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">New Project</h2>
        <p className="text-muted-foreground">Create a new portfolio project</p>
      </div>
      <ProjectForm />
    </div>
  );
}
