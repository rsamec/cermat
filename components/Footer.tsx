import { absoluteUrl } from "@/lib/utils/utils"

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-800 text-white border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-5 p-5 text-slate-400">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-6 lg:gap-x-8 gap-y-5 sm:gap-y-6 lg:gap-y-8 mb-8">
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-l"> KONTAKTNÍ ÚDAJE</h3>
              <div>
                <p>Telefonní číslo: <strong> +420 .......</strong></p>
                <p>E-mail: <strong><a href="mailto:roman.samec2@gmail.com">roman.samec2@gmail.com</a></strong></p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-l">ZAJÍMAVÉ ODKAZY</h3>
              <a href="https://prijimacky.cermat.cz/" target="_blank">Cermat Příjmačky</a>              

            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-l"> DALŠÍ INFORMACE</h3>
              <div>
                {/* <p><a href={normalizeHtmlExtension(absoluteUrl('/pages/about'))}>Kdo jsme</a></p> */}
                <p><a href={absoluteUrl('/gdpr.pdf')} target="_blank">Ochrana osobních údajů</a></p>
              </div>

            </div>

          </div>


        </div>
      </footer>

      <footer className="bg-black text-white border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-5 p-5">
          <div className="flex">
            <p className="text-sm flex-1 text-slate-400">© 2018 - 2024 Paperify</p>
          </div>
        </div>

      </footer>
    </>
  )
}

export default Footer