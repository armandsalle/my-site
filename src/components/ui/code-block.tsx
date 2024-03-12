import { ReactNode } from "react"

export const CodeBlock = ({ children }: { children: ReactNode }) => {
  return (
    <code className="text-sm sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6 overflow-x-scroll w-full">
      <span className="flex gap-4 shrink-0">{children}</span>
    </code>
  )
}

export const Highlight = ({ children }: { children: ReactNode }) => {
  return <span className="text-yellow-500">{children}</span>
}
