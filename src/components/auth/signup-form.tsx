'use client'

import { SignUp } from "@clerk/nextjs"
import { useTheme } from "next-themes"

export function SignupForm() {
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
      
      // Primary button (Sign Up)
      formButtonPrimary: `
        bg-primary hover:bg-primary/90 text-primary-foreground
        border-0 font-medium transition-colors duration-200
        ${theme === 'dark' 
          ? 'bg-copywrit-cream hover:bg-copywrit-cream/90 text-copywrit-navy' 
          : 'bg-copywrit-navy hover:bg-copywrit-navy/90 text-copywrit-cream'
        }
      `,
      
      // Secondary button (Sign In link)
      formButtonSecondary: `
        text-accent hover:text-accent/80 font-medium
        hover:bg-accent/10 transition-colors duration-200
      `,
      
      // Links
      footerActionLink: "text-accent hover:text-accent/80 font-medium transition-colors",
      identityPreviewEditButton: "text-accent hover:text-accent/80",
      
      // Divider
      dividerLine: "bg-border",
      dividerText: "text-muted-foreground",
      
      // Social buttons (if enabled)
      socialButtonsBlockButton: `
        border-border hover:bg-accent/10 text-foreground
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
      footer: "hidden!",
      footerText: "text-muted-foreground text-sm",
      
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
      
      // Verification code input
      formFieldInput__emailAddress: `
        bg-input border-border text-foreground 
        focus:ring-2 focus:ring-ring focus:border-transparent
      `,
      
      // Password requirements
      passwordRequirementsText: "text-muted-foreground text-sm",
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
        <SignUp 
          appearance={appearance}
          signInUrl="/login"
        />
      </div>
    </div>
  )
}
