import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
                <span className="font-mono text-lg font-bold text-white">AB</span>
              </div>
              <span className="font-mono text-lg font-bold text-stone-900 dark:text-stone-100">Ankara Bubble</span>
            </Link>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              AI-powered platform connecting fashion enthusiasts with skilled Ankara tailors across Africa.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-stone-900 dark:text-stone-100">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/client/dashboard" className="text-stone-600 hover:text-orange-600 dark:text-stone-400">
                  For Clients
                </Link>
              </li>
              <li>
                <Link href="/tailor/dashboard" className="text-stone-600 hover:text-orange-600 dark:text-stone-400">
                  For Tailors
                </Link>
              </li>
              <li>
                <Link href="/explore/designs" className="text-stone-600 hover:text-orange-600 dark:text-stone-400">
                  Browse Designs
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-stone-600 hover:text-orange-600 dark:text-stone-400">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-stone-900 dark:text-stone-100">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-stone-600 hover:text-orange-600 dark:text-stone-400">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-stone-600 hover:text-orange-600 dark:text-stone-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-stone-600 hover:text-orange-600 dark:text-stone-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-stone-600 hover:text-orange-600 dark:text-stone-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-stone-600 hover:text-orange-600 dark:text-stone-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-stone-900 dark:text-stone-100">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <Mail className="h-4 w-4" />
                <span>hello@ankarabubble.com</span>
              </li>
              <li className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <Phone className="h-4 w-4" />
                <span>+254 712 345 678</span>
              </li>
              <li className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                <MapPin className="h-4 w-4" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-200 pt-8 dark:border-stone-800">
          <p className="text-center text-sm text-stone-600 dark:text-stone-400">
            © {new Date().getFullYear()} Ankara Bubble. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
