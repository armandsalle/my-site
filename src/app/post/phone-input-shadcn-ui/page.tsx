import { link, p } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Github } from "lucide-react"
import Link from "next/link"

import { PhoneInputShadcnUiPhoneInput } from "./_phone-input"
import { CodeBlock, Highlight } from "@/components/ui/code-block"

export default function Post() {
  return (
    <main className="mx-auto my-12 max-w-[33.75rem] px-6 text-black antialiased sm:my-32">
      <Button asChild variant="ghost">
        <Link href="/">
          <ChevronLeft size={16} className="mr-2" />
          Get back to the homepage
        </Link>
      </Button>
      <header className="flex flex-col gap-2 items-start mt-6">
        <p className={p}>
          This is a demo of a custom phone number component built with{" "}
          <Link href="https://ui.shadcn.com/" target="_blank" className={link}>
            Shadcn UI
          </Link>
          . Feel free to play around with it and customize it to your needs.
        </p>
        <Button asChild size="sm" variant="default">
          <Link
            href="https://github.com/armandsalle/my-site/blob/main/src/app/post/phone-input-shadcn-ui/page.tsx"
            target="_blank"
          >
            <Github size={16} className="mr-2" />
            Get the source code here
          </Link>
        </Button>
        <div className="mt-4 flex flex-col gap-2">
          <p>You will need some extra packages to make this works</p>
          <CodeBlock>
            <span>npm install</span>

            <span className="flex-1">
              <Highlight>libphonenumber-js i18n-iso-countries react-phone-number-input</Highlight>
            </span>
          </CodeBlock>
          <p>Don&apos;t forget to register the local you want</p>
          <CodeBlock>
            <span className="flex-1">
              <span className="block">{`import { registerLocale } from "i18n-iso-countries"`} </span>
              <span className="block text-slate-400">{`// The local you want`}</span>
              <span className="block">
                {`import `} <Highlight>enCountries</Highlight> {`from "i18n-iso-countries/langs/en.json"`}
              </span>
              registerLocale(
              <Highlight>enCountries</Highlight>)
            </span>
          </CodeBlock>
        </div>
      </header>

      <PhoneInputShadcnUiPhoneInput />
    </main>
  )
}
