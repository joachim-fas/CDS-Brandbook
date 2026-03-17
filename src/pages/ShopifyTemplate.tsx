import React, { useState } from 'react';
import { LogoSVG } from '../LogoSVG';
import { ShoppingBag, Search, Menu, X, Plus, Minus, ArrowRight, Download } from 'lucide-react';
import { generateShopifyTheme } from '../utils/shopifyThemeGenerator';

export function ShopifyTemplate() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'STATEMENT TEE 01', variant: 'BLACK / L', price: 45, quantity: 1, img: 'IMG' },
    { id: 2, name: 'HEAVY HOODIE', variant: 'ACID / XL', price: 89, quantity: 1, img: 'IMG' }
  ]);

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items => 
      items.map(item => {
        if (item.id === id) {
          const newQ = item.quantity + delta;
          return newQ > 0 ? { ...item, quantity: newQ } : item;
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleDownloadTheme = async () => {
    setIsDownloading(true);
    try {
      await generateShopifyTheme();
    } catch (error) {
      console.error("Failed to generate theme", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-bglight pt-16 font-mono"
      style={{ 
        backgroundImage: 'linear-gradient(90deg, transparent 100px, #ff9999 100px, #ff9999 102px, transparent 102px), linear-gradient(#e5e5e5 1px, transparent 1px)', 
        backgroundSize: '100% 40px' 
      }}
    >
      {/* Announcement Bar */}
      <div className="bg-brand text-asphalt py-2 text-center border-b-2 border-asphalt text-xs font-bold uppercase tracking-widest transition-colors duration-300">
        Free Shipping on all orders over €100 // Next Drop: Friday 18:00 CET
      </div>

      {/* Header */}
      <header className="bg-pure border-b-2 border-asphalt py-4 px-4 sm:px-6 lg:px-8 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left: Logo */}
          <div className="flex items-center justify-start gap-4 w-1/3">
            <a href="#" className="text-asphalt hover:text-brand transition-colors sm:hidden">
              <Menu size={24} />
            </a>
            <a href="#" className="w-32 text-asphalt hover:text-brand transition-colors block">
              <LogoSVG />
            </a>
          </div>
          
          {/* Center: Navigation Links */}
          <nav className="hidden sm:flex justify-center items-center gap-6 w-1/3">
            <a href="#" className="text-asphalt hover:text-brand transition-colors text-sm font-bold uppercase tracking-widest">Shop</a>
            <a href="#" className="text-asphalt hover:text-brand transition-colors text-sm font-bold uppercase tracking-widest">Collections</a>
            <a href="#" className="text-asphalt hover:text-brand transition-colors text-sm font-bold uppercase tracking-widest">About</a>
          </nav>

          {/* Right: Search, Account, Cart */}
          <div className="flex items-center justify-end gap-6 w-1/3">
            <a href="#" className="text-asphalt hover:text-brand transition-colors hidden sm:block">
              <Search size={24} />
            </a>
            <a href="#" className="text-asphalt hover:text-brand transition-colors text-sm font-bold uppercase tracking-widest hidden sm:block">
              Account
            </a>
            <a 
              href="#"
              className="text-asphalt hover:text-brand transition-colors relative"
              onClick={(e) => { e.preventDefault(); setIsCartOpen(true); }}
            >
              <ShoppingBag size={24} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand text-asphalt text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-asphalt">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </a>
          </div>
        </div>
      </header>

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-asphalt/40 backdrop-blur-sm z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Cart Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-pure border-l-4 border-asphalt z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b-4 border-asphalt flex justify-between items-center bg-brand transition-colors duration-300">
          <h2 className="font-headline text-3xl text-asphalt uppercase">Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-asphalt hover:scale-110 transition-transform">
            <X size={32} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-asphalt/50">
              <ShoppingBag size={48} className="mb-4 opacity-50" />
              <p className="font-bold uppercase tracking-widest">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex gap-4 border-2 border-asphalt p-3 shadow-[4px_4px_0_0_#111111] bg-bglight">
                <div className="w-24 h-32 bg-pure border-2 border-asphalt flex items-center justify-center font-headline text-2xl text-asphalt/20">
                  {item.img}
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-headline text-lg uppercase leading-tight">{item.name}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-asphalt/50 hover:text-brand transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-asphalt/60 mt-1">{item.variant}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border-2 border-asphalt bg-pure">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-brand hover:text-asphalt transition-colors">
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-brand hover:text-asphalt transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="font-bold text-lg">€{item.price * item.quantity}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t-4 border-asphalt bg-bglight">
          <div className="flex justify-between items-center mb-4 font-headline text-2xl uppercase">
            <span>Subtotal</span>
            <span>€{cartTotal}</span>
          </div>
          <p className="text-xs text-asphalt/60 mb-6 font-bold uppercase">Shipping & taxes calculated at checkout</p>
          <a href="#" className="w-full bg-brand text-asphalt font-headline tracking-widest text-xl px-6 py-5 font-bold uppercase border-4 border-asphalt shadow-[6px_6px_0_0_#111111] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#111111] transition-all flex justify-center items-center gap-2">
            Checkout <ArrowRight size={24} />
          </a>
        </div>
      </div>

      {/* Dawn: Image Banner */}
      <section className="relative min-h-[85vh] border-b-4 border-asphalt bg-asphalt overflow-hidden flex items-center justify-center p-4 sm:p-8">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #111111 25%, transparent 25%, transparent 75%, #111111 75%, #111111), repeating-linear-gradient(45deg, #111111 25%, #222 25%, #222 75%, #111111 75%, #111111)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
        
        {/* Dawn's signature floating content box, styled brutalist */}
        <div className="relative z-10 bg-pure border-4 border-asphalt p-8 sm:p-16 max-w-3xl text-center shadow-[12px_12px_0_0_var(--color-brand)] transition-shadow duration-300 flex flex-col items-center">
          <div className="bg-brand text-asphalt font-bold px-3 py-1 text-sm uppercase tracking-widest border-2 border-asphalt mb-6 transform -rotate-2 transition-colors duration-300">New Collection</div>
          <h1 className="font-headline text-6xl md:text-8xl text-asphalt mb-6 uppercase leading-none">Drop 01<br/>Rituals</h1>
          <p className="font-bold text-asphalt/80 text-lg md:text-xl mb-10 max-w-xl">
            The new standard for street culture. Heavyweight fabrics, unapologetic statements.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            <a href="#" className="inline-block bg-asphalt text-pure font-headline tracking-widest text-lg px-10 py-4 font-bold uppercase border-4 border-asphalt shadow-[4px_4px_0_0_var(--color-brand)] hover:translate-y-1 hover:shadow-[2px_2px_0_0_var(--color-brand)] transition-all">
              Shop All
            </a>
            <a href="#" className="inline-block bg-pure text-asphalt font-headline tracking-widest text-lg px-10 py-4 font-bold uppercase border-4 border-asphalt shadow-[4px_4px_0_0_#111111] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#111111] transition-all">
              Explore
            </a>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-asphalt text-brand py-4 border-b-4 border-asphalt overflow-hidden transition-colors duration-300">
        <div className="marquee font-headline text-2xl tracking-widest uppercase">
          <span>WEAR YOUR WORDS // NO RESTOCKS // CULTURE DROPS // WEAR YOUR WORDS // NO RESTOCKS // CULTURE DROPS // WEAR YOUR WORDS // NO RESTOCKS // CULTURE DROPS //</span>
        </div>
      </div>

      {/* Dawn: Rich Text Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <h2 className="font-headline text-4xl md:text-6xl text-asphalt uppercase mb-8">Talk is cheap.</h2>
        <p className="font-bold text-xl text-asphalt/80 leading-relaxed mb-10">
          We don't follow trends, we set the baseline. Every garment is engineered for the streets, combining raw aesthetics with premium heavyweight materials.
        </p>
        <a href="#" className="inline-block bg-pure text-asphalt font-headline tracking-widest text-lg px-8 py-4 font-bold uppercase border-4 border-asphalt shadow-[4px_4px_0_0_var(--color-brand)] hover:translate-y-1 hover:shadow-[2px_2px_0_0_var(--color-brand)] transition-all">
          Our Story
        </a>
      </section>

      {/* Dawn: Featured Collection */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t-4 border-asphalt">
        <div className="mb-12">
          <h2 className="font-headline text-5xl text-asphalt uppercase">Featured Products</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {[
            { id: 1, name: 'Statement Tee 01', price: 45, tag: 'New' },
            { id: 2, name: 'Heavy Hoodie', price: 89, tag: 'Selling Fast' },
            { id: 3, name: 'Culture Cap', price: 35, tag: '' },
            { id: 4, name: 'Statement Tee 02', price: 45, tag: '' },
            { id: 5, name: 'Ritual Longsleeve', price: 55, tag: 'Sold Out' },
            { id: 6, name: 'Utility Bag', price: 65, tag: '' },
          ].map((item) => (
            <div key={item.id} className="group cursor-pointer flex flex-col">
              <div className="bg-pure aspect-[3/4] border-4 border-asphalt mb-6 relative overflow-hidden flex items-center justify-center shadow-[6px_6px_0_0_#111111] group-hover:shadow-[10px_10px_0_0_var(--color-brand)] transition-all duration-300 group-hover:-translate-y-2">
                {item.tag && (
                  <div className={`absolute top-4 left-4 \${item.tag === 'Sold Out' ? 'bg-asphalt text-pure' : 'bg-brand text-asphalt'} font-bold text-xs px-3 py-1 border-2 border-asphalt uppercase z-10 transition-colors duration-300`}>
                    {item.tag}
                  </div>
                )}
                <div className="text-asphalt/10 font-headline text-8xl group-hover:scale-110 transition-transform duration-500">IMG</div>
                
                {/* Quick Add Button */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-[150%] group-hover:translate-y-0 transition-transform duration-300 z-20">
                  <button 
                    className={`w-full font-headline tracking-widest text-lg px-4 py-4 font-bold uppercase border-2 border-asphalt transition-colors \${item.tag === 'Sold Out' ? 'bg-bglight text-asphalt/50 cursor-not-allowed' : 'bg-pure text-asphalt hover:bg-brand'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.tag !== 'Sold Out') setIsCartOpen(true);
                    }}
                    disabled={item.tag === 'Sold Out'}
                  >
                    {item.tag === 'Sold Out' ? 'Sold Out' : 'Quick Add'}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start flex-grow">
                <div>
                  <h3 className="font-headline text-xl sm:text-2xl text-asphalt uppercase mb-2 group-hover:text-brand transition-colors leading-none">{item.name}</h3>
                  <p className="text-xs text-asphalt/60 uppercase font-bold">Black / Heavyweight</p>
                </div>
                <p className="font-bold text-xl text-asphalt">€{item.price}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Dawn: View All Button centered below grid */}
        <div className="mt-16 text-center">
          <a href="#" className="inline-block bg-pure text-asphalt font-headline tracking-widest text-lg px-12 py-5 font-bold uppercase border-4 border-asphalt shadow-[6px_6px_0_0_#111111] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#111111] transition-all">
            View All Products
          </a>
        </div>
      </section>

      {/* Dawn: Image with Text */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row border-4 border-asphalt shadow-[8px_8px_0_0_#111111] bg-pure">
          <div className="md:w-1/2 bg-asphalt min-h-[400px] flex items-center justify-center relative overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-asphalt">
            <div className="absolute inset-0 opacity-20 pattern-notebook mix-blend-overlay"></div>
            <div className="text-brand font-headline text-8xl opacity-50 transform -rotate-12 transition-colors duration-300">CULTURE</div>
          </div>
          <div className="md:w-1/2 bg-brand p-12 md:p-20 flex flex-col justify-center transition-colors duration-300">
            <h2 className="font-headline text-5xl md:text-6xl uppercase text-asphalt mb-6 leading-none">More Than<br/>Merch.</h2>
            <p className="font-bold text-lg mb-8 max-w-md leading-relaxed text-asphalt/90">
              Every piece is a cultural marker. We don't do random graphics. We curate statements that mean something to the crew.
            </p>
            <a href="#" className="inline-block self-start bg-pure text-asphalt font-headline tracking-widest text-lg px-8 py-4 font-bold uppercase border-4 border-asphalt shadow-[4px_4px_0_0_#111111] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#111111] transition-all">
              Read The Manifesto
            </a>
          </div>
        </div>
      </section>

      {/* Dawn: Multi-column */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t-4 border-asphalt">
        <h2 className="font-headline text-4xl sm:text-5xl text-asphalt uppercase mb-16 text-center">The Standard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Heavyweight', desc: 'Premium 300gsm cotton. Built to last, designed to fade perfectly over time.' },
            { title: 'Limited Runs', desc: 'No restocks. Once a drop is gone, it becomes part of the archive forever.' },
            { title: 'Global Shipping', desc: 'Worldwide delivery. Free shipping on all orders over €100.' }
          ].map((col, i) => (
            <div key={i} className="bg-pure border-4 border-asphalt p-8 shadow-[6px_6px_0_0_var(--color-brand)] transition-shadow duration-300 hover:shadow-[10px_10px_0_0_var(--color-brand)] text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-asphalt text-brand flex items-center justify-center font-headline text-3xl mb-6 transform -rotate-3 border-2 border-asphalt transition-colors duration-300">
                0{i+1}
              </div>
              <h3 className="font-headline text-xl sm:text-2xl uppercase mb-4 break-words w-full">{col.title}</h3>
              <p className="font-bold text-asphalt/70">{col.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dawn: Email Signup */}
      <section className="border-t-4 border-asphalt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center text-center">
          <div className="text-brand mb-6 drop-shadow-[3px_3px_0_#111] transition-colors duration-300">
            <LogoSVG />
          </div>
          <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl text-asphalt uppercase mb-6">Join The Crew</h2>
          <p className="font-bold text-asphalt/80 text-lg max-w-xl mb-12">Subscribe to get early access to drops, exclusive content, and 10% off your first order. No spam, just culture.</p>
          
          <form className="flex flex-col sm:flex-row w-full max-w-2xl shadow-[8px_8px_0_0_var(--color-brand)] transition-shadow duration-300">
            <input type="email" placeholder="ENTER YOUR EMAIL" className="flex-grow bg-pure border-4 border-asphalt sm:border-r-0 p-5 font-bold text-lg text-asphalt focus:outline-none placeholder-asphalt/40" />
            <button type="submit" className="bg-asphalt text-pure font-headline tracking-widest text-xl px-10 py-5 font-bold uppercase hover:bg-brand hover:text-asphalt border-4 sm:border-l-0 border-asphalt transition-colors">
              Join
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-asphalt text-pure border-t-4 border-brand transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="w-32 text-brand mb-6 transition-colors duration-300">
                <LogoSVG />
              </div>
              <p className="font-bold text-sm text-pure/60 max-w-sm leading-relaxed">
                Setting the standard for brutalist streetwear. No compromises, just raw expression.
              </p>
            </div>
            <div>
              <h4 className="font-headline text-2xl uppercase mb-6 text-brand transition-colors duration-300">Shop</h4>
              <ul className="space-y-4 font-bold text-sm">
                <li><a href="#" className="hover:text-brand transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">T-Shirts</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Hoodies</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Accessories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-headline text-2xl uppercase mb-6 text-brand transition-colors duration-300">Support</h4>
              <ul className="space-y-4 font-bold text-sm">
                <li><a href="#" className="hover:text-brand transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-brand transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-pure/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-bold text-xs text-pure/40">© 2026 CULTURE DROPS. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-4">
              <div className="w-10 h-6 bg-pure/10 rounded border border-pure/20 flex items-center justify-center text-[10px] font-bold">VISA</div>
              <div className="w-10 h-6 bg-pure/10 rounded border border-pure/20 flex items-center justify-center text-[10px] font-bold">MC</div>
              <div className="w-10 h-6 bg-pure/10 rounded border border-pure/20 flex items-center justify-center text-[10px] font-bold">PP</div>
            </div>
          </div>
        </div>
      </footer>

      {/* Download Theme Floating Button */}
      <button 
        onClick={handleDownloadTheme}
        disabled={isDownloading}
        className="fixed bottom-8 right-8 z-50 bg-brand text-asphalt font-headline tracking-widest text-lg px-6 py-4 font-bold uppercase border-4 border-asphalt shadow-[6px_6px_0_0_#111111] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#111111] transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <Download size={24} />
        {isDownloading ? 'Generating...' : 'Download Theme (.zip)'}
      </button>
    </div>
  );
}
