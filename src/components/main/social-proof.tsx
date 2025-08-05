import Image from "next/image";

export default function SocialProof() {
  return (
    <section className="py-16 bg-gradient-to-r from-gray-800 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white">
                Trusted by innovative teams worldwide
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                    <Image
                      src={`/copywrit.ai_logo_svg_main_header.svg`}
                      alt={`Company ${i}`}
                      width={160}
                      height={80}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-16 grid md:grid-cols-3 gap-8">
                {[
                  {
                    quote: "This platform has completely transformed how our team collaborates.",
                    author: "Sarah Johnson",
                    role: "Product Manager, TechCorp",
                  },
                  {
                    quote: "We've seen a 40% increase in productivity since implementing this solution.",
                    author: "Michael Chen",
                    role: "CTO, StartupX",
                  },
                  {
                    quote: "The intuitive interface made onboarding our team incredibly simple.",
                    author: "Emma Rodriguez",
                    role: "Operations Director, EnterpriseY",
                  },
                ].map((testimonial, i) => (
                  <div key={i} className="bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-600">
                    <p className="text-gray-200 mb-4">&quot;{testimonial.quote}&quot;</p>
                    <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {testimonial.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{testimonial.author}</p>
                          <p className="text-sm text-gray-400">{testimonial.role}</p>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
  )
}