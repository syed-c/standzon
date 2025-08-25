import { redirect } from 'next/navigation';

export default function ExhibitionsPage() {
  console.log('🎪 Redirecting /exhibitions to /trade-shows to eliminate duplication');
  
  // Redirect to trade-shows to eliminate duplicate content
  redirect('/trade-shows');
}