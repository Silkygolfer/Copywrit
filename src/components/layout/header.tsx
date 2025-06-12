import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from '@/components/ui/navigation-menu'

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <NavigationMenu>
        <NavigationMenuList>
            <NavigationMenuItem>
            <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
            <NavigationMenuContent>
                <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
            </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}