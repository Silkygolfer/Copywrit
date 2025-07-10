'use client'

import { SignIn } from "@clerk/nextjs"
import { useTheme } from "next-themes"

export function LoginForm() {
  const { theme } = useTheme()
  
  const appearance = {
    elements: {
      // Main form container
      formContainer: `
        shadow-lg border border-border bg-card/80 backdrop-blur-sm
        ${theme === 'dark' ? 'shadow-black/20' : 'shadow-copywrit-navy/10'}
      `,
      
      // Card styling
      card: `
        bg-card border-border shadow-none
        ${theme === 'dark' ? 'bg-card/95' : 'bg-white/95'}
      `,
      
      // Header
      headerTitle: "text-foreground font-semibold text-xl",
      headerSubtitle: "text-muted-foreground",
      
      // Form fields
      formFieldInput: `
        bg-input border-border text-foreground 
        placeholder:text-muted-foreground
        focus:ring-2 focus:ring-ring focus:border-transparent
        ${theme === 'dark' 
          ? 'bg-background/50 border-border' 
          : 'bg-white border-border'
        }
      `,
      
      formFieldLabel: "text-foreground font-medium",
      
      // Primary button (Sign In)
      formButtonPrimary: `
        bg-copywrit-cream hover:bg-copywrit-cream/90 text-copywrit-navy
        border-0 font-medium transition-colors duration-200
        ${theme === 'dark' 
          ? 'bg-copywrit-cream hover:bg-copywrit-cream/90 text-copywrit-navy' 
          : 'bg-copywrit-navy hover:bg-copywrit-navy/90 text-copywrit-cream'
        }
      `,
      
      // Secondary button (Sign Up link)
      formButtonSecondary: "hidden",
      
      // Links
      footerActionLink: "hidden",
      identityPreviewEditButton: "text-accent hover:text-accent/80",
      
      // Divider
      dividerLine: "bg-border",
      dividerText: "text-muted-foreground",
      
      // Social buttons (if enabled)
      socialButtonsBlockButton: `
        border-border bg-copywrit-blue! hover:bg-copywrit-blue/90! text-copywrit-cream!
        transition-colors duration-200
        ${theme === 'dark' 
          ? 'hover:bg-copywrit-blue/20' 
          : 'hover:bg-copywrit-teal/20'
        }
      `,
      
      // Error messages
      formFieldErrorText: "text-destructive",
      
      // Input focus
      formFieldInputShowPasswordButton: "text-muted-foreground hover:text-foreground",
      
      // Loading states
      formButtonPrimaryLoading: "bg-primary/80",
      
      // Footer
      footer: "hidden",
      footerText: "hidden",
      
      // OTP/Verification
      formFieldInput__identifier: `
        bg-input border-border text-foreground 
        focus:ring-2 focus:ring-ring focus:border-transparent
      `,
      
      // Phone input
      formFieldInput__phoneNumber: `
        bg-input border-border text-foreground 
        focus:ring-2 focus:ring-ring focus:border-transparent
      `,
      
      // Alternative methods
      alternativeMethodsBlockButton: `
        border-border hover:bg-accent/10 text-foreground
        transition-colors duration-200
      `,
      
            // More specific elements to hide signup section
      footerAction: "hidden",
      footerActionText: "hidden",
      footerActionButton: "hidden",
      footerActions: "hidden",
      signUpLink: "hidden!",
      footerPageLink: "hidden!",
      "footerAction__signIn": "hidden!",
      

    },
    
    variables: {
      // Color variables that adapt to theme
      colorPrimary: theme === 'dark' ? '#f1faee' : '#1d3557', // copywrit-cream in dark, copywrit-navy in light
      colorBackground: theme === 'dark' ? '#1d3557' : '#f1faee', // copywrit-navy in dark, copywrit-cream in light
      colorText: theme === 'dark' ? '#f1faee' : '#1d3557',
      colorTextSecondary: theme === 'dark' ? '#a8dadc' : '#457b9d', // copywrit-teal in dark, copywrit-blue in light
      colorDanger: '#e63946', // copywrit-red
      colorSuccess: '#457b9d', // copywrit-blue
      colorWarning: '#a8dadc', // copywrit-teal
      colorNeutral: theme === 'dark' ? '#457b9d' : '#a8dadc',
      
      // Border radius
      borderRadius: '0.625rem', // matches --radius
      
      // Spacing
      spacingUnit: '1rem',
      
      // Font
      fontFamily: 'inherit', // Use your Geist Sans font
      fontSize: '0.875rem',
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[500px] p-4">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={appearance}
          signUpUrl={undefined}
          forceRedirectUrl={'http://localhost:3000/chat'}
        />
      </div>
    </div>
  )
}
