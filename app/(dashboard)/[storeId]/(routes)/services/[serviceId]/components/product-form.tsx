'use client'

import * as z from 'zod'
import axios from 'axios'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Trash } from 'lucide-react'
import { Video, Service } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Heading } from '@/components/ui/heading'
import { AlertModal } from '@/components/modals/alert-modal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ImageUpload from '@/components/ui/image-upload' //TODO:
import { Checkbox } from '@/components/ui/checkbox'

const formSchema = z.object({
  name: z.string().min(1),
  videos: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  description: z.string().min(2),
})

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  initialData:
    | (Service & {
        videos: Video[]
      })
    | null
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? 'Edit service' : 'Create service'
  const description = initialData ? 'Edit a service.' : 'Add a new service'
  const toastMessage = initialData ? 'service updated.' : 'service created.'
  const action = initialData ? 'Save changes' : 'Create'

  const defaultValues = initialData
    ? {
        ...initialData,
        price: parseFloat(String(initialData?.price)),
      }
    : {
        name: '',
        description: '',
        videos: [],
        price: 0,
      }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true)
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/services/${params.serviceId}`,
          data
        )
      } else {
        await axios.post(`/api/${params.storeId}/services`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/services`)
      toast.success(toastMessage)
    } catch (error: any) {
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/services/${params.serviceId}`)
      router.refresh()
      router.push(`/${params.storeId}/services`)
      toast.success('service deleted.')
    } catch (error: any) {
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="videos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Videos</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((video) => video.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Service name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Service description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
