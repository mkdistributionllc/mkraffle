import Link from "next/link";

const footerSections = [
  {
    title: "Shop",
    links: [
      { label: "Shop All", href: "https://mk100glass.com/shop/" },
      { label: "Rig", href: "https://mk100glass.com/type/rig/" },
      { label: "Straight", href: "https://mk100glass.com/type/straight/" },
      { label: "Beaker", href: "https://mk100glass.com/type/beaker/" },
      { label: "Zinger", href: "https://mk100glass.com/type/zinger/" },
      { label: "Wholesale", href: "https://mk100glass.com/wholesale/" },
      { label: "New Arrivals", href: "https://mk100glass.com/shop/?orderby=date" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "https://mk100glass.com/our-story/" },
      { label: "Blog", href: "https://mk100glass.com/blog/" },
      { label: "Download Images", href: "https://mk100glass.com/download/" },
      { label: "Contact", href: "https://mk100glass.com/contact/" },
    ],
  },
  {
    title: "More",
    links: [
      { label: "Wholesale Registration", href: "https://mkdistributionllc.com/wholesale-registration/" },
      { label: "Shipping & Returns", href: "https://mk100glass.com/shipping-and-returns/" },
      { label: "Privacy Policy", href: "https://mk100glass.com/privacy-policy/" },
      { label: "Terms of Use", href: "https://mk100glass.com/terms-of-use/" },
    ],
  },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/mk100glass",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          fill="currentColor"
          d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 2.818A5.182 5.182 0 0 0 6.818 12 5.182 5.182 0 0 0 12 17.182 5.182 5.182 0 0 0 17.182 12 5.182 5.182 0 0 0 12 6.818zm0 2A3.182 3.182 0 0 1 15.182 12 3.182 3.182 0 0 1 12 15.182 3.182 3.182 0 0 1 8.818 12 3.182 3.182 0 0 1 12 8.818zm6.406-2.94a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"
        />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/mk100glass-106434560694615/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          fill="currentColor"
          d="M13 3h4a1 1 0 0 1 1 1v4h-3a1 1 0 0 0-1 1v3h4l-1 4h-3v7h-4v-7H8v-4h2V9a5 5 0 0 1 5-5z"
        />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com/mk100glass",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          fill="currentColor"
          d="M21.46 6.003c-.77.342-1.6.573-2.47.677a4.314 4.314 0 0 0 1.89-2.377 8.63 8.63 0 0 1-2.73 1.044 4.301 4.301 0 0 0-7.33 3.923 12.204 12.204 0 0 1-8.85-4.49 4.3 4.3 0 0 0 1.33 5.733 4.26 4.26 0 0 1-1.95-.538v.054a4.302 4.302 0 0 0 3.45 4.215 4.29 4.29 0 0 1-1.94.074 4.303 4.303 0 0 0 4.013 2.983 8.63 8.63 0 0 1-5.34 1.842c-.346 0-.69-.02-1.03-.06a12.17 12.17 0 0 0 6.6 1.936c7.92 0 12.25-6.562 12.25-12.25 0-.187-.004-.373-.013-.558a8.748 8.748 0 0 0 2.153-2.228z"
        />
      </svg>
    ),
  },
];

const bottomLinks = [
  { label: "Terms of Use", href: "https://mk100glass.com/terms-of-use" },
  { label: "Privacy Policy", href: "https://mk100glass.com/privacy-policy" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black py-12 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h5 className="text-xs font-semibold uppercase tracking-widest text-zinc-300">
                {section.title}
              </h5>
              <ul className="space-y-2 text-sm text-zinc-400">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="flex flex-col items-center space-y-6 text-center lg:items-end lg:text-right">
            <Link
              href="https://mk100glass.com/"
              className="transition hover:opacity-80"
            >
              <span className="sr-only">MK100 Glass</span>
              <img
                src="https://mk100glass.com/wp-content/themes/mk100glass-new-new/assets/images/logo-white.png"
                alt="MK100 Glass logo"
                className="h-24 w-auto"
                loading="lazy"
              />
            </Link>
            <ul className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white hover:bg-white/10"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </Link>
                </li>
              ))}
            </ul>
            <img
              src="https://mk100glass.com/wp-content/themes/mk100glass-new-new/assets/images/credit-card-logos.png"
              alt="Accepted payment methods"
              className="h-12 w-auto"
              loading="lazy"
            />
          </div>
        </div>
        <div className="h-px w-full bg-white/10" />
        <div className="flex flex-col gap-6 text-sm text-zinc-400 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            {bottomLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-center lg:text-left">
            Our products are intended for tobacco or legal use only. You must be 21 years or older to browse this website and purchase products.
          </p>
          <p className="text-center lg:text-right">
            © {year} MK100 Glass. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}