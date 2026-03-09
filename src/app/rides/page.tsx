import { Suspense } from "react";
import RidesList from "./RidesList";

export default function RidesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-gray-500">Loading...</p>
        </div>
      }
    >
      <RidesList />
    </Suspense>
  );
}
