'use client'

import { useState } from 'react'
import type { Folder, Item } from '@/app/dashboard/page'

interface FolderListProps {
  folders: Folder[]
  items: Item[]
  onAddItem: (folderId: string) => void
  onToggleChecklist: (itemId: string, isDone: boolean) => void
  onDeleteItem: (itemId: string) => void
}

export default function FolderList({ 
  folders, 
  items, 
  onAddItem,
  onToggleChecklist,
  onDeleteItem 
}: FolderListProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set([folders[0]?.id]))
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const getItemsForFolder = (folderId: string) => {
    return items.filter(item => item.folder_id === folderId)
  }

  const nonToolSources = ['infofrankrijk', 'forum', 'nedergids', 'extern', 'notitie']

  const getTypeIcon = (type: string, source?: string) => {
    if (source && !nonToolSources.includes(source)) {
      return '⚙️'
    }
    
    switch (type) {
      case 'article': return '📄'
      case 'external': return '🔗'
      case 'note': return '📝'
      case 'checklist': return '☑️'
      default: return '📎'
    }
  }

  const getSummaryLabel = (source?: string) => {
    if (source && !nonToolSources.includes(source)) {
      return { icon: '⚙️', label: 'Tool Output' }
    }
    return { icon: '🤖', label: 'AI Samenvatting' }
  }

  const getSourceBadge = (source?: string) => {
    if (!source) return null
    
    const colors: Record<string, { bg: string, text: string }> = {
      infofrankrijk: { bg: 'bg-ifr-800', text: 'text-white' },
      forum: { bg: 'bg-blue-700', text: 'text-white' },
      nedergids: { bg: 'bg-green-700', text: 'text-white' },
      extern: { bg: 'bg-gray-500', text: 'text-white' },
      notitie: { bg: 'bg-yellow-500', text: 'text-black' },
    }
    
    const style = colors[source] || colors.extern
    
    return (
      <span className={`text-xs px-2 py-0.5 rounded ${style.bg} ${style.text} font-medium uppercase`}>
        {source}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {folders.map((folder) => {
        const folderItems = getItemsForFolder(folder.id)
        const isExpanded = expandedFolders.has(folder.id)
        
        return (
          <div key={folder.id} className="border-b border-gray-100 last:border-b-0">
            <button
              onClick={() => toggleFolder(folder.id)}
              className={`w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-all ${
                isExpanded ? 'bg-red-50/50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{folder.icon}</span>
                <span className="font-semibold text-gray-800">{folder.name}</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {folderItems.length} items
                </span>
              </div>
              <svg 
                className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="bg-gray-50/50">
                {folderItems.length === 0 ? (
                  <div className="px-6 py-8 text-center">
                    <div className="text-4xl mb-2 opacity-50">📂</div>
                    <p className="text-gray-500 mb-4">Nog geen items in dit dossier</p>
                    <button
                      onClick={() => onAddItem(folder.id)}
                      className="px-4 py-2 bg-ifr-800 text-white rounded-lg text-sm font-medium hover:bg-ifr-700 transition-all"
                    >
                      + Voeg eerste item toe
                    </button>
                  </div>
                ) : (
                  <>
                    {folderItems.map((item) => {
                      const isItemExpanded = expandedItems.has(item.id)
                      const hasSummary = item.note_content && item.note_content.length > 0
                      const summaryInfo = getSummaryLabel(item.source)
                      
                      return (
                        <div
                          key={item.id}
                          className="border-t border-gray-100 bg-white hover:bg-gray-50 transition-all group"
                        >
                          <div className="px-6 py-3 pl-14 flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className="text-lg">{getTypeIcon(item.type, item.source)}</span>
                              <div className="flex-1 min-w-0">
                                {item.url ? (
                                  <a 
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`hover:text-ifr-800 hover:underline ${
                                      item.type === 'checklist' && item.is_done 
                                        ? 'text-gray-400 line-through' 
                                        : 'text-gray-800'
                                    }`}
                                  >
                                    {item.title}
                                  </a>
                                ) : (
                                  <span className={
                                    item.type === 'checklist' && item.is_done 
                                      ? 'text-gray-400 line-through' 
                                      : 'text-gray-800'
                                  }>
                                    {item.title}
                                  </span>
                                )}
                                
                                {hasSummary && !isItemExpanded && (
                                  <p 
                                    onClick={() => toggleItem(item.id)}
                                    className="text-sm text-gray-500 mt-1 truncate cursor-pointer hover:text-ifr-800"
                                    title="Klik om volledige inhoud te zien"
                                  >
                                    {item.note_content}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              {hasSummary && (
                                <button
                                  onClick={() => toggleItem(item.id)}
                                  className="text-xs text-ifr-800 hover:underline font-medium"
                                >
                                  {isItemExpanded ? '▲ Minder' : '▼ Samenvatting'}
                                </button>
                              )}
                              
                              {getSourceBadge(item.source)}
                              
                              {item.type === 'checklist' && (
                                <button
                                  onClick={() => onToggleChecklist(item.id, !item.is_done)}
                                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                                    item.is_done 
                                      ? 'bg-green-500 border-green-500 text-white' 
                                      : 'border-gray-300 hover:border-green-500'
                                  }`}
                                >
                                  {item.is_done && '✓'}
                                </button>
                              )}
                              
                              <button
                                onClick={() => onDeleteItem(item.id)}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                                title="Verwijderen"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          
                          {hasSummary && isItemExpanded && (
                            <div className="px-6 py-4 pl-14 bg-amber-50 border-t border-amber-100">
                              <div className="flex items-start gap-2">
                                <span className="text-lg">{summaryInfo.icon}</span>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-amber-800 mb-2">{summaryInfo.label}</p>
                                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {item.note_content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    
                    <button
                      onClick={() => onAddItem(folder.id)}
                      className="w-full px-6 py-3 pl-14 text-left text-sm text-ifr-800 font-medium hover:bg-red-50/50 transition-all border-t border-dashed border-gray-200"
                    >
                      + Item toevoegen
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
