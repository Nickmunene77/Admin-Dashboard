export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-center h-full w-full">
      {children}
    </div>
  )
}
//this centers these all pages signup and sign in
