import { useContext } from 'react';
import { CompoundContext } from '../context/CompoundContext';

/**
 * Custom hook to access Compound functionality
 * This hook simplifies access to the Compound context
 */
const useCompound = () => {
  const context = useContext(CompoundContext);
  
  if (!context) {
    throw new Error('useCompound must be used within a CompoundProvider');
  }
  
  return context;
};

export default useCompound;
