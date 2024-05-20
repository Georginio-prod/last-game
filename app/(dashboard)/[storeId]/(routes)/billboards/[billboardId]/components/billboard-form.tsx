"use client";

import React, { useState } from 'react';
import * as z from "zod";
import { Heading } from "@/components/ui/heading";
import { Billboard, Store } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { FileDiff, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormField, Form, FormMessage } from '@/components/ui/form';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import { AlertModal } from '@/components/modals/alert.modal';
import { ApiAlert } from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';
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
    const origin = useOrigin();


    const [open , setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Modifier" : "Créer"
    const description = initialData ? "Modifier" : "Ajouter"
    const toastMessage = initialData ? "Mettre à jour" : "Créer"
    const action = initialData ? "Enrégistrer" : "Créer"

    const { handleSubmit, register, formState: { errors } } = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        }
    });

    const onSubmit: SubmitHandler<BillboardFormValues> = async (data) => {
        try {
            console.log(data);
            setLoading(true);
            await axios.patch (`/api/stores/${params.storeId}`, data);
            router.refresh();
           toast.success("Boutique mise à jour")
        }catch (error) {
            toast.error ("quelque chose s'est mal passé.");
        } finally {
            setLoading(false);
        }
        // Handle form submission
       
    };

    const onDelete = async () => {
        try{
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh();
            router.push("/")
            toast.success("Boutique supprimer.")
        }catch (error) {
            toast.error("Assurez-vous d'abord d'avoir supprimé tous les produits et catégories.")
        }finally  {
            setLoading (false)
            setOpen(false )
        }
    }

    return (
        <>
        <AlertModal
            isOpen= {open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading= {loading}
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
                    <Trash className="h-4 w-4"/>
                    </Button>
                )}
               
            </div>
            <Separator/>
          
            <form onSubmit={handleSubmit(onSubmit)}>
                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">Image de fond</label>
                <input
                    id="name"
                    {...register("label")}
                    placeholder="Etiquette d'affichage"
                    type="text"
                    className="mt-1 p-2 border border-gray-300 rounded-md "
                       
                />

                
               
               
                <div className='grid grid-cols-1 gap-8'>
                    {/* Ajoutez d'autres champs de formulaire ici si nécessaire */}
                   
                </div>

                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Etiquette</label>
                <input
                    id="name"
                    {...register("label")}
                    placeholder="Etiquette d'affichage"
                    type="text"
                    className="mt-1 p-2 border border-gray-300 rounded-md "
                       
                />
                <div className="flex flex-col">
                {errors.label && <span className="text-red-500 justify-center">{errors.label.message}</span>}
                </div>
               
               
                <div className='grid grid-cols-1 gap-8'>
                    {/* Ajoutez d'autres champs de formulaire ici si nécessaire */}
                   
                </div>
                <Button disabled={loading} className=" m-6 ml-auto" type="submit" >
                    {action}
                </Button>
            </form>

           <Separator/>
           
          
        </>
    );
};

export default BillboardForm;
