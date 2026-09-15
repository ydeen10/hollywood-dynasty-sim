import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'hollywood-dynasty-sim-2twyucuj',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_EeTgNtz3cQzOq6B1golMshjBwL_CC45v',
  authRequired: false,
  auth: { mode: 'managed' },
})
