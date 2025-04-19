import React, { useEffect, useState } from 'react';
import { database } from '../../../lib/firebase';
import { ref, onValue } from 'firebase/database';

interface NewsletterSignup {
  id: string;
  email: string;
  subscribedAt?: string;
}

export function NewsletterView() {
  const [signups, setSignups] = useState<NewsletterSignup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const newsletterRef = ref(database, 'newsletter');
    const unsubscribe = onValue(newsletterRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const signupsList = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value,
        }));
        setSignups(signupsList.reverse());
      } else {
        setSignups([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading newsletter signups...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Newsletter Signups</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Subscribed At</th>
            </tr>
          </thead>
          <tbody>
            {signups.map((signup) => (
              <tr key={signup.id} className="border-t">
                <td className="px-4 py-2">{signup.email}</td>
                <td className="px-4 py-2">{signup.subscribedAt ? new Date(signup.subscribedAt).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
