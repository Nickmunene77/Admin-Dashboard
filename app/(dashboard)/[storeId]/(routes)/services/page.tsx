import { format } from 'date-fns'

import prismadb from '@/lib/prismadb'
import { formatter } from '@/lib/utils'

import { ProductsClient } from './components/client'
import { ProductColumn } from './components/columns'

const ServicesPage = async ({ params }: { params: { storeId: string } }) => {
  const services = await prismadb.service.findMany({
    where: {
      storeId: params.storeId,
    },

    orderBy: {
      createdAt: 'desc',
    },
  })

  const formattedServices: ProductColumn[] = services.map((item) => ({
    id: item.id,
    name: item.name,

    price: formatter.format(item.price.toNumber()),
    description: item.description,

    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedServices} />
      </div>
    </div>
  )
}

export default ServicesPage
