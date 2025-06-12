import { appRouter } from '@/server/api/root'
import { headers } from 'next/headers'

export const api = appRouter.createCaller(async () => ({
  headers: await headers(),
}))