import RideDetail from "./RideDetail";

export function generateStaticParams() {
  return [
    { id: "mock-1" },
    { id: "mock-2" },
    { id: "mock-3" },
    { id: "mock-4" },
    { id: "mock-5" },
    { id: "mock-6" },
  ];
}

export default function RideDetailPage() {
  return <RideDetail />;
}
