import { redirect } from 'next/navigation';

// This page will redirect any old format service URLs to the new format
export default function CatchAllRedirect({ params }: { params: { catchall: string[] } }) {
  const path = params.catchall.join('/');
  redirect(`/services2/${path}`);
}