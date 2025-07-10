import { Check, X } from "lucide-react";
import { Button } from "../ui/button";

export default function Pricing() {
    return (
        <section id="pricing" className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Simple, transparent pricing</h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Choose the plan that's right for you and start improving your workflow today.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Starter",
                    price: "$29",
                    description: "Perfect for individuals and small teams just getting started.",
                    features: ["Up to 5 users", "Basic analytics", "24/7 support", "1GB storage"],
                    notIncluded: ["Advanced integrations", "Custom branding", "API access"],
                  },
                  {
                    name: "Professional",
                    price: "$79",
                    description: "Ideal for growing teams that need more power and flexibility.",
                    features: [
                      "Up to 20 users",
                      "Advanced analytics",
                      "24/7 priority support",
                      "10GB storage",
                      "Advanced integrations",
                      "Custom branding",
                    ],
                    notIncluded: ["API access"],
                    popular: true,
                  },
                  {
                    name: "Enterprise",
                    price: "$199",
                    description: "For organizations requiring maximum control and support.",
                    features: [
                      "Unlimited users",
                      "Enterprise analytics",
                      "Dedicated support",
                      "Unlimited storage",
                      "Advanced integrations",
                      "Custom branding",
                      "API access",
                      "SSO authentication",
                    ],
                    notIncluded: [],
                  },
                ].map((plan, i) => (
                  <div
                    key={i}
                    className={`relative rounded-2xl border ${
                      plan.popular ? "border-white shadow-lg bg-gray-800" : "border-gray-600 shadow-sm bg-gray-800"
                    } p-6 flex flex-col`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-0 right-0 flex justify-center">
                        <span className="bg-white text-black text-xs font-medium px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <p className="text-gray-300 mb-6">{plan.description}</p>
                    <div className="flex-1">
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-gray-200">{feature}</span>
                          </li>
                        ))}
                        {plan.notIncluded.map((feature, j) => (
                          <li key={j} className="flex items-start gap-2 text-gray-400">
                            <X className="h-5 w-5 text-gray-300 shrink-0 mt-0.5" />
                            <span className="text-gray-400">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      className={`w-full ${plan.popular ? "bg-white text-black hover:bg-gray-200" : "border-gray-500 text-white hover:bg-gray-700"}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
    )
}