'use client'

import { useState } from 'react'
import type { Folder, Item } from '@/app/dashboard/page'

interface AddItemModalProps {
  folderId: string
  folders: Folder[]
  onClose: () => void
  onAdd: (item: Omit<Item, 'id' | 'created_at'>) => void
}

export default function AddItemModal({ folderId, folders, onClose, onAdd }: AddItemModalProps) {
  const [type, setType] = useState<Item['type']>('article')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [selectedFolderId, setSelectedFolderId] = useState(folderId)
  const [source, setSource] = useState('extern')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) return

    onAdd({
      folder_id: selectedFolderId,
      type,
      title: title.trim(),
      url: url.trim() || undefined,
      note_content: noteContent.trim() || undefined,
      source,
      is_done: false,
    })
  }

  const itemTypes = [
    { value: 'article', label: 'Artikel', icon: '📄' },
    { value: 'external', label: 'Externe link', icon: '🔗' },
    { value: 'note', label: 'Notitie', icon: '📝' },
    { value: 'checklist', label: 'Taak', icon: '☑️' },
  ]

  const sources = [
    { value: 'infofrankrijk', label: 'InfoFrankrijk' },
    { value: 'forum', label: 'Forum' },
    { value: 'nedergids', label: 'NederGids' },
    { value: 'extern', label: 'Extern' },
  ]

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-poppins text-lg font-semibold text-gray-800">
            Item toevoegen
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {itemTypes.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value as Item['type'])}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    type === t.value 
                      ? 'border-ifr-800 bg-red-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">{t.icon}</div>
                  <div className="text-xs font-medium">{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dossier
            </label>
            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ifr-800 focus:border-transparent outline-none"
            >
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>
                  {folder.icon} {folder.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titel
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bijv. Déclaration de revenus uitleg"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ifr-800 focus:border-transparent outline-none"
            />
          </div>

          {(type === 'article' || type === 'external') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ifr-800 focus:border-transparent outline-none"
              />
            </div>
          )}

          {type === 'note' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notitie
              </label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Je notitie..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ifr-800 focus:border-transparent outline-none resize-none"
              />
            </div>
          )}

          {(type === 'article' || type === 'external') && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bron
              </label>
              <div className="flex flex-wrap gap-2">
                {sources.map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSource(s.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      source === s.value 
                        ? 'bg-ifr-800 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-ifr-800 text-white rounded-lg font-medium hover:bg-ifr-700 transition-all"
            >
              Toevoegen
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
