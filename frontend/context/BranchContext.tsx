import React, { createContext, useContext, useState } from 'react';
import { Branch } from '../types';
import { INITIAL_BRANCHES } from '../services/mockData';

interface BranchContextType {
  branches: Branch[];
  activeBranchId: string; // 'all' or branch id
  setActiveBranchId: (id: string) => void;
  activeBranch: Branch | undefined;
  getBranchById: (id: string) => Branch | undefined;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [activeBranchId, setActiveBranchId] = useState<string>('all');

  const activeBranch = branches.find(b => b.id === activeBranchId);

  const getBranchById = (id: string) => branches.find(b => b.id === id);

  return (
    <BranchContext.Provider
      value={{
        branches,
        activeBranchId,
        setActiveBranchId,
        activeBranch,
        getBranchById
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};
