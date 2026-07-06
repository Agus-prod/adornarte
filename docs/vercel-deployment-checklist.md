# Vercel Deployment Checklist

## Environment variables

Configure these in Vercel Project Settings > Environment Variables for Preview and Production:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_CATALOG_ORGANIZATION_ID`
- `NEXT_PUBLIC_SITE_URL` for the production URL

Never commit real `.env.local` values. The service role key must stay server-side only.

## Supabase before production

- Apply all migrations to the production Supabase project.
- Confirm `catalog_customers.auth_user_id` exists.
- Confirm `customers.is_active` exists.
- Confirm catalog settings, payment receipts, coupon customer fields, and order sale linking migrations exist.
- Add the production Vercel URL to Supabase Auth redirect URLs.
- Add preview redirect URLs if testing auth flows in preview deployments.

## Vercel flow

1. Import the Git repository into Vercel.
2. Set the framework preset to Next.js.
3. Keep the install/build defaults unless Vercel cannot detect `pnpm`.
4. Add the environment variables above.
5. Deploy a Preview first.
6. Test the checklist below on the Preview URL.
7. Promote or deploy Production after the preview passes.

## Functional smoke test

- Login to the admin dashboard.
- Open and close cash.
- Search products in POS.
- Add products to POS cart.
- Try cash payment with blank received amount: it must not finalize.
- Try cash payment below total: it must show `Falta` and must not finalize.
- Try cash payment equal or above total: it must finalize.
- Create a credit sale for a selected customer.
- Register a customer payment.
- Open the online catalog.
- Add a catalog item to cart.
- Apply an invalid coupon: it must show the message without changing the URL.
- Create or login to a catalog customer account.
- Complete checkout.
- Confirm the order appears in sales/orders.

## Mobile smoke test

Test with an iPhone 13 sized viewport, approximately `390 x 844`:

- Admin header can be used without horizontal scrolling.
- POS products can scroll.
- POS cart can scroll.
- POS total and `Finalizar venta` stay reachable.
- Catalog header account/cart menus fit on screen.
- Catalog product cards fit without text overlap.
- Cart and checkout forms are readable and tappable.
- Customer account page is readable and scrolls normally.

