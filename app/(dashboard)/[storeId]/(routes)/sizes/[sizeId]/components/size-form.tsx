"use client";

import React, { useState } from 'react';
import * as z from "zod";
import { Heading } from "@/components/ui/heading";
import { Size } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import { AlertModal } from '@/components/modals/alert.modal';


const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1)
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
    initialData: Size | null;
}

export const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    

    const title = initialData ? "Modifier le Types" : "Créer";
    const description = initialData ? "Modifier l'affichage" : "Ajouter un nouvel affichage";
    const toastMessage = initialData ? "Mise à jour réussie" : "Création réussie";
    const action = initialData ? "Enregistrer" : "Créer";

    const { handleSubmit, register, formState: { errors }, setValue } = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    });

   

    const onSubmit: SubmitHandler<SizeFormValues> = async (data) => {
        try {
            setLoading(true);
            if (initialData){
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/sizes`, data);
            }
           
            router.refresh();
            router.push(`/${params.storeId}/sizes`)
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Quelque chose s'est mal passé.");
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
            router.refresh();
            router.push(`/${params.storeId}/sizes`);
            toast.success("Types supprimée.");
        } catch (error) {
            toast.error("Assurez-vous d'abord d'avoir supprimé toutes les produits utilisant les Typess");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />

            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="icon"
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator />

            <form onSubmit={handleSubmit(onSubmit)}>
                
                <div className="mb-4 flex space-x-4"> {/* Ajoutez une marge en bas et espace entre les éléments */}
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Nom</label>
                        <div className="relative">
                            <input
                                id="name"
                                {...register("name")}
                                placeholder="Types ...."
                                type="text"
                                className="mt-1 p-2 border border-gray-300 rounded-md"
                                disabled={loading}
                            />
                            {errors.name && (
                                <span className="text-red-500 absolute bottom-0 left-0">{errors.name.message}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="field" className="text-sm font-medium text-gray-700">Valeur</label>
                        <div className="relative">
                            <input
                                id="value"
                                {...register("value")}
                                placeholder="Valeur ...."
                                type="text"
                                className="mt-1 p-2 border border-gray-300 rounded-md"
                                disabled={loading}
                            />
                            {errors.name && (
                                <span className="text-red-500 absolute bottom-0 left-0">{errors.name.message}</span>
                            )}
                        </div>
                    </div>
                </div>


                <Button disabled={loading} className="mt-2 mb-2 rounded-full" type="submit">
                    {action}
                </Button>

            </form>
        </>
    );
};

export default SizeForm;
