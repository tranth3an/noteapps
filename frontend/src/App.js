import React, { useState, useEffect, useCallback } from "react";
import { auth, googleProvider } from "./firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { api } from "./api";
import "./index.css";

const NOTE_COLORS = [
  { label: "Ivory", value: "#FDFBF5" },
  { label: "Sage", value: "#EBF2EB" },
  { label: "Blush", value: "#FBF0F0" },
  { label: "Sky", value: "#EEF4FB" },
  { label: "Lavender", value: "#F3F0FB" },
  { label: "Sand", value: "#FAF4EC" },
];

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }) +
    " " + d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message.replace("Firebase: ", "").replace(/\(auth\/.*\)/, ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError("Đăng nhập Google thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-mark">✦</span>
          <span className="logo-text">Ghi Chú</span>
        </div>
        <p className="login-sub">Không gian ghi chép của bạn</p>

        <form onSubmit={handleEmail} className="login-form">
          <div className="field-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@example.com"
              required
            />
          </div>
          <div className="field-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Đang xử lý…" : mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
          </button>
        </form>

        <div className="divider"><span>hoặc</span></div>

        <button className="btn-google" onClick={handleGoogle} disabled={loading}>
          <GoogleIcon />
          Tiếp tục với Google
        </button>

        <p className="login-toggle">
          {mode === "login" ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Tạo tài khoản" : "Đăng nhập"}
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── Note Card ────────────────────────────────────────────────────────────────
function NoteCard({ note, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div className="note-card" style={{ background: note.color || "#FDFBF5" }}>
      <div className="note-card-header">
        <h3>{note.title || "Không có tiêu đề"}</h3>
        <div className="note-actions">
          <button className="icon-btn" onClick={() => onEdit(note)} title="Sửa">✎</button>
          <button
            className="icon-btn danger"
            onClick={async () => { setDeleting(true); await onDelete(note.id); }}
            disabled={deleting}
            title="Xoá"
          >
            {deleting ? "…" : "✕"}
          </button>
        </div>
      </div>
      <p className="note-content">{note.content}</p>
      <span className="note-date">{formatDate(note.updated_at)}</span>
    </div>
  );
}

// ─── Note Modal ───────────────────────────────────────────────────────────────
function NoteModal({ note, onSave, onClose }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [color, setColor] = useState(note?.color || NOTE_COLORS[0].value);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;
    setSaving(true);
    await onSave({ title, content, color });
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ background: color }}>
        <input
          className="modal-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề…"
          autoFocus
        />
        <textarea
          className="modal-content-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nội dung ghi chú…"
          rows={8}
        />
        <div className="modal-footer">
          <div className="color-picker">
            {NOTE_COLORS.map((c) => (
              <button
                key={c.value}
                className={`color-dot ${color === c.value ? "active" : ""}`}
                style={{ background: c.value }}
                onClick={() => setColor(c.value)}
                title={c.label}
              />
            ))}
          </div>
          <div className="modal-btns">
            <button className="btn-ghost" onClick={onClose}>Huỷ</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Đang lưu…" : note ? "Cập nhật" : "Lưu ghi chú"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function NotesApp({ user }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "new" | noteObject
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const getToken = useCallback(async () => {
    return await user.getIdToken();
  }, [user]);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const data = await api.getNotes(token);
      setNotes(data);
    } catch (e) {
      setError("Không tải được ghi chú: " + e.message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  const handleSave = async (data) => {
    const token = await getToken();
    if (modal && modal.id) {
      const updated = await api.updateNote(token, modal.id, data);
      setNotes((prev) => prev.map((n) => (n.id === modal.id ? updated : n)));
    } else {
      const created = await api.createNote(token, data);
      setNotes((prev) => [created, ...prev]);
    }
    setModal(null);
  };

  const handleDelete = async (id) => {
    const token = await getToken();
    await api.deleteNote(token, id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="app-logo">
            <span className="logo-mark">✦</span>
            <span>Ghi Chú</span>
          </div>
          <div className="user-info">
            {user.photoURL && <img src={user.photoURL} alt="avatar" className="avatar" />}
            <div>
              <p className="user-name">{user.displayName || "Người dùng"}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
          <div className="notes-count">
            <span>{notes.length}</span> ghi chú
          </div>
        </div>
        <button className="sidebar-logout" onClick={() => signOut(auth)}>
          Đăng xuất
        </button>
      </aside>

      {/* Main */}
      <main className="main">
        <div className="main-header">
          <div className="search-bar">
            <span className="search-icon">⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm ghi chú…"
            />
          </div>
          <button className="btn-new" onClick={() => setModal("new")}>
            + Ghi chú mới
          </button>
        </div>

        {error && <div className="banner-error">{error}</div>}

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Đang tải…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">✦</span>
            <p>{search ? "Không tìm thấy ghi chú nào." : "Chưa có ghi chú. Hãy tạo ghi chú đầu tiên!"}</p>
          </div>
        ) : (
          <div className="notes-grid">
            {filtered.map((note) => (
              <NoteCard key={note.id} note={note} onEdit={setModal} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modal && (
        <NoteModal
          note={modal === "new" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
  }, []);

  if (authLoading) {
    return (
      <div className="auth-loading">
        <div className="spinner" />
      </div>
    );
  }

  return user ? <NotesApp user={user} /> : <LoginScreen />;
}
