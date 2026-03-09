import Link from "next/link";

const blogPosts: Record<string, { title: string; date: string; content: string }> = {
  "hitchhikers-guide-to-new-zealand": {
    title: "A Hitchhiker's Guide to New Zealand",
    date: "2024-12-15",
    content: `
New Zealand is one of the friendliest countries in the world for getting around without your own car. Whether you're a backpacker on a budget or a local looking to save on fuel, ridesharing and hitchhiking have a proud tradition here in Aotearoa.

## The Golden Rules

**1. Be visible and safe.** Stand in a spot where drivers can see you well in advance and pull over safely. Petrol stations and town exits work great.

**2. Keep it light.** A small backpack is ideal. The less gear you carry, the easier it is for a driver to say yes.

**3. Be ready to wait.** Some stretches — especially on the South Island's West Coast — can be quiet. Bring a book, snacks, and patience.

**4. Always trust your gut.** If something feels off, it's okay to say no thanks.

## Best Routes for Ridesharing

The most popular rideshare routes in New Zealand follow the main highways:

- **Auckland ↔ Hamilton** — High traffic, easy to find rides
- **Wellington ↔ Palmerston North** — Uni students make this run constantly
- **Christchurch ↔ Queenstown** — Stunning drive through the Southern Alps
- **Tauranga ↔ Auckland** — Weekend warriors heading to the city
- **Dunedin ↔ Invercargill** — Quick southern hop

## The Kiwi Spirit

What makes New Zealand special is the people. Drivers will go out of their way to drop you exactly where you need to go, share their lunch, and tell you about the best hidden waterfalls along the way.

Ridesharing isn't just about transport — it's about connection. Every ride is a story waiting to happen.

## Getting Started

The easiest way to find or offer rides is right here on RideShare NZ. No sign-up required, no fees, just Kiwis helping Kiwis get where they need to go.
    `,
  },
  "why-ridesharing-beats-everything": {
    title: "Why Ridesharing Beats Everything",
    date: "2024-11-28",
    content: `
Let's be real — getting around New Zealand can be expensive. Petrol isn't cheap, buses are slow, and domestic flights hit different when you see the price tag. That's where ridesharing comes in.

## The Money Factor

A typical Auckland to Hamilton trip burns about $30-40 in fuel. Split that between 3 people and you're paying $10-13 each. Try finding a bus ticket for that price.

Ridesharing is almost always the cheapest option for intercity travel in New Zealand, and it's door-to-door — no waiting at a bus station on the edge of town.

## The Green Factor

New Zealand's clean, green image isn't just marketing — most Kiwis genuinely care about the environment. Every shared ride means one less car on the road, and that adds up fast.

A single rideshare trip from Wellington to Auckland saves roughly **45kg of CO₂** compared to everyone driving separately. Over a year, regular ridesharers can offset half a tonne of emissions just by sharing their commute.

## The Fun Factor

Here's the thing nobody talks about: ridesharing is genuinely enjoyable. You meet interesting people, hear amazing stories, discover new music, and sometimes make lifelong friends.

Some of the best conversations happen on the road between strangers who started as a driver and a passenger and ended as mates.

## The Practical Factor

- **Flexible timing** — Rides leave when it suits real people, not a bus company's schedule
- **Door-to-door** — Get picked up and dropped off where you actually need to be
- **Boot space** — Usually more room for luggage than a bus
- **No booking fees** — Direct communication with the driver

## How to Get Started

1. **Need a ride?** Browse available rides and message the driver directly
2. **Got spare seats?** Post your trip in 30 seconds — free, no sign-up needed
3. **Regular route?** Set up alerts and get notified when someone's heading your way

Ridesharing works best when the community is active, so whether you're driving or riding, jump in and give it a go.
    `,
  },
};

export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];

  if (!post) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h1>
        <Link href="/blog" className="text-teal-600 underline">
          Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/blog" className="text-teal-600 hover:text-teal-700 text-sm mb-6 inline-block">
          ← Back to blog
        </Link>

        <article>
          <p className="text-sm text-gray-400 mb-2">{post.date}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{post.title}</h1>

          <div className="prose prose-gray max-w-none">
            {post.content.split("\n\n").map((paragraph, i) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-2xl font-bold text-teal-800 mt-10 mb-4">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("**") && paragraph.includes(".**")) {
                return (
                  <p key={i} className="text-gray-700 mb-4 leading-relaxed">
                    <strong>{paragraph.match(/\*\*(.*?)\*\*/)?.[1]}</strong>
                    {paragraph.replace(/\*\*.*?\*\*/, "")}
                  </p>
                );
              }
              if (paragraph.startsWith("- ")) {
                return (
                  <ul key={i} className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                    {paragraph.split("\n").map((item, j) => (
                      <li key={j}>{item.replace(/^- \*\*/, "").replace(/\*\*/, ": ").replace("- ", "")}</li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.startsWith("1. ")) {
                return (
                  <ol key={i} className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                    {paragraph.split("\n").map((item, j) => (
                      <li key={j}>{item.replace(/^\d+\. \*\*/, "").replace(/\*\*/, ": ").replace(/^\d+\. /, "")}</li>
                    ))}
                  </ol>
                );
              }
              if (paragraph.trim()) {
                return (
                  <p key={i} className="text-gray-700 mb-4 leading-relaxed">
                    {paragraph.trim()}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </article>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-600 mb-4">Ready to share the journey?</p>
          <Link
            href="/rides"
            className="inline-block bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Find a Ride
          </Link>
        </div>
      </div>
    </div>
  );
}
