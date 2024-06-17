"use client";

import React, { useState } from 'react';
import * as z from "zod";
import { Heading } from "@/components/ui/heading";
import { Billboard } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import { AlertModal } from '@/components/modals/alert.modal';
import ImageUpload from '@/components/ui/image-upload';

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
    initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>(initialData ? [initialData.imageUrl] : []);

    const title = initialData ? "Modifier" : "Créer";
    const description = initialData ? "Modifier l'affichage" : "Ajouter un nouvel affichage";
    const toastMessage = initialData ? "Mise à jour réussie" : "Création réussie";
    const action = initialData ? "Enregistrer" : "Créer";

    const { handleSubmit, register, formState: { errors }, setValue } = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        }
    });

    const handleAddImage = (url: string) => {
        setImages([url]);
        setValue("imageUrl", url);
    };

    const handleRemoveImage = () => {
        setImages([]);
        setValue("imageUrl", '');
    };

    const onSubmit: SubmitHandler<BillboardFormValues> = async (data) => {
        try {
            setLoading(true);
            if (initialData){
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, data);
            }
           
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
            toast.success("Exposition supprimée.");
        } catch (error) {
            toast.error("Assurez-vous d'abord d'avoir supprimé toutes les catégories utilisant ces panneaux d'affichage.");
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
                <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700">Image de fond</label>
                <ImageUpload
                    value={images}
                    disabled={loading}
                    onChange={handleAddImage}
                    onRemove={handleRemoveImage}
                />
                {errors.imageUrl && <span className="text-red-500">{errors.imageUrl.message}</span>}

                <div className="mb-4"> {/* Ajoutez une marge en bas */}
                    <label htmlFor="label" className="block mt-4 text-sm font-medium text-gray-700">Étiquette</label>
                    <div className="relative">
                        <input
                            id="label"
                            {...register("label")}
                            placeholder="Étiquette d'affichage"
                            type="text"
                            className="mt-1 p-2 border border-gray-300 rounded-md"
                            disabled= {loading}
                        />
                        {errors.label && ( // Affichez le message d'erreur en bas
                            <span className="text-red-500 absolute bottom-0 left-0">{errors.label.message}</span>
                        )}
                    </div>
                </div>

                <Button disabled={loading} className="mt-2 mb-2 rounded-full" type="submit">
                    {action}
                </Button>

            </form>
        </>
    );
};

export default BillboardForm;
