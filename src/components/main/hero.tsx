import Image from "next/image"

export default function Hero() {
    return (
        <section className="py-20 sm:py-24 md:py-28 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center max-w-7xl mx-auto">
              <div className="text-center md:text-left order-2 md:order-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter mb-4 sm:mb-6 text-[#f1faee]">
                  Write <span className="italic font-extrabold">on-brand</span> copy in minutes
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-[#f1faee]/80 mb-6 sm:mb-8 max-w-md mx-auto md:mx-0">
                  Create compelling, consistent copy that matches your brand voice in just minutes, not hours.
                </p>
                {/* <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button size="lg" className="gap-2">
                    Get Started <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Book a Demo
                  </Button>
                </div> */}
              </div>
              <div className="order-1 md:order-2">
                <div className="bg-gradient-to-tr from-[#a8dadc] to-[#54768b] p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg border border-gray-600 max-w-lg mx-auto md:max-w-none">
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=720&width=1280"
                      alt="Product demo"
                      width={640}
                      height={360}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    )
}