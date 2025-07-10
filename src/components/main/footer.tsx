import Link from "next/link";

export default function Footer() {
    return (
      <footer className="text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <h3 className="font-bold text-lg mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Press
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Security
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Roadmap
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Guides
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Support
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      API
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-300 hover:text-white">
                      Licenses
                    </Link>
                  </li>
                </ul>
              </div>
             </div> */}
            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <Link href="/" className="font-bold text-xl text-[#f1faee]">
                  Copywrit.ai
                </Link>
                <p className="text-gray-400 text-sm mt-2">
                  © {new Date().getFullYear()} Copywrit.ai LLC, All rights reserved.
                </p>
              </div>
              <div className="flex space-x-6">
                <Link href="https://x.com/copywritai" target="_blank" className="text-[#f1faee] hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="https://www.tiktok.com/@copywritai" target="_blank" className="text-[#f1faee] hover:text-white">
                  <span className="sr-only">TikTok</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M38.0766847,15.8542954 C36.0693906,15.7935177 34.2504839,14.8341149 32.8791434,13.5466056 C32.1316475,12.8317108 31.540171,11.9694126 31.1415066,11.0151329 C30.7426093,10.0603874 30.5453728,9.03391952 30.5619062,8 L24.9731521,8 L24.9731521,28.8295196 C24.9731521,32.3434487 22.8773693,34.4182737 20.2765028,34.4182737 C19.6505623,34.4320127 19.0283477,34.3209362 18.4461858,34.0908659 C17.8640239,33.8612612 17.3337909,33.5175528 16.8862248,33.0797671 C16.4386588,32.6422142 16.0833071,32.1196657 15.8404292,31.5426268 C15.5977841,30.9658208 15.4727358,30.3459348 15.4727358,29.7202272 C15.4727358,29.0940539 15.5977841,28.4746337 15.8404292,27.8978277 C16.0833071,27.3207888 16.4386588,26.7980074 16.8862248,26.3604545 C17.3337909,25.9229017 17.8640239,25.5791933 18.4461858,25.3491229 C19.0283477,25.1192854 19.6505623,25.0084418 20.2765028,25.0219479 C20.7939283,25.0263724 21.3069293,25.1167239 21.794781,25.2902081 L21.794781,19.5985278 C21.2957518,19.4900128 20.7869423,19.436221 20.2765028,19.4380839 C18.2431278,19.4392483 16.2560928,20.0426009 14.5659604,21.1729264 C12.875828,22.303019 11.5587449,23.9090873 10.7814424,25.7878401 C10.003907,27.666593 9.80084889,29.7339663 10.1981162,31.7275214 C10.5953834,33.7217752 11.5748126,35.5530237 13.0129853,36.9904978 C14.4509252,38.4277391 16.2828722,39.4064696 18.277126,39.8028054 C20.2711469,40.1991413 22.3382874,39.9951517 24.2163416,39.2169177 C26.0948616,38.4384508 27.7002312,37.1209021 28.8296253,35.4300711 C29.9592522,33.7397058 30.5619062,31.7522051 30.5619062,29.7188301 L30.5619062,18.8324027 C32.7275484,20.3418321 35.3149087,21.0404263 38.0766847,21.0867664 L38.0766847,15.8542954 Z" />
                  </svg>
                </Link>
                <Link href="https://www.linkedin.com/company/copywritai/" target="_blank" className="text-[#f1faee] hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
}