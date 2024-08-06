import { Inter } from 'next/font/google'
import '../ui/globals.css';
import StoreWrapper from '../ui/StoreWrapper';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Homedecor Admin Panel',
  description: 'Next.js Tutorial',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <StoreWrapper>
        <body className={inter.className}>{children}</body>
      </StoreWrapper>
    </html>
  )
}
