"use client";

import React, { useState, useEffect } from "react";
import * as z from "zod";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert.modal";
import ImageUpload from "@/components/ui/image-upload";
import { Category, Color, Product, Size } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    images: z.array(z.object({ url: z.string().url() })),
    price: z.number().min(1, "Le prix doit être supérieur à 0"),
    categoryId: z.string().min(1, "La catégorie est requise"),
    colorId: z.string().min(1, "La couleur est requise"),
    sizeId: z.string().min(1, "La taille est requise"),
    featureStatus: z.enum(["featured", "archived"]).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialData: (Product & {
        images: { url: string }[];
    }) | null;
    categories: Category[];
    colors: Color[];
    sizes: Size[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    colors,
    sizes,
}) => {
    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<{ url: string }[]>(initialData ? initialData.images : []);

    const title = initialData ? "Modifier" : "Créer";
    const description = initialData ? "Modifier le produit" : "Ajouter un nouvel affichage";
    const toastMessage = initialData ? "Mise à jour réussie" : "Création réussie";
    const action = initialData ? "Enregistrer" : "Créer";

    const { handleSubmit, register, formState: { errors }, setValue, watch } = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price)),
        } : {
            name: "",
            images: [],
            price: 0,
            categoryId: "",
            colorId: "",
            sizeId: "",
            featureStatus: undefined,
            
        }
    });

    useEffect(() => {
        setValue("images", images);
    }, [images, setValue]);

    const handleAddImage = (url: string) => {
        setImages(prevImages => [...prevImages, { url }]);
    };

    const handleRemoveImage = (url: string) => {
        setImages(prevImages => prevImages.filter(image => image.url !== url));
    };

    const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
        try {
            setLoading(true);
            const formData = {
                ...data,
                images,
                isFeatured: data.featureStatus === "featured",
                isArchived: data.featureStatus === "archived",
            };

            if (initialData) {
                await fetch(`/api/${params.storeId}/products/${params.productId}`, {
                    method: "PATCH",
                    body: JSON.stringify(formData),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            } else {
                await fetch(`/api/${params.storeId}/products`, {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }
            router.refresh();
            router.push(`/${params.storeId}/products`);
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast.success("Produit supprimé.");
        } catch (error) {
            toast.error("Assurez-vous d'abord d'avoir supprimé toutes les produits associés.");
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
                <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700">Images</label>
                <ImageUpload
                    value={images.map(image => image.url)}
                    disabled={loading}
                    onChange={handleAddImage}
                    onRemove={handleRemoveImage}
                />
                {errors.images && <span className="text-red-500">{errors.images.message}</span>}

                <div className="mb-4 flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="name" className="block mt-4 text-sm font-medium text-gray-700">Nom</label>
                        <div className="relative">
                            <input
                                id="name"
                                {...register("name")}
                                placeholder="produit.."
                                type="text"
                                className="mt-1 p-2 border border-gray-300 rounded-md"
                                disabled={loading}
                            />
                            {errors.name && (
                                <span className="text-red-500 absolute bottom-0 left-0">{errors.name.message}</span>
                            )}
                        </div>
                    </div>

                    <div className="w-1/2">
                        <label htmlFor="price" className="block mt-4 text-sm font-medium text-gray-700">Prix</label>
                        <div className="relative">
                            <input
                                id="price"
                                {...register("price", { valueAsNumber: true })}
                                placeholder="99.09.."
                                type="number"
                                inputMode="numeric"
                                className="mt-1 p-2 border border-gray-300 rounded-md"
                                disabled={loading}
                            />
                            {errors.price && (
                                <span className="text-red-500 absolute bottom-0 left-0">{errors.price.message}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-4 flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="sizeId" className="block mt-4 text-sm font-medium text-gray-700">Taille</label>
                        <div className="relative">
                            <Select onValueChange={(value) => setValue("sizeId", value)}>
                                <SelectTrigger className="mt-1 p-2 border border-gray-300 rounded-md w-full">
                                    <SelectValue placeholder="Choisissez la taille" />
                                </SelectTrigger>
                                <SelectContent className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                    {sizes.map((size) => (
                                        <SelectItem
                                            key={size.id}
                                            value={size.id}
                                        >
                                            {size.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.sizeId && (
                                <span className="text-red-500 absolute bottom-0 left-0">{errors.sizeId.message}</span>
                            )}
                        </div>
                    </div>

                    <div className="w-1/2">
                        <label htmlFor="categoryId" className="block mt-4 text-sm font-medium text-gray-700">Catégories</label>
                        <div className="relative">
                            <Select onValueChange={(value) => setValue("categoryId", value)}>
                                <SelectTrigger className="mt-1 p-2 border border-gray-300 rounded-md w-full">
                                    <SelectValue placeholder="Choisissez la catégorie" />
                                </SelectTrigger>
                                <SelectContent className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.categoryId && (
                                <span className="text-red-500 absolute bottom-0 left-0">{errors.categoryId.message}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-4 flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="colorId" className="block mt-4 text-sm font-medium text-gray-700">Couleurs</label>
                        <div className="relative">
                            <Select onValueChange={(value) => setValue("colorId", value)}>
                                <SelectTrigger className="mt-1 p-2 border border-gray-300 rounded-md w-full">
                                    <SelectValue placeholder="Choisissez une couleur" />
                                </SelectTrigger>
                                <SelectContent className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                    {colors.map((color) => (
                                        <SelectItem
                                            key={color.id}
                                            value={color.id}
                                        >
                                            {color.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.colorId && (
                                <span className="text-red-500 absolute bottom-0 left-0">{errors.colorId.message}</span>
                            )}
                        </div>
                    </div>
                    <div className="mb-4">
                    <label htmlFor="featureStatus" className="block mt-4 text-sm font-medium text-gray-700">Statut</label>
                    <div className="relative">
                        <Select onValueChange={(value) => setValue("featureStatus", value as "featured" | "archived")}>
                            <SelectTrigger className="mt-1 p-2 border border-gray-300 rounded-md w-full">
                                <SelectValue placeholder="Choisissez le statut" />
                            </SelectTrigger>
                            <SelectContent className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                                <SelectItem value="featured">Vedette</SelectItem>
                                <SelectItem value="archived">Archivé</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.featureStatus && (
                            <span className="text-red-500 absolute bottom-0 left-0">{errors.featureStatus.message}</span>
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

export default ProductForm;
