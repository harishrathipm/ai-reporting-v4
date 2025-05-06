import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { queryService } from '../services/query.service';

interface RoleContextType {
  selectedRole: string;
  availableRoles: string[];
  setSelectedRole: (role: string) => void;
  isLoading: boolean;
  error: string | null;
}

// Create context with default values
const RoleContext = createContext<RoleContextType>({
  selectedRole: '',
  availableRoles: [],
  setSelectedRole: () => {},
  isLoading: false,
  error: null,
});

// Custom hook to use the role context
export const useRole = () => useContext(RoleContext);

interface RoleProviderProps {
  children: ReactNode;
}

// Provider component that wraps the app and makes role context available
export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load available roles on component mount
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setIsLoading(true);
        const roles = await queryService.getRoles();
        setAvailableRoles(roles);
        // Set first role as default if available
        if (roles.length > 0) {
          setSelectedRole(roles[0]);
        }
      } catch (err) {
        console.error('Error loading roles:', err);
        setError('Failed to load available roles.');
      } finally {
        setIsLoading(false);
      }
    };

    loadRoles();
  }, []);

  const value = {
    selectedRole,
    availableRoles,
    setSelectedRole,
    isLoading,
    error,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export default RoleContext;
