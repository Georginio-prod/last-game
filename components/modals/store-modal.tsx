"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";


export const StoreModal = () => {
    const StoreModal = useStoreModal();

    return(
        <Modal 
        title="Créer une boutique"
        description="Ajouter une nouvelle boutique pour gérer les produits et les catégories"    
        isOpen= {StoreModal.isOpen}
        onClose={StoreModal.onClose}
    >
        Formulaire de création d'une nouvelle boutique
    </Modal>
    )
   
}