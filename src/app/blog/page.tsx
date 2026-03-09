import Link from "next/link";

const posts = [
  {
    slug: "hitchhikers-guide-to-new-zealand",
    title: "A Hitchhiker's Guide to New Zealand",
    excerpt:
      "From the top of the North Island to the bottom of the South — tips, stories, and everything you need to know about getting around Aotearoa on a budget.",
    date: "2024-12-15",
    readTime: "6 min read",
  },
  {
    slug: "why-ridesharing-beats-everything",
    title: "Why Ridesharing Beats Everything",
    excerpt:
      "Cheaper than buses, greener than flying, and way more fun than driving alone. Here's why ridesharing is the smartest way to travel New Zealand.",
    date: "2024-11-28",
    readTime: "4 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-teal-800 mb-2">Blog</h1>
        <p className="text-gray-600 mb-10">Stories, tips, and thoughts on ridesharing in NZ.</p>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <p className="text-sm text-gray-400 mb-2">
                {post.date} · {post.readTime}
              </p>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
              <p className="text-gray-600">{post.excerpt}</p>
              <span className="text-teal-600 text-sm font-medium mt-3 inline-block">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
