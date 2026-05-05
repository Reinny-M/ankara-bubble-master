"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo, LogoSVG, LogoCompact, LogoFavicon } from './Logo'

export function LogoShowcase() {
  return (
    <div className="space-y-8 p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">
          Ankara Bubble Logo System
        </h1>
        <p className="text-stone-600 dark:text-stone-400">
          Professional logo design for the Ankara fashion platform
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Full Logo Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Full Logo</CardTitle>
            <CardDescription>Complete logo with icon and text</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Logo size="sm" variant="full" />
              <span className="text-sm text-stone-600 dark:text-stone-400">Small</span>
            </div>
            <div className="flex items-center gap-4">
              <Logo size="md" variant="full" />
              <span className="text-sm text-stone-600 dark:text-stone-400">Medium</span>
            </div>
            <div className="flex items-center gap-4">
              <Logo size="lg" variant="full" />
              <span className="text-sm text-stone-600 dark:text-stone-400">Large</span>
            </div>
            <div className="flex items-center gap-4">
              <Logo size="xl" variant="full" />
              <span className="text-sm text-stone-600 dark:text-stone-400">Extra Large</span>
            </div>
          </CardContent>
        </Card>

        {/* Icon Only Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Icon Only</CardTitle>
            <CardDescription>Logo icon without text</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Logo size="sm" variant="icon" />
              <span className="text-sm text-stone-600 dark:text-stone-400">Small</span>
            </div>
            <div className="flex items-center gap-4">
              <Logo size="md" variant="icon" />
              <span className="text-sm text-stone-600 dark:text-stone-400">Medium</span>
            </div>
            <div className="flex items-center gap-4">
              <Logo size="lg" variant="icon" />
              <span className="text-sm text-stone-600 dark:text-stone-400">Large</span>
            </div>
            <div className="flex items-center gap-4">
              <Logo size="xl" variant="icon" />
              <span className="text-sm text-stone-600 dark:text-stone-400">Extra Large</span>
            </div>
          </CardContent>
        </Card>

        {/* Text Only Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Text Only</CardTitle>
            <CardDescription>Logo text without icon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Logo size="sm" variant="text" />
              <span className="text-sm text-stone-600 dark:text-stone-400">Small</span>
            </div>
            <div className="flex items-center gap-4">
              <Logo size="md" variant="text" />
              <span className="text-sm text-stone-600 dark:text-stone-400">Medium</span>
            </div>
            <div className="flex items-center gap-4">
              <Logo size="lg" variant="text" />
              <span className="text-sm text-stone-600 dark:text-stone-400">Large</span>
            </div>
            <div className="flex items-center gap-4">
              <Logo size="xl" variant="text" />
              <span className="text-sm text-stone-600 dark:text-stone-400">Extra Large</span>
            </div>
          </CardContent>
        </Card>

        {/* SVG Logo Variants */}
        <Card>
          <CardHeader>
            <CardTitle>SVG Logo</CardTitle>
            <CardDescription>Scalable vector graphics version</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <LogoSVG size="sm" variant="full" />
              <span className="text-sm text-stone-600 dark:text-stone-400">Small</span>
            </div>
            <div className="flex items-center gap-4">
              <LogoSVG size="md" variant="full" />
              <span className="text-sm text-stone-600 dark:text-stone-400">Medium</span>
            </div>
            <div className="flex items-center gap-4">
              <LogoSVG size="lg" variant="full" />
              <span className="text-sm text-stone-600 dark:text-stone-400">Large</span>
            </div>
            <div className="flex items-center gap-4">
              <LogoSVG size="xl" variant="full" />
              <span className="text-sm text-stone-600 dark:text-stone-400">Extra Large</span>
            </div>
          </CardContent>
        </Card>

        {/* Compact Logo */}
        <Card>
          <CardHeader>
            <CardTitle>Compact Logo</CardTitle>
            <CardDescription>Space-efficient version for small areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <LogoCompact />
              <span className="text-sm text-stone-600 dark:text-stone-400">Compact</span>
            </div>
          </CardContent>
        </Card>

        {/* Favicon Logo */}
        <Card>
          <CardHeader>
            <CardTitle>Favicon Logo</CardTitle>
            <CardDescription>Browser tab icon version</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <LogoFavicon />
              <span className="text-sm text-stone-600 dark:text-stone-400">Favicon</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>How the logo appears in different contexts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header Example */}
          <div className="border border-stone-200 dark:border-stone-700 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Website Header</h4>
            <div className="flex items-center justify-between">
              <Logo size="md" variant="full" />
              <nav className="flex gap-4 text-sm">
                <a href="#" className="text-stone-600 hover:text-stone-900">Features</a>
                <a href="#" className="text-stone-600 hover:text-stone-900">About</a>
                <a href="#" className="text-stone-600 hover:text-stone-900">Contact</a>
              </nav>
            </div>
          </div>

          {/* Dashboard Example */}
          <div className="border border-stone-200 dark:border-stone-700 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Dashboard Sidebar</h4>
            <div className="flex items-center gap-3">
              <Logo size="md" variant="icon" />
              <div>
                <h3 className="font-bold text-stone-900 dark:text-stone-100">Ankara Bubble</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">Client Portal</p>
              </div>
            </div>
          </div>

          {/* Mobile Example */}
          <div className="border border-stone-200 dark:border-stone-700 rounded-lg p-4">
            <h4 className="font-semibold mb-3">Mobile Header</h4>
            <div className="flex items-center justify-between">
              <LogoCompact />
              <button className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800">
                <span className="text-sm">Menu</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Design Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Design Guidelines</CardTitle>
          <CardDescription>Logo usage and brand guidelines</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Colors</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-orange-500"></div>
                  <span className="text-sm">Primary Orange (#ea580c)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-600"></div>
                  <span className="text-sm">Secondary Red (#dc2626)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-stone-900"></div>
                  <span className="text-sm">Text Dark (#1c1917)</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Typography</h4>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-bold">Ankara</span> - Bold, tracking-tight
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-orange-600">Bubble</span> - Semibold, tracking-wide
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
