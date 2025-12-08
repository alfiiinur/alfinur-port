import BlogForm from "../components/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">New Blog</h2>
        <p className="text-muted-foreground">Create a new blog post</p>
      </div>
      <BlogForm />
    </div>
  );
}
