import ManageRide from "./ManageRide";

export function generateStaticParams() {
  return [{ token: "placeholder" }];
}

export default function ManageRidePage() {
  return <ManageRide />;
}
