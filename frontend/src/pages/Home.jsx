import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cake, ImageOff, Search, Sparkles, Store, Truck, ShieldCheck, ArrowRight, Star } from 'lucide-react'
import Button from '../components/ui/Button'
import PhotoBackdrop from '../components/ui/PhotoBackdrop'
import { publicProductService } from '../services/publicProductService'
import PHOTO, { unsplash } from '../data/photos'

const perks = [
  {
    icon: Sparkles,
    title: 'Made to order',
    body: 'Pick the flavor, shape, size and message — every cake is baked around your order.',
  },
  {
    icon: Store,
    title: 'Local home bakers',
    body: 'Every shop on CakeShop is a real vendor you can message and follow.',
  },
  {
    icon: Truck,
    title: 'Track your order',
    body: 'Follow your cake from confirmed to baked to delivered, right from your account.',
  },
  {
    icon: ShieldCheck,
    title: 'Approved listings',
    body: 'Every product is reviewed before it goes live, so what you see is what you get.',
  },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    publicProductService
      .browse({ sortBy: 'createdAt', direction: 'desc', size: 6, page: 0 })
      .then((res) => active && setFeatured(res.content))
      .catch(() => {})
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      {/* Hero — full-bleed cake photography with a glass content panel */}
      <section className="relative overflow-hidden min-h-[640px] flex items-center py-28">
        <PhotoBackdrop src={unsplash(PHOTO.chocolateCake, { w: 2000, h: 1400 })} />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 w-full">
          <div className="glass rounded-[2rem] px-6 sm:px-12 py-10 sm:py-14 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream/80 px-3 py-1.5 text-xs font-semibold text-berry-dark shadow-sm">
              <Cake size={14} />
              Freshly baked, near you
            </span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl font-semibold text-cocoa leading-tight text-balance">
              Custom cakes,
              <br />
              baked by hand.
            </h1>
            <p className="mt-4 text-cocoa-soft max-w-md">
              Browse cakes from local bakers, customize the flavor and message, and order — no
              account needed until you're ready to check out.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/products">
                <Button>
                  <Search size={16} />
                  Browse cakes
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" className="bg-cream/70 backdrop-blur">
                  <Store size={16} />
                  Sell on CakeShop
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating glass rating chip, echoing the "years of excellence" badge
              on classic bakery templates but sized down and unobtrusive. */}
          <div className="glass hidden sm:flex items-center gap-3 rounded-2xl px-4 py-3 absolute right-4 sm:right-10 bottom-8 sm:bottom-12">
            <span className="grid place-items-center w-10 h-10 rounded-full bg-berry text-cream text-sm font-bold">
              <Star size={16} className="fill-cream" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-cocoa">4.9 out of 5</p>
              <p className="text-xs text-cocoa-soft">from 1,200+ orders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Perks — glass cards over a soft second photo band */}
      <section className="relative py-20 overflow-hidden">
        <PhotoBackdrop src={unsplash(PHOTO.cupcakes, { w: 2000, h: 900 })} overlay={false} />
        <div className="absolute inset-0 -z-10 bg-cream/88" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {perks.map(({ icon: Icon, title, body }) => (
              <div key={title} className="glass rounded-2xl p-5">
                <span className="grid place-items-center w-10 h-10 rounded-full bg-blush text-berry-dark">
                  <Icon size={18} />
                </span>
                <h3 className="mt-3 font-display font-semibold text-cocoa">{title}</h3>
                <p className="mt-1 text-sm text-cocoa-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured cakes */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-8 pb-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-cocoa">Freshly listed</h2>
            <p className="text-sm text-cocoa-soft">A taste of what's on the menu right now.</p>
          </div>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-berry hover:text-berry-dark"
          >
            See all cakes
            <ArrowRight size={15} />
          </Link>
        </div>

        {loading ? (
          <p className="py-10 text-center text-cocoa-soft">Loading cakes…</p>
        ) : featured.length === 0 ? (
          <p className="py-10 text-center text-cocoa-soft">No cakes listed yet — check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="group rounded-2xl bg-card/80 backdrop-blur border border-white/60 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="relative aspect-[4/3] bg-blush-soft grid place-items-center overflow-hidden">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <ImageOff size={28} className="text-cocoa-soft" />
                  )}
                  <span className="glass-dark absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-cream">
                    ₹{Number(p.basePrice).toFixed(2)}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs text-cocoa-soft">{p.subcategoryName}</p>
                  <h3 className="font-display font-semibold text-cocoa mt-0.5">{p.name}</h3>
                  <p className="mt-2 text-xs text-cocoa-soft">{p.vendorShopName}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center sm:hidden">
          <Link to="/products">
            <Button variant="secondary">
              See all cakes
              <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA banner — photo background with a glass panel */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div className="relative rounded-3xl overflow-hidden">
          <PhotoBackdrop src={unsplash(PHOTO.weddingCake, { w: 1800, h: 700 })} />
          <div className="relative glass rounded-3xl px-6 sm:px-12 py-12 text-center m-3 sm:m-4">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-cocoa">
              Have a cake stall of your own?
            </h2>
            <p className="mt-2 text-cocoa-soft max-w-lg mx-auto">
              List your cakes, manage orders, and reach customers browsing CakeShop — signing up
              takes a minute.
            </p>
            <Link to="/register" className="mt-6 inline-block">
              <Button>
                <Store size={16} />
                Start selling
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
