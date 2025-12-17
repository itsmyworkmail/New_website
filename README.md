This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Environment Variables

For the application to function correctly, you **MUST** configure the following Environment Variables in your Vercel Project Settings:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key.
- `NEXT_PUBLIC_SITE_URL`: Your Vercel deployment URL (e.g., `https://your-project.vercel.app`).

> **Note:** If these variables are invalid or missing, authentication features will fail.

### Troubleshooting Google Sign-in

If Google Sign-in fails with a 404 or error, check the following:

1.  **Supabase Redirect URLs**:
    - Go to your Supabase Dashboard -> Authentication -> URL Configuration.
    - Add your Vercel Deployment URL to **Redirect URLs**.
    - Example: `https://your-project-name.vercel.app/**` (Wildcard is recommended for test deployments) or exactly `https://your-project-name.vercel.app/auth/callback`.

2.  **Vercel Environment Variables**:
    - Ensure `NEXT_PUBLIC_SITE_URL` is set to your Vercel URL (e.g., `https://your-project-name.vercel.app`) in Vercel Project Settings.
    - **Re-deploy** your project after changing environment variables for them to take effect.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
