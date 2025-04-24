import { redirect } from 'next/navigation';

// Redirect to the new services2 route with any query parameters preserved
export default function ServicesRedirect({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const queryString = Object.entries(searchParams || {})
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
    
  const redirectUrl = `/services2${queryString ? '?' + queryString : ''}`;
  redirect(redirectUrl);
}