
import React, { useState, useEffect } from 'react';
import { SignInCard } from './components/SignInCard';
import { Toast } from './components/Toast';
import { supabase } from './lib/supabase';
import { JournalView } from './components/JournalView';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Successfully signed out', 'success');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      {session ? (
        <JournalView 
          user={session.user} 
          onSignOut={handleSignOut} 
          onToast={showToast} 
        />
      ) : (
        <SignInCard 
          onToast={showToast}
        />
      )}
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default App;
