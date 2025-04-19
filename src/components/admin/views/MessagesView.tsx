import React, { useEffect, useState } from 'react';
import { database } from '../../../lib/firebase';
import { ref, onValue } from 'firebase/database';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt?: string;
}

export function MessagesView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const messagesRef = ref(database, 'contact_submissions');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesList = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value,
        }));
        setMessages(messagesList.reverse());
      } else {
        setMessages([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading messages...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} className="border-t">
                <td className="px-4 py-2">{msg.name}</td>
                <td className="px-4 py-2">{msg.email}</td>
                <td className="px-4 py-2">{msg.message}</td>
                <td className="px-4 py-2">{msg.submittedAt ? new Date(msg.submittedAt).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
