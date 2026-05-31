/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { supabase } from './lib/supabase';

type Language = 'en' | 'ur';

const translations = {
  en: {
    title: "Jamia Naqshbandia Barvi Rizvia",
    subtitle: "Management System",
    home: "Home",
    login: "Login",
    student: "Student",
    admin: "Admin",
    username: "Email",
    password: "Password",
    enter: "Enter",
    createAccount: "Create Account",
    alreadyHaveAccount: "Already have an account? Login",
    needAccount: "Need an account? Create"
  },
  ur: {
    title: "جامعہ نقشبندیہ باروی رضویہ",
    subtitle: "مینجمنٹ سسٹم",
    home: "ہوم",
    login: "لاگ ان",
    student: "طالب علم",
    admin: "ایڈمن",
    username: "ای میل",
    password: "پاس ورڈ",
    enter: "داخل",
    createAccount: "اکاؤنٹ بنائیں",
    alreadyHaveAccount: "کیا پہلے سے اکاؤنٹ ہے؟ لاگ ان",
    needAccount: "اکاؤنٹ کی ضرورت ہے؟ بنائیں"
  }
};

export default function App() {
  const [lang, setLang] = useState<Language>('ur');
  const [showAuthModal, setShowAuthModal] = useState<{show: boolean, type: 'admin' | 'student' | null}>({show: false, type: null});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  
  const t = translations[lang];

  const handleAuth = async () => {
    // Special case for the requested hardcoded admin credentials
    if (showAuthModal.type === 'admin' && email === 'Usman' && password === '109') {
      alert('Admin Login Successful');
      setShowAuthModal({show: false, type: null});
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (error) throw error;
        alert(`${showAuthModal.type} Login Successful`);
      } else {
        const { error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });
        if (error) throw error;
        alert(`${showAuthModal.type} Account Created Successfully`);
      }
      setShowAuthModal({show: false, type: null});
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f7f2] text-[#2d2d2d] flex flex-col items-center font-sans tracking-tight">
      <header className="w-full bg-[#ffffff] border-b border-[#d1cdc2] p-8 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-[#0a5c36] mb-2 uppercase tracking-tight">{t.title}</h1>
        <p className="text-sm text-[#6e6a5e] uppercase tracking-[0.2em]">{t.subtitle}</p>
        
        <button 
          onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
          className="mt-6 px-4 py-1.5 border border-[#0a5c36] text-[#0a5c36] font-bold text-xs rounded hover:bg-[#0a5c36] hover:text-white transition-colors uppercase tracking-wider"
        >
          {lang === 'en' ? 'اردو' : 'English'}
        </button>
      </header>

      <main className="w-full max-w-lg bg-[#ffffff] border border-[#d1cdc2] shadow-sm rounded-lg p-10 my-10">
        <div className="space-y-6">
          <button 
            onClick={() => setShowAuthModal({show: true, type: 'student'})}
            className="w-full py-4 bg-[#0a5c36] text-white rounded hover:bg-[#084a2c] transition font-bold uppercase tracking-widest text-sm"
          >
            {t.student} {t.login}
          </button>
          <button 
            onClick={() => setShowAuthModal({show: true, type: 'admin'})}
            className="w-full py-4 border border-[#0a5c36] text-[#0a5c36] rounded hover:bg-[#0a5c36] hover:text-white transition font-bold uppercase tracking-widest text-sm"
          >
            {t.admin} {t.login}
          </button>
        </div>
      </main>

      {showAuthModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm space-y-4">
            <h2 className="text-xl font-bold">{t[showAuthModal.type!]} {isLogin ? t.login : t.createAccount}</h2>
            <input 
              type="email" 
              placeholder={t.username}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded"
            />
            <input 
              type="password" 
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded"
            />
            <button 
              onClick={handleAuth}
              className="w-full py-3 bg-[#0a5c36] text-white rounded font-bold"
            >
              {isLogin ? t.enter : t.createAccount}
            </button>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="w-full py-2 text-sm text-[#0a5c36] underline"
            >
              {isLogin ? t.needAccount : t.alreadyHaveAccount}
            </button>
            <button 
              onClick={() => setShowAuthModal({show: false, type: null})}
              className="w-full py-2 text-gray-500 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <footer className="mt-auto py-8 text-[#9c9689] text-xs uppercase tracking-widest">
        Barvi Graphics Faisalabad
      </footer>
    </div>
  );
}
