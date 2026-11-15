// Feedback data layer, stored in Supabase.
// The database rules (Row Level Security) decide what visitors may do.

import { supabase } from '../lib/supabase'

export const FEEDBACK_LIMITS = {
  nameMax: 60,
  messageMin: 10,
  messageMax: 500,
  pageSize: 6,
}

const COLUMNS = 'id, customer_name, rating, message, created_at'

function fail(code) {
  const error = new Error(code)
  error.code = code
  throw error
}

// Newest first. Asks for one extra row to know whether more pages exist.
export async function listFeedback({ page = 1, pageSize = FEEDBACK_LIMITS.pageSize } = {}) {
  const from = (page - 1) * pageSize
  const { data, error } = await supabase
    .from('feedback')
    .select(COLUMNS)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(from, from + pageSize)

  if (error) fail('load')

  return {
    items: data.slice(0, pageSize),
    hasMore: data.length > pageSize,
  }
}

export async function createFeedback({ customer_name, rating, message, language = 'en' }) {
  const name = String(customer_name ?? '').trim()
  const text = String(message ?? '').trim()
  const stars = Number(rating)

  // Same checks as the database, so people get a clear message before sending.
  if (!name) fail('name')
  if (name.length > FEEDBACK_LIMITS.nameMax) fail('name_long')
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) fail('rating')
  if (text.length < FEEDBACK_LIMITS.messageMin) fail('message_short')
  if (text.length > FEEDBACK_LIMITS.messageMax) fail('message_long')

  const { data, error } = await supabase
    .from('feedback')
    .insert({
      customer_name: name,
      rating: stars,
      message: text,
      language,
    })
    .select(COLUMNS)
    .single()

  if (error) fail('generic')
  return data
}