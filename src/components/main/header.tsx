import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Header({ scrollToSection }: { scrollToSection: (id: string) => void }) {

    

    return (
        <header id="header" className="sticky top-0 z-50 w-full py-4">
        <div className="container mx-auto px-4">
          <nav className="fixed top-[34.77px] left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-[95%] max-w-[1049.95px] min-w-[320px] h-[58px] px-3 sm:px-[14px] py-[5.63px] bg-[rgba(255,255,255,0.23)] border-[0.993332px] border-solid border-[rgba(112,99,246,0.36)] shadow-[inset_0px_8.60888px_25.4624px_rgba(255,255,255,0.5)] backdrop-blur-[7px] rounded-[33.1111px] transition-all duration-200">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="font-bold text-xl">
              <Image src="/Copywrit - Creme.svg" alt="Copywrit.ai" width={100} height={100} />
            </button>
            <NavigationMenu>
              <NavigationMenuList>
                {/* <NavigationMenuItem>
                   <NavigationMenuLink
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-md cursor-pointer"
                    onClick={() => scrollToSection("pricing")}
                  >
                    Pricing
                  </NavigationMenuLink>
                </NavigationMenuItem> */}
                {/* <NavigationMenuItem>
                  <NavigationMenuLink
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-md cursor-pointer"
                    onClick={() => scrollToSection("contact")}
                  >
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-md cursor-pointer"
                    onClick={() => scrollToSection("docs")}
                  >
                    Docs
                  </NavigationMenuLink>
                </NavigationMenuItem> */}
                <NavigationMenuItem>
                  <Button onClick={() => scrollToSection("waitlist")} size="sm" className="ml-2 bg-[#457b9d] text-[#f1faee] hover:bg-[#1d3557]">
                    Join Waitlist
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>
      </header> 
    )
}