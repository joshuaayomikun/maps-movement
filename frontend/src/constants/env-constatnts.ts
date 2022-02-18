export const API_BASE_URL: Readonly<string> = typeof process.env.NEXT_PUBLIC_API_BASE_URL !== "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL : ""

console.log({API_BASE_URL})