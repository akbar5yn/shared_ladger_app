// helpers/package.helper.ts

export const ALLOWED_PACKAGES = ['aladin', 'telegram']

export const isAllowedPackage = (pkg?: string): boolean => {
  if (!pkg) return false

  const normalizedPkg = pkg.toLowerCase()

  return ALLOWED_PACKAGES.some((allowedPkg) =>
    normalizedPkg.includes(allowedPkg.toLowerCase()),
  )
}
