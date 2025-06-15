//src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth.config" // Referring to the auth.ts we just created
export const { GET, POST } = handlers
