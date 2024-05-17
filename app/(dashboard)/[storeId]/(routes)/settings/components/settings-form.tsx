"use client";

import React, { useState } from 'react';
import * as z from "zod";
import { Heading } from "@/components/ui/heading";
import { Store } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormField, Form, FormMessage } from '@/components/ui/form';


interface SettingsFormProps {
    initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(1)
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {

    const [open , setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { handleSubmit, register, formState: { errors } } = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const onSubmit: SubmitHandler<SettingsFormValues> = (data) => {
        // Handle form submission
        console.log(data);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title="Paramètres"
                    description="Gérer les préférences de la boutique"
                />
                <Button
                    disabled={loading}
                    variant="destructive"
                    size="icon"
                    onClick={() => setOpen(true)}
                >
                    <Trash className="h-4 w-4"/>
                </Button>
            </div>
            <Separator/>
          
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    id="name"
                    {...register("name")}
                    placeholder="Nom de la boutique"
                    type="text"
                    className="mt-1 p-2 border border-gray-300 rounded-md "
                       
                />
                <div className="flex flex-col">
                {errors.name && <span className="text-red-500 justify-center">{errors.name.message}</span>}
                </div>
               
               
                <div className='grid grid-cols-1 gap-8'>
                    {/* Ajoutez d'autres champs de formulaire ici si nécessaire */}
                   
                </div>
                <Button disabled={loading} className=" m-6 ml-auto" type="submit" >
                    Save
                </Button>
            </form>

           
           
            
          
        </>
    );
};

export default SettingsForm;
