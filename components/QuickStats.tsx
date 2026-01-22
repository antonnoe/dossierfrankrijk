import type { Folder, Item } from '@/app/dashboard/page'

interface QuickStatsProps {
  folders: Folder[]
  items: Item[]
}

export default function QuickStats({ folders, items }: QuickStatsProps) {
  const totalItems = items.length
  const completedChecklists = items.filter(i => i.type === 'checklist' && i.is_done).length
  const totalChecklists = items.filter(i => i.type === 'checklist').length
  const activeFolders = folders.filter(f => 
    items.some(i => i.folder_id === f.id)
  ).length

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Opgeslagen items</div>
        <div className="text-3xl font-bold text-ifr-800">{totalItems}</div>
      </div>
      
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Actieve dossiers</div>
        <div className="text-3xl font-bold text-ifr-800">{activeFolders}</div>
      </div>
      
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Taken voltooid</div>
        <div className="text-3xl font-bold text-green-600">
          {completedChecklists}/{totalChecklists || 0}
        </div>
      </div>
    </div>
  )
}
