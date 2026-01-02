"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Zap, Save, X } from "lucide-react";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

interface QuickReply {
  id: string;
  title: string;
  shortcut: string;
  content: string;
  category: string;
  isActive: boolean;
}

const DEFAULT_TEMPLATES: Omit<QuickReply, "id" | "isActive">[] = [
  {
    title: "Salam Pembuka",
    shortcut: "/halo",
    content:
      "Halo! Terima kasih sudah menghubungi kami. Ada yang bisa saya bantu?",
    category: "greeting",
  },
  {
    title: "Daftar Layanan",
    shortcut: "/services",
    content: `Berikut layanan yang kami tawarkan:

🎨 Web Design & Development
- Landing Page
- Company Profile
- E-commerce
- Custom Web App

📱 Mobile App Development
- Android & iOS
- Cross-platform (React Native/Flutter)

🖼️ UI/UX Design
- Wireframing & Prototyping
- User Research
- Design System

💼 Branding
- Logo Design
- Brand Identity
- Marketing Materials

Layanan mana yang Anda minati?`,
    category: "services",
  },
  {
    title: "Price List",
    shortcut: "/price",
    content: `💰 Estimasi Harga Layanan:

🌐 Website:
- Landing Page: Rp 2-5 juta
- Company Profile: Rp 5-15 juta
- E-commerce: Rp 15-50 juta
- Custom Web App: Mulai Rp 25 juta

📱 Mobile App:
- Simple App: Rp 15-30 juta
- Medium App: Rp 30-75 juta
- Complex App: Rp 75 juta+

🎨 Design:
- Logo: Rp 1-5 juta
- UI/UX Design: Rp 5-20 juta
- Brand Identity: Rp 10-30 juta

*Harga dapat disesuaikan dengan kebutuhan dan kompleksitas project.

Untuk penawaran detail, bisa ceritakan kebutuhan projectnya?`,
    category: "pricing",
  },
  {
    title: "Proses Kerja",
    shortcut: "/process",
    content: `📋 Proses Kerja Kami:

1️⃣ Discovery & Consultation
   - Diskusi kebutuhan
   - Analisis requirement

2️⃣ Proposal & Agreement
   - Penawaran harga
   - Timeline project
   - Kontrak kerja

3️⃣ Design Phase
   - Wireframe & Mockup
   - Revisi design (max 3x)
   - Final approval

4️⃣ Development
   - Coding & Implementation
   - Progress update mingguan

5️⃣ Testing & Launch
   - QA Testing
   - Bug fixing
   - Deployment

6️⃣ Support & Maintenance
   - Free support 1 bulan
   - Maintenance optional

Ada pertanyaan tentang prosesnya?`,
    category: "process",
  },
  {
    title: "Minta Detail Project",
    shortcut: "/detail",
    content: `Untuk memberikan penawaran yang tepat, boleh ceritakan lebih detail:

1. Jenis project apa yang dibutuhkan?
2. Fitur-fitur utama yang diinginkan?
3. Ada referensi design/website yang disukai?
4. Target timeline kapan?
5. Budget range yang disiapkan?

Semakin detail informasinya, semakin akurat penawaran yang bisa kami berikan 😊`,
    category: "inquiry",
  },
  {
    title: "Penutup",
    shortcut: "/thanks",
    content: `Terima kasih sudah menghubungi kami! 🙏

Jika ada pertanyaan lain, jangan ragu untuk chat kembali.

📧 Email: hello@example.com
📱 WhatsApp: +62 xxx-xxxx-xxxx

Semoga harimu menyenangkan! 😊`,
    category: "closing",
  },
];

export default function QuickRepliesPage() {
  const [replies, setReplies] = useState<QuickReply[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    shortcut: "",
    content: "",
    category: "general",
  });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    reply: QuickReply | null;
  }>({
    open: false,
    reply: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchReplies();
  }, []);

  const fetchReplies = async () => {
    try {
      const res = await fetch("/api/chat/quick-replies");
      if (res.ok) {
        const data = await res.json();
        setReplies(data);
      }
    } catch (error) {
      console.error("Failed to fetch replies:", error);
    }
  };

  const saveReply = async () => {
    if (!form.title || !form.shortcut || !form.content) return;

    try {
      if (editingId) {
        await fetch("/api/chat/quick-replies", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...form }),
        });
      } else {
        await fetch("/api/chat/quick-replies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      await fetchReplies();
      resetForm();
    } catch (error) {
      console.error("Failed to save reply:", error);
    }
  };

  const deleteReply = async () => {
    if (!deleteModal.reply) return;
    setIsDeleting(true);

    try {
      await fetch("/api/chat/quick-replies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteModal.reply.id }),
      });
      await fetchReplies();
    } catch (error) {
      console.error("Failed to delete reply:", error);
    } finally {
      setIsDeleting(false);
      setDeleteModal({ open: false, reply: null });
    }
  };

  const editReply = (reply: QuickReply) => {
    setEditingId(reply.id);
    setForm({
      title: reply.title,
      shortcut: reply.shortcut,
      content: reply.content,
      category: reply.category,
    });
    setIsCreating(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setIsCreating(false);
    setForm({ title: "", shortcut: "", content: "", category: "general" });
  };

  const seedTemplates = async () => {
    if (
      !confirm(
        "Tambahkan template default? Template yang sudah ada tidak akan terduplikasi."
      )
    )
      return;

    for (const template of DEFAULT_TEMPLATES) {
      try {
        await fetch("/api/chat/quick-replies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(template),
        });
      } catch {
        // Skip if shortcut already exists
      }
    }
    await fetchReplies();
  };

  const categories = [...new Set(replies.map((r) => r.category))];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6" /> Quick Replies
          </h1>
          <p className="text-neutral-400 mt-1">
            Template balasan cepat untuk chat
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={seedTemplates}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg"
          >
            Load Templates
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <div className="mb-6 p-6 bg-neutral-900 border border-neutral-800 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-4">
            {editingId ? "Edit Quick Reply" : "Tambah Quick Reply"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Judul (e.g., Salam Pembuka)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
            />
            <input
              type="text"
              placeholder="Shortcut (e.g., /halo)"
              value={form.shortcut}
              onChange={(e) => setForm({ ...form, shortcut: e.target.value })}
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
            >
              <option value="general">General</option>
              <option value="greeting">Greeting</option>
              <option value="services">Services</option>
              <option value="pricing">Pricing</option>
              <option value="process">Process</option>
              <option value="inquiry">Inquiry</option>
              <option value="closing">Closing</option>
            </select>
          </div>
          <textarea
            placeholder="Isi pesan..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white mb-4"
          />
          <div className="flex gap-2">
            <button
              onClick={saveReply}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Simpan
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Batal
            </button>
          </div>
        </div>
      )}

      {/* Quick Replies List */}
      {categories.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Belum ada quick reply</p>
          <p className="text-sm mt-2">
            Klik &quot;Load Templates&quot; untuk menambahkan template default
          </p>
        </div>
      ) : (
        categories.map((category) => (
          <div key={category} className="mb-6">
            <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-3">
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {replies
                .filter((r) => r.category === category)
                .map((reply) => (
                  <div
                    key={reply.id}
                    className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium text-white">
                          {reply.title}
                        </span>
                        <span className="ml-2 text-blue-400 text-sm">
                          {reply.shortcut}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => editReply(reply)}
                          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, reply })}
                          className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-400 whitespace-pre-wrap line-clamp-4">
                      {reply.content}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))
      )}

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        open={deleteModal.open}
        onOpenChange={(open) =>
          setDeleteModal({ open, reply: open ? deleteModal.reply : null })
        }
        onConfirm={deleteReply}
        title="Hapus Quick Reply"
        itemName={deleteModal.reply?.title}
        isLoading={isDeleting}
      />
    </div>
  );
}
