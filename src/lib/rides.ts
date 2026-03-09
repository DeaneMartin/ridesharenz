import { supabase } from "./supabase";

export interface Ride {
  id: string;
  driver_name: string;
  from_location: string;
  to_location: string;
  departure_date: string;
  departure_time: string;
  seats_available: number;
  pricing: string;
  price_amount: number | null;
  contact: string;
  notes: string;
  manage_token: string;
  status: string;
  created_at: string;
}

function generateMockRides(): Ride[] {
  const today = new Date();
  const mockRides: Ride[] = [
    {
      id: "mock-1",
      driver_name: "Sarah",
      from_location: "Auckland",
      to_location: "Hamilton",
      departure_date: new Date(today.getTime() + 86400000).toISOString().split("T")[0],
      departure_time: "08:00",
      seats_available: 3,
      pricing: "split-fuel",
      price_amount: null,
      contact: "+64211234567",
      notes: "Leaving from CBD, happy to pick up along the way",
      manage_token: "mock-token-1",
      status: "active",
      created_at: new Date().toISOString(),
    },
    {
      id: "mock-2",
      driver_name: "Mike",
      from_location: "Wellington",
      to_location: "Palmerston North",
      departure_date: new Date(today.getTime() + 86400000 * 2).toISOString().split("T")[0],
      departure_time: "07:30",
      seats_available: 2,
      pricing: "free",
      price_amount: null,
      contact: "+64219876543",
      notes: "Heading up for the weekend, boot space available",
      manage_token: "mock-token-2",
      status: "active",
      created_at: new Date().toISOString(),
    },
    {
      id: "mock-3",
      driver_name: "Aroha",
      from_location: "Christchurch",
      to_location: "Queenstown",
      departure_date: new Date(today.getTime() + 86400000 * 3).toISOString().split("T")[0],
      departure_time: "06:00",
      seats_available: 4,
      pricing: "custom",
      price_amount: 25,
      contact: "+64221112233",
      notes: "Road trip! Good vibes and good music guaranteed",
      manage_token: "mock-token-3",
      status: "active",
      created_at: new Date().toISOString(),
    },
    {
      id: "mock-4",
      driver_name: "James",
      from_location: "Tauranga",
      to_location: "Auckland",
      departure_date: new Date(today.getTime() + 86400000 * 2).toISOString().split("T")[0],
      departure_time: "16:00",
      seats_available: 1,
      pricing: "split-fuel",
      price_amount: null,
      contact: "+64223344556",
      notes: "Afternoon drive back to Auckland after work",
      manage_token: "mock-token-4",
      status: "active",
      created_at: new Date().toISOString(),
    },
    {
      id: "mock-5",
      driver_name: "Hine",
      from_location: "Dunedin",
      to_location: "Invercargill",
      departure_date: new Date(today.getTime() + 86400000).toISOString().split("T")[0],
      departure_time: "09:00",
      seats_available: 3,
      pricing: "free",
      price_amount: null,
      contact: "+64224455667",
      notes: "Quick trip down south, happy to chat or chill",
      manage_token: "mock-token-5",
      status: "active",
      created_at: new Date().toISOString(),
    },
    {
      id: "mock-6",
      driver_name: "Liam",
      from_location: "Nelson",
      to_location: "Blenheim",
      departure_date: new Date(today.getTime() + 86400000 * 4).toISOString().split("T")[0],
      departure_time: "10:30",
      seats_available: 2,
      pricing: "custom",
      price_amount: 15,
      contact: "+64225566778",
      notes: "Wine country run, can fit luggage too",
      manage_token: "mock-token-6",
      status: "active",
      created_at: new Date().toISOString(),
    },
  ];
  return mockRides;
}

export async function getRides(filters?: {
  from?: string;
  to?: string;
  date?: string;
}): Promise<Ride[]> {
  try {
    let query = supabase
      .from("rides")
      .select("*")
      .eq("status", "active")
      .order("departure_date", { ascending: true });

    if (filters?.from) {
      query = query.ilike("from_location", `%${filters.from}%`);
    }
    if (filters?.to) {
      query = query.ilike("to_location", `%${filters.to}%`);
    }
    if (filters?.date) {
      query = query.eq("departure_date", filters.date);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Ride[];
  } catch {
    let mocks = generateMockRides();
    if (filters?.from) {
      mocks = mocks.filter((r) =>
        r.from_location.toLowerCase().includes(filters.from!.toLowerCase())
      );
    }
    if (filters?.to) {
      mocks = mocks.filter((r) =>
        r.to_location.toLowerCase().includes(filters.to!.toLowerCase())
      );
    }
    if (filters?.date) {
      mocks = mocks.filter((r) => r.departure_date === filters.date);
    }
    return mocks;
  }
}

export async function getRideById(id: string): Promise<Ride | null> {
  try {
    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Ride;
  } catch {
    const mocks = generateMockRides();
    return mocks.find((r) => r.id === id) || null;
  }
}

export async function getRideByManageToken(token: string): Promise<Ride | null> {
  try {
    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("manage_token", token)
      .single();
    if (error) throw error;
    return data as Ride;
  } catch {
    const mocks = generateMockRides();
    return mocks.find((r) => r.manage_token === token) || null;
  }
}

export async function createRide(ride: Omit<Ride, "id" | "created_at" | "status">): Promise<Ride> {
  const { data, error } = await supabase
    .from("rides")
    .insert([{ ...ride, status: "active" }])
    .select()
    .single();

  if (error) throw error;
  return data as Ride;
}

export async function cancelRide(token: string): Promise<boolean> {
  const { error } = await supabase
    .from("rides")
    .update({ status: "cancelled" })
    .eq("manage_token", token);

  if (error) throw error;
  return true;
}
