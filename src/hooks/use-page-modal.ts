import { useState } from "react";

export const usePageModals = <TData, TId = string>() => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<TId | null>(null);

  const handleDetailClick = (id: TId) => {
    setSelectedId(id);
    setIsDetailModalOpen(true);
  };

  const handleDetailModalOpenChange = (isOpen: boolean) => {
    setIsDetailModalOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setSelectedId(null);
      }, 200);
    }
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDataForEdit, setSelectedDataForEdit] = useState<TData | null>(
    null
  );

  const handleEditClick = (data: TData) => {
    setSelectedDataForEdit(data);
    setIsEditModalOpen(true);
  };

  const handleEditModalOpenChange = (isOpen: boolean) => {
    setIsEditModalOpen(isOpen);
    if (!isOpen) {
      setSelectedDataForEdit(null);
    }
  };

  return {
    isDetailModalOpen,
    selectedId,
    handleDetailClick,
    handleDetailModalOpenChange,

    isEditModalOpen,
    selectedDataForEdit,
    handleEditClick,
    handleEditModalOpenChange,
  };
};
