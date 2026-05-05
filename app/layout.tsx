import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Mono } from "next/font/google"
import "./globals.css"
import { ScrollToTop } from "@/components/shared/ScrollToTop"
import { ScrollToTopButton } from "@/components/shared/ScrollToTopButton"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from '@clerk/nextjs'
import { ConvexClientProvider } from "@/components/convex-provider"
import { ConvexErrorBoundary } from "@/components/convex/ConvexErrorBoundary"
import { UserProvider } from "@/components/auth/UserProvider"
import { ToastProvider } from "@/components/toast-context"
import { CustomToastProvider } from "@/components/custom-toast-provider"
import { AuthErrorBoundary } from "@/components/auth/AuthErrorBoundary"

// Dynamic rendering handled per page as needed

// Optimize CSS loading
export const metadata: Metadata = {
  title: "Ankara Bubble - AI-Powered Fashion Platform",
  description: "Connect with skilled tailors specializing in vibrant Ankara fashion",
  generator: 'v0.app',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Ankara Bubble',
  },
}

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-mono" })

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ea580c',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${spaceMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {/* Suppress CAPTCHA-related console errors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const originalError = console.error;
                console.error = function(...args) {
                  const message = args.join(' ');
                  // Suppress CAPTCHA-related warnings
                  if (message.includes('Cannot initialize Smart CAPTCHA widget') || 
                      message.includes('clerk-captcha') ||
                      message.includes('falling back to Invisible CAPTCHA')) {
                    return;
                  }
                  // Suppress sandboxed frame warnings
                  if (message.includes('Blocked script execution') && 
                      message.includes('sandboxed')) {
                    return;
                  }
                  // Call original error function for other errors
                  originalError.apply(console, args);
                };
              })();
            `,
          }}
        />
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: '#ea580c'
        },
        elements: {
          formButtonPrimary: 'bg-orange-600 hover:bg-orange-700 text-white',
          card: 'bg-white shadow-lg border border-gray-200',
          headerTitle: 'text-gray-900',
          headerSubtitle: 'text-gray-600',
          socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
          formFieldInput: 'border border-gray-300 focus:border-orange-500 focus:ring-orange-500',
          footerActionLink: 'text-orange-600 hover:text-orange-700',
        }
      }}
      localization={{
        locale: 'en'
      }}
    >
      <ConvexClientProvider>
            <ConvexErrorBoundary>
            <ThemeProvider
              defaultTheme="system"
              storageKey="ankara-bubble-theme"
            >
              <AuthErrorBoundary>
                <UserProvider>
                  <ToastProvider>
                    <ScrollToTop />
                    {children}
                    <ScrollToTopButton />
                    <CustomToastProvider />
                  </ToastProvider>
                </UserProvider>
              </AuthErrorBoundary>
            </ThemeProvider>
            </ConvexErrorBoundary>
          </ConvexClientProvider>
        </ClerkProvider>
            
            {/* Service Worker Registration */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  if ('serviceWorker' in navigator) {
                    window.addEventListener('load', function() {
                      navigator.serviceWorker.register('/sw.js')
                        .then(function(registration) {
                      // Service worker registered successfully
                        })
                        .catch(function(registrationError) {
                      // Service worker registration failed
                    });
                });
              }
                `,
              }}
            />
          </body>
        </html>
  )
}