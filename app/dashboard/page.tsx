'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import FolderList from '@/components/FolderList'
import QuickStats from '@/components/QuickStats'
import AddItemModal from '@/components/AddItemModal'

export interface Folder {
  id: string
  name: string
  icon: string
  parent_id: string | null
  sort_order: number
  items?: Item[]
}

export interface Item {
  id: string
  folder_id: string
  type: 'article' | 'external' | 'note' | 'checklist'
  title: string
  url?: string
  note_content?: string
  source?: string
  is_done: boolean
  created_at: string
}

export default function DashboardPage() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  
  const supabase = createClient()

  const defaultFolders: Omit<Folder, 'id'>[] = [
    { name: 'Belastingen FR', icon: '💶', parent_id: null, sort_order: 1 },
    { name: 'Wonen', icon: '🏠', parent_id: null, sort_order: 2 },
    { name: 'Werk', icon: '💼', parent_id: null, sort_order: 3 },
    { name: 'Zorg', icon: '🏥', parent_id: null, sort_order: 4 },
    { name: 'Auto & Rijbewijs', icon: '🚗', parent_id: null, sort_order: 5 },
    { name: 'Praktisch', icon: '🔧', parent_id: null, sort_order: 6 },
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    
    const { data: foldersData, error: foldersError } = await supabase
      .from('folders')
      .select('*')
      .order('sort_order')
    
    if (foldersError) {
      console.error('Error loading folders:', foldersError)
    }

    if (!foldersData || foldersData.length === 0) {
      const { data: newFolders } = await supabase
        .from('folders')
        .insert(defaultFolders)
        .select()
      
      setFolders(newFolders || [])
    } else {
      setFolders(foldersData)
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (itemsError) {
      console.error('Error loading items:', itemsError)
    }
    
    setItems(itemsData || [])
    setLoading(false)
  }

  const handleAddItem = async (item: Omit<Item, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('items')
      .insert(item)
      .select()
      .single()
    
    if (error) {
      console.error('Error adding item:', error)
      return
    }
    
    setItems([data, ...items])
    setShowAddModal(false)
  }

  const handleToggleChecklist = async (itemId: string, isDone: boolean) => {
    const { error } = await supabase
      .from('items')
      .update({ is_done: isDone })
      .eq('id', itemId)
    
    if (error) {
      console.error('Error updating item:', error)
      return
    }
    
    setItems(items.map(item => 
      item.id === itemId ? { ...item, is_done: isDone } : item
    ))
  }

  const handleDeleteItem = async (itemId: string) => {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId)
    
    if (error) {
      console.error('Error deleting item:', error)
      return
    }
    
    setItems(items.filter(item => item.id !== itemId))
  }

  const openAddModal = (folderId: string) => {
    setSelectedFolderId(folderId)
    setShowAddModal(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-ifr-800 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Dashboard laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <QuickStats folders={folders} items={items} />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-poppins text-xl font-semibold text-gray-800">
            Mijn Dossiers
          </h2>
        </div>
        
        <FolderList 
          folders={folders}
          items={items}
          onAddItem={openAddModal}
          onToggleChecklist={handleToggleChecklist}
          onDeleteItem={handleDeleteItem}
        />
      </div>

      {showAddModal && selectedFolderId && (
        <AddItemModal
          folderId={selectedFolderId}
          folders={folders}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddItem}
        />
      )}

      <button
        onClick={() => {
          setSelectedFolderId(folders[0]?.id || null)
          setShowAddModal(true)
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-ifr-800 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-ifr-700 transition-all md:hidden"
      >
        +
      </button>
    </div>
  )
}
