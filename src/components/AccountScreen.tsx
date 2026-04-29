import { X, User, Crown, LogOut, AlertCircle, CheckCircle, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { authManager } from '../game/database/AuthManager';
import { statsManager } from '../game/database/StatsManager';
import { leaderboardManager } from '../game/database/LeaderboardManager';
import { soundManager } from '../game/SoundManager';

interface AccountScreenProps {
  onClose: () => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.96 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.38 8.55 1 10.22 1 12s.38 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.96 3.47 2.18 7.07l2.85 2.22C6.71 9.04 9.14 7.12 12 7.12z"/>
  </svg>
);

const DiscordIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 1 .196-.17.071.071 0 0 1 .071-.005c3.928 1.793 8.18 1.793 12.062 0a.071.071 0 0 1 .071.005c.12.098.246.118.308.018a17.894 17.894 0 0 1 1.832.892.077.077 0 0 1-.008.128 12.254 12.254 0 0 1-.196.17.076.076 0 0 0-.041.107c.36.698.772.862 1.205.892a.07.07 0 0 0 .033-.027c.412-.613.772-1.222 1.108-1.855a.076.076 0 0 0-.031-.055 19.866 19.866 0 0 0-5.792-2.34zm-13.12 8.75a1.653 1.653 0 0 1-1.497-1.64.072.072 0 0 1 .058-.07 1.622 1.622 0 0 1 1.493-1.64.072.072 0 0 1 .058.07 1.631 1.631 0 0 1 .058 1.64.071.071 0 0 1-.057.07zm7.18-1.65a1.642 1.642 0 0 1-1.488-1.64.072.072 0 0 1 .058-.07 1.62 1.62 0 0 1 1.488-1.64.072.072 0 0 1 .058.07 1.631 1.631 0 0 1 .058 1.64.072.072 0 0 1-.058.07z"/>
  </svg>
);

interface AccountScreenProps {
  onClose: () => void;
}

export function AccountScreen({ onClose }: AccountScreenProps) {
  const [mode, setMode] = useState<'main' | 'login' | 'register' | 'upgrade'>('main');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(authManager.getProfile());
  const [stats, setStats] = useState(statsManager.getStats());
  const [myRank, setMyRank] = useState(0);

  useEffect(() => {
    const updateData = async () => {
      setProfile(authManager.getProfile());
      setStats(statsManager.getStats());
      const rank = await leaderboardManager.getMyRank();
      setMyRank(rank);
    };
    updateData();
    const unsub1 = authManager.subscribe(() => updateData());
    const unsub2 = statsManager.subscribe(() => updateData());
    return () => { unsub1(); unsub2(); };
  }, []);

  const isGuest = profile?.is_guest;

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await authManager.signIn(email, password);
      if (!result.success) {
        setError(result.error || 'Login failed');
      } else {
        setMode('main');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await authManager.signUp(username, email, password);
      if (!result.success) {
        setError(result.error || 'Registration failed');
      } else {
        setMode('main');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await authManager.signInWithGoogle();
      if (!result.success) {
        setError(result.error || 'Google sign-in failed');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google sign-in failed');
    }
    setLoading(false);
  };

  const handleDiscordSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await authManager.signInWithDiscord();
      if (!result.success) {
        setError(result.error || 'Discord sign-in failed');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Discord sign-in failed');
    }
    setLoading(false);
  };

  const handleConvertToAccount = async () => {
    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await authManager.convertGuest(username, email, password);
      if (!result.success) {
        setError(result.error || 'Conversion failed');
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
    }
    setLoading(false);
  };

  const handleGuestLogin = () => {
    authManager.signInAsGuest();
    soundManager.uiClick();
    setMode('main');
  };

  const handleLogout = () => {
    authManager.signOut();
    soundManager.uiClick();
  };

  if (mode !== 'main' && isGuest) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-6 space-y-6 border border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Create Account</h2>
            <button onClick={onClose} className="text-zinc-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-zinc-400 text-sm">
            Convert your guest progress to a permanent account. Your stats and achievements will be saved.
          </p>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-sm mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="At least 8 characters"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setMode('main')}
              className="flex-1 py-3 border border-zinc-700 text-zinc-400 rounded-lg hover:text-white hover:border-zinc-600"
            >
              Back
            </button>
            <button
              onClick={handleConvertToAccount}
              disabled={loading}
              className="flex-1 py-3 bg-cyan-500 text-black rounded-lg font-bold hover:bg-cyan-400 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Converting...' : 'Convert Account'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'login') {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-6 space-y-6 border border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Sign In</h2>
            <button onClick={onClose} className="text-zinc-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setMode('main'); setError(''); }}
              className="flex-1 py-3 border border-zinc-700 text-zinc-400 rounded-lg hover:text-white hover:border-zinc-600"
            >
              Back
            </button>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="flex-1 py-3 bg-cyan-500 text-black rounded-lg font-bold hover:bg-cyan-400 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-zinc-900 text-zinc-500">or continue with</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex-1 py-3 bg-white text-black rounded-lg font-bold hover:bg-zinc-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <GoogleIcon />
              Google
            </button>
            <button
              onClick={handleDiscordSignIn}
              disabled={loading}
              className="flex-1 py-3 bg-[#5865F2] text-white rounded-lg font-bold hover:bg-[#4752C8] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <DiscordIcon />
              Discord
            </button>
          </div>

          <button
            onClick={() => { setMode('register'); setError(''); }}
            className="w-full text-center text-zinc-400 text-sm hover:text-white"
          >
            Don't have an account? <span className="text-cyan-400">Sign up</span>
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'register') {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-6 space-y-6 border border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Create Account</h2>
            <button onClick={onClose} className="text-zinc-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-sm mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="At least 8 characters"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setMode('main'); setError(''); }}
              className="flex-1 py-3 border border-zinc-700 text-zinc-400 rounded-lg hover:text-white hover:border-zinc-600"
            >
              Back
            </button>
            <button
              onClick={handleRegister}
              disabled={loading}
              className="flex-1 py-3 bg-cyan-500 text-black rounded-lg font-bold hover:bg-cyan-400 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-zinc-900 text-zinc-500">or sign up with</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex-1 py-3 bg-white text-black rounded-lg font-bold hover:bg-zinc-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <GoogleIcon />
              Google
            </button>
            <button
              onClick={handleDiscordSignIn}
              disabled={loading}
              className="flex-1 py-3 bg-[#5865F2] text-white rounded-lg font-bold hover:bg-[#4752C8] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <DiscordIcon />
              Discord
            </button>
          </div>

          <button
            onClick={() => { setMode('login'); setError(''); }}
            className="w-full text-center text-zinc-400 text-sm hover:text-white"
          >
            Already have an account? <span className="text-cyan-400">Sign in</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-6 space-y-6 border border-zinc-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Account</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {profile ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-2xl font-bold">
                {profile.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{profile.username}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-cyan-400 text-sm flex items-center gap-1">
                    <Star className="w-3 h-3" /> Level {profile.level}
                  </span>
                  <span className="text-purple-400 text-sm flex items-center gap-1">
                    <Crown className="w-3 h-3" /> {profile.crystals} crystals
                  </span>
                </div>
                {profile.is_guest ? (
                  <span className="text-yellow-400 text-xs flex items-center gap-1 mt-1">
                    <Crown className="w-3 h-3" /> Guest Player
                  </span>
                ) : (
                  <span className="text-green-400 text-xs flex items-center gap-1 mt-1">
                    <CheckCircle className="w-3 h-3" /> {profile.email}
                  </span>
                )}
              </div>
            </div>

            {myRank > 0 && (
              <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg border border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">Leaderboard Rank</span>
                  <span className="text-xl font-bold text-cyan-400">#{myRank}</span>
                </div>
              </div>
            )}

            {stats && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-zinc-800/50 rounded-lg">
                  <div className="text-zinc-500 text-xs">Total Score</div>
                  <div className="text-white font-bold">{stats.total_score.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-zinc-800/50 rounded-lg">
                  <div className="text-zinc-500 text-xs">Highest Wave</div>
                  <div className="text-white font-bold">{stats.highest_wave}</div>
                </div>
                <div className="p-3 bg-zinc-800/50 rounded-lg">
                  <div className="text-zinc-500 text-xs">Bugs Smashed</div>
                  <div className="text-white font-bold">{stats.bugs_smashed.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-zinc-800/50 rounded-lg">
                  <div className="text-zinc-500 text-xs">Games Played</div>
                  <div className="text-white font-bold">{stats.games_played}</div>
                </div>
              </div>
            )}

            {profile.is_guest && (
              <button
                onClick={() => setMode('upgrade')}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-lg font-bold flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Full Account
              </button>
            )}

            {!profile.is_guest ? (
              <button
                onClick={handleLogout}
                className="w-full py-3 border border-red-500/50 text-red-400 rounded-lg flex items-center justify-center gap-2 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full py-3 border border-zinc-700 text-zinc-400 rounded-lg flex items-center justify-center gap-2 hover:text-white hover:border-zinc-600"
              >
                Reset Progress
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-6">
              <User className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
              <p className="text-zinc-400 mb-4">Sign in to save your progress and compete on leaderboards</p>
              <button
                onClick={handleGuestLogin}
                className="w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-zinc-200"
              >
                Continue as Guest
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-zinc-900 px-4 text-zinc-500 text-sm">or</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('login')}
                className="py-3 border border-zinc-700 text-zinc-400 rounded-lg hover:text-white hover:border-zinc-600 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign In
              </button>
              <button
                onClick={() => setMode('register')}
                className="py-3 bg-cyan-500 text-black rounded-lg font-bold hover:bg-cyan-400 flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}