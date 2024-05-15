import { create }  from "zustand";

interface useStoreModalStrore {
    isOpen : boolean;
    onOpen: () => void;
    onClose : () => void;
}

export const useStoreModal = create<useStoreModalStrore>((set) => ({
    isOpen: false,
    onOpen : () => set ({ isOpen: true}),
    onClose: () => set ({isOpen: false}),
})) 