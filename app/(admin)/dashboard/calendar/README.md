# Calendar Feature

Fitur calendar untuk productivity dengan dukungan:

- View: Day, Week, Month
- CRUD Events
- Multiple calendars
- Dark/Light mode
- Responsive design
- Google Calendar integration

## Google Calendar Integration Setup

Untuk mengaktifkan notifikasi di HP melalui Google Calendar:

### 1. Buat Google Cloud Project

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih yang sudah ada
3. Enable Google Calendar API

### 2. Setup OAuth Credentials

1. Pergi ke APIs & Services > Credentials
2. Create Credentials > OAuth client ID
3. Application type: Web application
4. Authorized redirect URIs: `http://localhost:3000/api/calendar/google/callback`
5. Copy Client ID dan Client Secret

### 3. Tambahkan Environment Variables

Tambahkan ke file `.env.local`:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
```

### 4. Connect Google Calendar

1. Buka halaman Calendar di dashboard
2. Klik "Connect Google Calendar" di sidebar
3. Login dengan akun Google
4. Izinkan akses ke Calendar

### 5. Sync Events

- Events yang dibuat akan otomatis sync ke Google Calendar
- Notifikasi akan muncul di semua device yang terhubung dengan akun Google

## Database Schema

Model yang digunakan:

- `CalendarEvent`: Menyimpan event calendar
- `Calendar`: Menyimpan kategori calendar (Personal, Work, dll)

## API Endpoints

- `GET /api/calendar/events` - Get all events
- `POST /api/calendar/events` - Create event
- `PUT /api/calendar/events/[id]` - Update event
- `DELETE /api/calendar/events/[id]` - Delete event
- `GET /api/calendar/calendars` - Get all calendars
- `POST /api/calendar/calendars` - Create calendar
- `POST /api/calendar/google/sync` - Sync to Google Calendar
- `GET /api/calendar/google/sync` - Import from Google Calendar
