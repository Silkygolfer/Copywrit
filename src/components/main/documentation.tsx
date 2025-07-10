import { Button } from "@/components/ui/button";

export default function Documentation() {
  return (
    <section id="docs" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                    Comprehensive documentation to get you started
                  </h2>
                  <p className="text-lg text-gray-300 mb-8">
                    Our detailed documentation covers everything from basic setup to advanced features, ensuring you can
                    make the most of our platform.
                  </p>
                  <div className="space-y-4">
                    {["Quick Start Guide", "API Reference", "Integration Tutorials", "Best Practices"].map(
                      (item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                            <span className="font-medium text-white">{i + 1}</span>
                          </div>
                          <span className="font-medium text-white">{item}</span>
                        </div>
                      ),
                    )}
                  </div>
                  <Button className="mt-8" variant="outline">
                    Browse Documentation
                  </Button>
                </div>
                <div className="bg-gray-700 rounded-2xl shadow-lg border border-gray-600 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="ml-2 text-sm font-mono text-gray-300">documentation.md</div>
                    </div>
                    <div className="space-y-2 font-mono text-sm">
                                              <p className="text-gray-200"># Getting Started</p>
                        <p className="text-gray-300">Install the package using npm:</p>
                        <div className="bg-gray-800 p-2 rounded text-gray-200">npm install @company/package</div>
                        <p className="text-gray-300 mt-4">Initialize with your API key:</p>
                        <div className="bg-gray-800 p-2 rounded text-gray-200">
                        <span className="text-purple-600">import</span> {`{ initialize }`}{" "}
                        <span className="text-purple-600">from</span>{" "}
                        <span className="text-green-600">'@company/package'</span>;
                        <br />
                        <br />
                        initialize({`{ apiKey: 'YOUR_API_KEY' }`});
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  )
}