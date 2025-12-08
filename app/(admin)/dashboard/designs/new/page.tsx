import DesignForm from "../components/DesignForm";

export default function NewDesignPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">New Design</h2>
        <p className="text-muted-foreground">
          Add a new design to your gallery
        </p>
      </div>
      <DesignForm />
    </div>
  );
}
