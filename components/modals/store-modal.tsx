"use client";
import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";



const formSchema = z.object ({
    name: z.string().min(1),
})

export const StoreModal = () => {
    const StoreModal = useStoreModal();


    const  [loading, setLoading] =useState (false);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",

        }
    })

    const onSubmit = async ( values: z.infer<typeof formSchema>) => {
       try{
        setLoading(true);

        throw new Error ("x🔴")

        const response = await axios.post ('/api/stores', values);

        toast.success("Boutique crée👌");
       }catch (error) {
        toast.error("Quelque chose s'est mal passé")
       } finally {
        setLoading(false)
       }
    }

    return(
        <Modal 
        title="Créer une boutique"
        description="Ajouter une nouvelle boutique pour gérer les produits et les catégories"    
        isOpen= {StoreModal.isOpen}
        onClose={StoreModal.onClose}
    >
       <div>
        <div className="space-y-4 py-2 pb-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name ="name"
                        render={({ field}) => (
                            <FormItem>
                                <FormLabel>Nom</FormLabel>
                                <FormControl>
                                    <Input 
                                        disabled={loading}
                                        placeholder="E-commerce" 
                                        {...field} 
                                    />
                                
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )} 
                    >
                    </FormField>

                    <div className="
                        pt-6
                        space-x-2
                        flex
                        items-center
                        justify-end
                        w-full
                    ">
                        <Button 
                            disabled={loading}
                            variant="outline" 
                            onClick={StoreModal.onClose}
                        >Cancel
                        </Button>

                        <Button
                            disabled={loading}
                            type="submit"
                        >
                        Continue
                        </Button>

                    </div>
                </form>
            </Form>
        </div>
       </div>
    </Modal>
    )
   
}