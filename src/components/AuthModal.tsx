import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SignIn from './SignIn';
import SignUp from './SignUp';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

const AuthModal = ({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);

  const handleModeSwitch = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
  };

  const handleClose = () => {
    setMode(defaultMode);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-4">
          {mode === 'signin' ? (
            <SignIn 
              onSwitchToSignUp={() => handleModeSwitch('signup')}
              onClose={handleClose}
            />
          ) : (
            <SignUp 
              onSwitchToSignIn={() => handleModeSwitch('signin')}
              onClose={handleClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
