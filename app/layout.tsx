
import { Amatic_SC, Baskervville, Chakra_Petch, Comic_Neue, David_Libre, EB_Garamond, Georama, Inter, Inter_Tight, Khand, Lora, Merriweather, Open_Sans, Playfair_Display, PT_Sans, PT_Serif, Roboto, Roboto_Slab, Source_Code_Pro, Source_Serif_4 } from 'next/font/google'
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import './globals.css';
import 'katex/dist/katex.css';

import type { Metadata } from "next";

const APP_NAME = "Cermat Testy";
const APP_DEFAULT_TITLE = "Cermat Testy";
const APP_TITLE_TEMPLATE = "%s - Cermat Testy";
const APP_DESCRIPTION = "Cermat neoficiální testy";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    startupImage: [{
      url: '/icons/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png',
      media: 'screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
    },
    {
      url: '/icons/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png',
      media: 'screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
    },
    ]
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128.png" },
    { rel: "icon", url: "icons/icon-128.png" },

  ]
};

//const inter = Inter({ subsets: ['latin'] })
//const inter = David_Libre({ subsets: ['latin'], weight:"400" })
//const inter = Chakra_Petch({ subsets: ['latin'], weight:"400" })
//const inter = Rock_Salt({ subsets: ['latin'], weight:"400" })
//const inter = Comic_Neue({ subsets: ['latin'], weight:"400" })
//const inter = PT_Sans({ subsets: ['latin'], weight:"400" })
const inter = Open_Sans({ subsets: ['latin'] })
//const inter = Source_Serif_4({ subsets: ['latin'], weight:"400" })
//const inter = Source_Code_Pro({ subsets: ['latin'], weight:"400" })
//const inter = Georama({ subsets: ['latin'], weight:"400" })




export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className=''>
      <body className={`${inter.className} bg-white dark:bg-slate-900 dark:text-white`}>{children}</body>
    </html>
  )
}
