# ✦ Ghi Chú — Notes App

Ứng dụng ghi chú đơn giản với React frontend, FastAPI backend, Firebase Authentication và Firestore database.

## Tính năng

- 🔐 Đăng nhập bằng Email/Password hoặc Google (Firebase Auth)
- 📝 Tạo, sửa, xoá ghi chú
- 🎨 Chọn màu cho ghi chú
- 🔍 Tìm kiếm ghi chú
- 💾 Dữ liệu lưu trên Firestore theo từng người dùng

## Cấu trúc thư mục

```
notes-app/
├── frontend/          # React app
│   ├── public/
│   └── src/
│       ├── App.js     # Toàn bộ UI
│       ├── api.js     # Gọi backend API
│       ├── firebase.js
│       └── index.css
├── backend/           # FastAPI app
│   ├── main.py
│   ├── routers/
│   │   ├── auth.py
│   │   └── notes.py
│   ├── schemas/
│   │   └── notes.py
│   └── services/
│       └── firebase.py
├── requirements.txt
├── .gitignore
└── README.md
```

## Cài đặt Firebase

### 1. Tạo Firebase project
1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới
3. Bật **Authentication** → Sign-in method → Email/Password + Google
4. Bật **Firestore Database** → Start in test mode

### 2. Lấy Firebase config (cho Frontend)
- Firebase Console → Project Settings → Your apps → Add web app
- Copy config object

### 3. Lấy Service Account (cho Backend)
- Firebase Console → Project Settings → Service accounts → Generate new private key
- Tải file JSON về, đổi tên thành `firebase-credentials.json`
- Đặt vào thư mục `backend/`

### 4. Thêm Firestore index
Tạo composite index cho collection `notes`:
- Fields: `uid` (Ascending), `updated_at` (Descending)

---

## Cài đặt môi trường

```bash
# Clone repo
git clone https://github.com/tranth3an/noteapps
cd notes-app
```

---

## Chạy Backend

```bash
# Cài dependencies
pip install -r requirements.txt

# Copy file env
cd backend
cp .env.example .env
# (Đặt firebase-credentials.json vào thư mục backend/)

# Chạy server
uvicorn main:app --reload --port 8000
```

Backend sẽ chạy tại: http://localhost:8000  
Docs API: http://localhost:8000/docs

---

## Chạy Frontend

```bash
cd frontend

# Cài dependencies
npm install

# Copy và điền thông tin Firebase
cp .env.example .env
# Mở .env và điền các giá trị Firebase config

# Chạy
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

---

## API Endpoints

| Method | Endpoint       | Mô tả                        |
|--------|---------------|------------------------------|
| GET    | `/`           | Health check                 |
| GET    | `/health`     | Health check                 |
| GET    | `/auth/me`    | Thông tin user hiện tại      |
| GET    | `/notes/`     | Lấy tất cả ghi chú của user  |
| POST   | `/notes/`     | Tạo ghi chú mới              |
| PUT    | `/notes/{id}` | Cập nhật ghi chú             |
| DELETE | `/notes/{id}` | Xoá ghi chú                  |

---

## Video Demo

> 🎬 [Link video demo](your-video-link-here)
