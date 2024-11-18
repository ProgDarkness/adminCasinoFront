import AppLayout from 'components/AppLayout'
import { Card } from 'primereact/card'
import { Menu } from './MenuLayout'

function AppLayoutMenus({ children, items }) {
  return (
    <AppLayout>
      <div className="flex flex-row w-[98%] h-[94%] gap-4 m-auto ">
        <div className="basis-[11rem] hidden xl:flex h-full overflow-auto opacity-90 border-2 border-[#006993d3] redondeo-xl bg-[#ffffffc7]">
          <Menu items={items} />
        </div>
        <div className="basis-full xl:basis-[90%]">
          <Card className="redondeo-xl h-full overflow-auto border-2 border-[#006993d3] opacity-80">
            {children}
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

export { AppLayoutMenus }
