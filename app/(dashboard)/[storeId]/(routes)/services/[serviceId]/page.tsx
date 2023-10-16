import prismadb from '@/lib/prismadb'

import { ProductForm } from './components/product-form'

const ServicePage = async ({
  params,
}: {
  params: { serviceId: string; storeId: string }
}) => {
  const service = await prismadb.service.findUnique({
    where: {
      id: params.serviceId,
    },
    include: {
      images: true,
      videos: true,
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={service} />
      </div>
    </div>
  )
}

export default ServicePage
