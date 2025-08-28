import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import ThemeToggle from "./components/ThemeToggle";

export const metadata: Metadata = {
  title: "agriharvest - Fresh from the Farm",
  description: "Connecting farmers and buyers directly",
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Aggressively hide Next.js dev indicators
              (function() {
                function hideDevIndicators() {
                  const selectors = [
                    '[data-nextjs-dev-indicator]',
                    '.nextjs-dev-indicator',
                    '[data-nextjs-dev-indicator-position]',
                    '[class*="nextjs"]',
                    '[data-*="nextjs"]'
                  ];
                  
                  selectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                      el.style.display = 'none';
                      el.style.visibility = 'hidden';
                      el.style.opacity = '0';
                      el.style.pointerEvents = 'none';
                      el.style.position = 'absolute';
                      el.style.left = '-9999px';
                      el.style.top = '-9999px';
                    });
                  });
                }
                
                // Run immediately
                hideDevIndicators();
                
                // Run after DOM is ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', hideDevIndicators);
                }
                
                // Run after page load
                window.addEventListener('load', hideDevIndicators);
                
                // Run periodically to catch any new elements
                setInterval(hideDevIndicators, 1000);
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-[#fdf6e3] to-[#d2b48c] text-[#2d5016] antialiased transition-colors duration-300" suppressHydrationWarning>
        <header className="bg-white/90 backdrop-blur-sm border-b border-[#d2b48c] sticky top-0 z-50 shadow-md transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2d5016] to-[#8b4513] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                  🌾
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#f4d03f] rounded-full border-2 border-white"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-[#2d5016] to-[#8b4513] bg-clip-text text-transparent">
                  agriharvest
                </span>
                <span className="text-xs text-[#8b4513] -mt-1">Fresh from the Farm</span>
              </div>
            </Link>
            
            <nav className="text-sm flex items-center gap-6">
              <Link href="/" className="hover:text-[#8b4513] transition-colors duration-200 font-medium flex items-center gap-2">
                <span className="text-lg">🏪</span>
                Marketplace
              </Link>
              <Link href="/admin" className="bg-gradient-to-r from-[#2d5016] to-[#8b4513] text-white px-6 py-3 rounded-xl hover:from-[#8b4513] hover:to-[#2d5016] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
                <span className="text-lg">👨‍🌾</span>
                Admin
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        
        <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
        
        <footer className="mt-16 bg-white/90 backdrop-blur-sm border-t border-[#d2b48c] shadow-inner transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-4 py-8 text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-2xl">🌾</span>
              <span className="text-2xl">🚜</span>
              <span className="text-2xl">🌱</span>
              <span className="text-2xl">🐄</span>
            </div>
            <p className="text-sm text-[#8b4513] mb-2">
              © {new Date().getFullYear()} agriharvest - Connecting farmers and buyers directly
            </p>
            <p className="text-xs text-[#d2b48c]">
              Built with ❤️ for the agricultural community
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}