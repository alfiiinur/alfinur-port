import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Sync events to Google Calendar
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = request.cookies.get("google_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Google Calendar not connected" },
        { status: 400 }
      );
    }

    // Get all events that need to be synced
    const events = await prisma.calendarEvent.findMany({
      where: {
        userId: session.user.id,
        googleEventId: null, // Only sync events not yet synced
      },
    });

    const syncedEvents = [];

    for (const event of events) {
      try {
        // Create event in Google Calendar
        const googleEvent = {
          summary: event.title,
          description: event.description,
          start: event.allDay
            ? { date: event.startDate.toISOString().split("T")[0] }
            : { dateTime: event.startDate.toISOString() },
          end: event.allDay
            ? {
                date: (event.endDate || event.startDate)
                  .toISOString()
                  .split("T")[0],
              }
            : { dateTime: (event.endDate || event.startDate).toISOString() },
          reminders: event.reminder
            ? {
                useDefault: false,
                overrides: [{ method: "popup", minutes: event.reminder }],
              }
            : { useDefault: true },
        };

        const response = await fetch(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(googleEvent),
          }
        );

        if (response.ok) {
          const createdEvent = await response.json();

          // Update local event with Google Event ID
          await prisma.calendarEvent.update({
            where: { id: event.id },
            data: { googleEventId: createdEvent.id },
          });

          syncedEvents.push(event.id);
        }
      } catch (error) {
        console.error(`Failed to sync event ${event.id}:`, error);
      }
    }

    return NextResponse.json({
      message: "Sync completed",
      syncedCount: syncedEvents.length,
      syncedEvents,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

// Import events from Google Calendar
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = request.cookies.get("google_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Google Calendar not connected" },
        { status: 400 }
      );
    }

    // Fetch events from Google Calendar
    const now = new Date();
    const timeMin = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();
    const timeMax = new Date(
      now.getFullYear(),
      now.getMonth() + 3,
      0
    ).toISOString();

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Google Calendar events");
    }

    const data = await response.json();
    const importedEvents = [];

    for (const item of data.items || []) {
      // Check if event already exists
      const existing = await prisma.calendarEvent.findFirst({
        where: {
          userId: session.user.id,
          googleEventId: item.id,
        },
      });

      if (!existing) {
        const startDate = item.start.dateTime
          ? new Date(item.start.dateTime)
          : new Date(item.start.date);
        const endDate = item.end.dateTime
          ? new Date(item.end.dateTime)
          : new Date(item.end.date);

        const newEvent = await prisma.calendarEvent.create({
          data: {
            title: item.summary || "Untitled",
            description: item.description,
            startDate,
            endDate,
            allDay: !item.start.dateTime,
            googleEventId: item.id,
            userId: session.user.id,
          },
        });

        importedEvents.push(newEvent);
      }
    }

    return NextResponse.json({
      message: "Import completed",
      importedCount: importedEvents.length,
      importedEvents,
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
