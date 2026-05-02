import { createClient } from '@supabase/supabase-js'

export async function POST(req) {
  const formData = await req.formData()

  const email = formData.get('email')
  const productName = formData.get('product_name')
  const saleId = formData.get('sale_id')

  if (!email || !productName) {
    return new Response('Missing data', { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  // récupérer produit
  const { data: product } = await supabase
    .from('products')
    .select('id')
    .eq('name', productName)
    .single()

  if (!product) {
    return new Response('Product not found', { status: 404 })
  }

  // éviter doublon achat
  await supabase.from('purchases').upsert({
    user_email: email,
    product_id: product.id,
    gumroad_sale_id: saleId
  })

  return new Response('OK', { status: 200 })
}