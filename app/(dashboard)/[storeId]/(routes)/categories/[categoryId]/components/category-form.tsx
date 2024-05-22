"use client";

import React, { useState } from 'react';
import * as z from "zod";
import { Heading } from "@/components/ui/heading";
import { Billboard, Category } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import { AlertModal } from '@/components/modals/alert.modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1)
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard [];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ 
    initialData , 
    billboards
}) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedBillboard, setSelectedBillboard] = useState(initialData?.billboardId || "");

    const title = initialData ? "Modifier" : "Créer";
    const description = initialData ? "Modifier la catégorie" : "Ajouter une nouvelle catégorie";
    const toastMessage = initialData ? "Mise à jour réussie" : "Création réussie";
    const action = initialData ? "Enregistrer" : "Créer";

    const { handleSubmit, register, formState: { errors }, setValue } = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            billboardId: ''
        }
    });

    const onSubmit: SubmitHandler<CategoryFormValues> = async (data) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/categories`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/categories`);
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast.success("Catégories supprimée.");
        } catch (error) {
            toast.error("Assurez-vous d'abord d'avoir supprimé toutes les produits  utilisant cette catégorie.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    const handleBillboardChange = (value: string) => {
        setSelectedBillboard(value);
        setValue("billboardId", value);
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
                <div className="mb-4 flex space-x-4"> {/* Ajoutez une marge en bas et utilisez Flexbox pour espacer les éléments horizontalement */}
                    <div className="w-1/2"> {/* Div parente pour le premier champ */}
                        <label htmlFor="label" className="block mt-4 text-sm font-medium text-gray-700">Nom</label>
                        <div className="relative">
                            <input
                                id="name"
                                {...register("name")}
                                placeholder="Nom de la catégorie"
                                type="text"
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full" 
                                disabled= {loading}
                            />
                            {errors.name && ( // Affichez le message d'erreur en bas
                                <span className="text-red-500 absolute bottom-0 left-0">{errors.name.message}</span>
                            )}
                        </div>
                    </div>

                    <div className="w-1/2"> {/* Div parente pour le deuxième champ */}
                            <label htmlFor="billboardId" className="block mt-4 text-sm font-medium text-gray-700">Exposition</label>
                            <div className="relative">
                                <Select
                                    disabled={loading}
                                    onValueChange={handleBillboardChange}
                                    value={selectedBillboard}
                                    defaultValue={initialData?.billboardId || ""}
                                >
                                    <SelectTrigger className="mt-1 p-2 border border-gray-300 rounded-md w-full">
                                        <SelectValue placeholder="Choisissez une exposition" />
                                    </SelectTrigger>
                                    <SelectContent className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                        {billboards.map((billboard) => (
                                            <SelectItem 
                                                key={billboard.id}
                                                value={billboard.id}
                                            >
                                                {billboard.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            
                                
                            {errors.billboardId && (
                                <span className="text-red-500 absolute bottom-0 left-0">{errors.billboardId.message}</span>
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

export default CategoryForm;
