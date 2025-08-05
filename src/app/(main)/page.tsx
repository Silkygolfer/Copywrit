"use client"

// import Link from "next/link"
// import Image from "next/image"
// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
// } from "@/components/ui/navigation-menu"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
import Header from "@/components/main/header"
import Hero from "@/components/main/hero"
import Waitlist from "@/components/main/waitlist"
import Footer from "@/components/main/footer"
// import SocialProof from "@/components/main/social-proof"
// import Documentation from "@/components/main/documentation"
// import Pricing from "@/components/main/pricing"
// import ContactUs from "@/components/main/contact-us"

export default function HomePage() {

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const computedStyle = window.getComputedStyle(element)
      const paddingTop = parseInt(computedStyle.paddingTop, 10) || 0
      const elementTop = element.offsetTop - paddingTop
      
      window.scrollTo({
        top: elementTop,
        behavior: "smooth"
      })
    }
  }  

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-copywrit-blue to-copywrit-navy">
      {/* Sticky Header */}
      <Header scrollToSection={scrollToSection} />
      
      <main className="flex-1">

        {/* Hero Section */}
        <Hero />
  

        {/* Social Proof Section */}
        {/* <SocialProof /> */}

        {/* Pricing Section */}
        {/* <Pricing /> */}

        {/* Docs Section */}
        {/* <Documentation /> */}

        {/* Waitlist Section */}
        <Waitlist />
        

        {/* Contact Section */}
        {/* <ContactUs /> */}
        
      </main>


      {/* Footer */}
      <Footer />
      
    </div>
  )
}
