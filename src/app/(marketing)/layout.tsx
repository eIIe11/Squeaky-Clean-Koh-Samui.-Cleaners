import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { NaturalProductsBanner } from '@/components/layout/natural-banner'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NaturalProductsBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
