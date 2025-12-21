"use client";

import { Wrench } from "lucide-react";

export function MaintenancePage({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/20 mb-6">
          <Wrench className="w-10 h-10 text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Under Maintenance
        </h1>
        <p className="text-gray-400 max-w-md mx-auto text-lg">{message}</p>
      </div>
    </div>
  );
}
